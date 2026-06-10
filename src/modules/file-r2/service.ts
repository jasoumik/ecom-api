import { AbstractFileProviderService } from '@medusajs/utils'
import { FileTypes } from '@medusajs/types'
import { S3Client, DeleteObjectCommand, GetObjectCommand, CopyObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import sharp from 'sharp'
import { v4 as uuidv4 } from 'uuid'
import type { Readable, Writable } from 'stream'
import { PassThrough } from 'stream'

type Options = {
  r2Endpoint: string
  r2AccessKeyId: string
  r2SecretAccessKey: string
  r2Bucket: string
  r2PublicUrl: string
  watermarkLogoUrl?: string
  watermarkPosition?: 'TOP_LEFT' | 'TOP_RIGHT' | 'BOTTOM_LEFT' | 'BOTTOM_RIGHT' | 'CENTER'
  watermarkOpacity?: number
  watermarkSizePercent?: number
  watermarkPadding?: number
}

const IMAGE_MIMES = new Set([
  'image/jpeg', 'image/jpg', 'image/png', 'image/gif',
  'image/webp', 'image/avif', 'image/tiff', 'image/bmp',
])

type WatermarkConfig = {
  logoUrl: string
  position: string
  opacity: number
  sizePercent: number
  padding: number
}

class R2FileProviderService extends AbstractFileProviderService {
  static identifier = 'r2'

  private s3: S3Client
  private bucket: string
  private publicUrl: string
  private options: Options
  private container: Record<string, unknown>

  constructor(container: Record<string, unknown>, options: Options) {
    super()
    this.container = container
    this.options = options
    this.publicUrl = options.r2PublicUrl.replace(/\/$/, '')
    this.bucket = options.r2Bucket
    this.s3 = new S3Client({
      region: 'auto',
      endpoint: options.r2Endpoint,
      credentials: {
        accessKeyId: options.r2AccessKeyId,
        secretAccessKey: options.r2SecretAccessKey,
      },
    })
  }

  static validateOptions(options: Record<string, unknown>) {
    for (const key of ['r2Endpoint', 'r2AccessKeyId', 'r2SecretAccessKey', 'r2Bucket', 'r2PublicUrl']) {
      if (!options[key]) throw new Error(`R2FileProvider: missing option "${key}"`)
    }
  }

  async upload(file: FileTypes.ProviderUploadFileDTO): Promise<FileTypes.ProviderFileResultDTO> {
    const uuid = uuidv4()
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')

    // content is base64-encoded string
    const buffer = Buffer.from(file.content, 'base64')
    const mimeType = file.mimeType ?? 'application/octet-stream'

    let finalBuffer: Buffer
    let contentType: string
    let key: string

    if (IMAGE_MIMES.has(mimeType)) {
      finalBuffer = await this.processImage(buffer)
      contentType = 'image/webp'
      key = `products/${year}/${month}/${uuid}.webp`
    } else {
      finalBuffer = buffer
      contentType = mimeType
      const ext = file.filename?.split('.').pop() ?? 'bin'
      key = `products/${year}/${month}/${uuid}.${ext}`
    }

    await new Upload({
      client: this.s3,
      params: {
        Bucket: this.bucket,
        Key: key,
        Body: finalBuffer,
        ContentType: contentType,
        CacheControl: 'public, max-age=31536000',
      },
    }).done()

    const url = `${this.publicUrl}/${key}`
    return { url, key }
  }

  async delete(files: FileTypes.ProviderDeleteFileDTO | FileTypes.ProviderDeleteFileDTO[]): Promise<void> {
    const list = Array.isArray(files) ? files : [files]
    await Promise.all(list.map((f) => this.moveToTrash(f.fileKey)))
  }

  // ── Trash management (called from admin API routes) ─────────────────────────

  async listTrash(): Promise<{ key: string; trashedAt: string; originalKey: string; url: string }[]> {
    const res = await this.s3.send(new ListObjectsV2Command({
      Bucket: this.bucket,
      Prefix: 'trash/',
    }))

    return (res.Contents ?? []).map((obj) => {
      const key = obj.Key ?? ''
      // key format: trash/YYYY-MM-DDTHH:mm:ss.sssZ/<original-key>
      const withoutPrefix = key.replace(/^trash\//, '')
      const slashIdx = withoutPrefix.indexOf('/')
      const trashedAt = slashIdx > -1 ? withoutPrefix.substring(0, slashIdx) : ''
      const originalKey = slashIdx > -1 ? withoutPrefix.substring(slashIdx + 1) : withoutPrefix
      return {
        key,
        trashedAt: decodeURIComponent(trashedAt),
        originalKey,
        url: `${this.publicUrl}/${key}`,
      }
    })
  }

  async permanentlyDelete(trashKey: string): Promise<void> {
    await this.s3.send(new DeleteObjectCommand({ Bucket: this.bucket, Key: trashKey }))
  }

  async restoreFromTrash(trashKey: string): Promise<string> {
    const withoutPrefix = trashKey.replace(/^trash\//, '')
    const slashIdx = withoutPrefix.indexOf('/')
    const originalKey = slashIdx > -1 ? withoutPrefix.substring(slashIdx + 1) : withoutPrefix

    await this.s3.send(new CopyObjectCommand({
      Bucket: this.bucket,
      CopySource: `${this.bucket}/${trashKey}`,
      Key: originalKey,
    }))
    await this.s3.send(new DeleteObjectCommand({ Bucket: this.bucket, Key: trashKey }))
    return `${this.publicUrl}/${originalKey}`
  }

  private async moveToTrash(key: string): Promise<void> {
    // Skip if already in trash
    if (key.startsWith('trash/')) {
      await this.s3.send(new DeleteObjectCommand({ Bucket: this.bucket, Key: key }))
      return
    }
    const trashedAt = encodeURIComponent(new Date().toISOString())
    const trashKey = `trash/${trashedAt}/${key}`
    await this.s3.send(new CopyObjectCommand({
      Bucket: this.bucket,
      CopySource: `${this.bucket}/${key}`,
      Key: trashKey,
    }))
    await this.s3.send(new DeleteObjectCommand({ Bucket: this.bucket, Key: key }))
  }

  async getPresignedDownloadUrl(fileData: FileTypes.ProviderGetFileDTO): Promise<string> {
    const cmd = new GetObjectCommand({ Bucket: this.bucket, Key: fileData.fileKey })
    return getSignedUrl(this.s3, cmd, { expiresIn: 3600 })
  }

  async getDownloadStream(fileData: FileTypes.ProviderGetFileDTO): Promise<Readable> {
    const cmd = new GetObjectCommand({ Bucket: this.bucket, Key: fileData.fileKey })
    const res = await this.s3.send(cmd)
    return res.Body as Readable
  }

  async getAsBuffer(fileData: FileTypes.ProviderGetFileDTO): Promise<Buffer> {
    const stream = await this.getDownloadStream(fileData)
    return streamToBuffer(stream)
  }

  async getUploadStream(fileData: FileTypes.ProviderUploadStreamDTO): Promise<{
    writeStream: Writable
    promise: Promise<FileTypes.ProviderFileResultDTO>
    url: string
    fileKey: string
  }> {
    const uuid = uuidv4()
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const ext = fileData.filename?.split('.').pop() ?? 'bin'
    const key = `products/${year}/${month}/${uuid}.${ext}`
    const url = `${this.publicUrl}/${key}`

    const passThrough = new PassThrough()

    const promise = new Upload({
      client: this.s3,
      params: {
        Bucket: this.bucket,
        Key: key,
        Body: passThrough,
        ContentType: fileData.mimeType ?? 'application/octet-stream',
        CacheControl: 'public, max-age=31536000',
      },
    }).done().then(() => ({ url, key }))

    return { writeStream: passThrough, promise, url, fileKey: key }
  }

  // ── Image processing ────────────────────────────────────────────────────────

  private async resolveWatermarkConfig(): Promise<WatermarkConfig | null> {
    // 1. Try DB (Brand Settings)
    try {
      const mediaSvc = this.container['mediaModule'] as any
      if (mediaSvc) {
        const settings = await mediaSvc.getActiveBrandSettings()
        if (settings?.logoUrl) {
          return {
            logoUrl: settings.logoUrl,
            position: settings.watermarkPosition ?? 'CENTER',
            opacity: settings.watermarkOpacity ?? 0.15,
            sizePercent: settings.watermarkSizePercent ?? 15,
            padding: settings.watermarkPadding ?? 20,
          }
        }
      }
    } catch { /* media module not available, fall through */ }

    // 2. Try env
    if (this.options.watermarkLogoUrl) {
      return {
        logoUrl: this.options.watermarkLogoUrl,
        position: this.options.watermarkPosition ?? 'CENTER',
        opacity: this.options.watermarkOpacity ?? 0.15,
        sizePercent: this.options.watermarkSizePercent ?? 15,
        padding: this.options.watermarkPadding ?? 20,
      }
    }

    // 3. No watermark
    return null
  }

  private async processImage(buffer: Buffer): Promise<Buffer> {
    const webp = await sharp(buffer).webp({ quality: 85, effort: 4 }).toBuffer()

    const config = await this.resolveWatermarkConfig()
    if (!config) return webp

    try {
      return await this.applyWatermark(webp, config)
    } catch {
      return webp
    }
  }

  private async applyWatermark(imageBuffer: Buffer, config: WatermarkConfig): Promise<Buffer> {
    const image = sharp(imageBuffer)
    const { width = 800, height = 800 } = await image.metadata()

    const logoRes = await fetch(config.logoUrl)
    if (!logoRes.ok) return imageBuffer

    const logoBuffer = Buffer.from(await logoRes.arrayBuffer())
    const sizePercent = config.sizePercent
    const opacity = config.opacity
    const padding = config.padding
    const position = config.position

    const watermarkWidth = Math.max(10, Math.round(width * (sizePercent / 100)))
    const resizedLogo = await sharp(logoBuffer).resize(watermarkWidth).ensureAlpha().toBuffer()

    const opacityByte = Math.round(opacity * 255)
    const transparentLogo = await sharp(resizedLogo)
      .composite([{
        input: Buffer.from([255, 255, 255, opacityByte]),
        raw: { width: 1, height: 1, channels: 4 },
        tile: true,
        blend: 'dest-in',
      }])
      .toBuffer()

    const logoMeta = await sharp(transparentLogo).metadata()
    const lw = logoMeta.width ?? watermarkWidth
    const lh = logoMeta.height ?? 0

    const posMap: Record<string, { top: number; left: number }> = {
      TOP_LEFT:     { top: padding, left: padding },
      TOP_RIGHT:    { top: padding, left: width - lw - padding },
      BOTTOM_LEFT:  { top: height - lh - padding, left: padding },
      BOTTOM_RIGHT: { top: height - lh - padding, left: width - lw - padding },
      CENTER:       { top: Math.round((height - lh) / 2), left: Math.round((width - lw) / 2) },
    }

    const pos = posMap[position] ?? posMap['BOTTOM_RIGHT']

    return image
      .composite([{ input: transparentLogo, top: pos.top, left: pos.left }])
      .webp({ quality: 85 })
      .toBuffer()
  }
}

async function streamToBuffer(stream: Readable): Promise<Buffer> {
  const chunks: Buffer[] = []
  for await (const chunk of stream) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
  }
  return Buffer.concat(chunks)
}

export default R2FileProviderService
