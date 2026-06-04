import { MedusaService } from '@medusajs/framework/utils'
import sharp from 'sharp'
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import { v4 as uuidv4 } from 'uuid'
import { BrandSettings, WatermarkPosition } from '../models/brand-settings'
import { MediaFile } from '../models/media-file'
import { MediaRepository } from '../repository/media.repository'
import { NotFoundError } from '../../../shared/errors/app-error'
import { createLogger } from '../../../shared/logger'
import type {
  IMediaFile,
  IBrandSettings,
  IUploadFileDTO,
  IUploadOptions,
  IUpdateBrandSettingsDTO,
  IMediaService,
} from '../interfaces/media.interface'

const logger = createLogger('MediaModule')

// ── Constants ────────────────────────────────────────────────────────────────

const IMAGE_MIMES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/avif',
  'image/tiff',
  'image/bmp',
])

const SVG_MIME = 'image/svg+xml'

const MIME_TO_EXT: Record<string, string> = {
  'image/webp': 'webp',
  'image/svg+xml': 'svg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
  'image/avif': 'avif',
  'image/tiff': 'tiff',
  'image/bmp': 'bmp',
  'video/mp4': 'mp4',
  'video/webm': 'webm',
  'video/ogg': 'ogv',
  'video/quicktime': 'mov',
  'application/pdf': 'pdf',
}

// ── Module options type ──────────────────────────────────────────────────────

type ModuleOptions = {
  r2Endpoint: string
  r2AccessKeyId: string
  r2SecretAccessKey: string
  r2Bucket: string
  r2PublicUrl: string
}

type ProcessedImage = {
  buffer: Buffer
  width: number
  height: number
}

// ── Service ──────────────────────────────────────────────────────────────────

export class MediaModuleService
  extends MedusaService({ BrandSettings, MediaFile })
  implements IMediaService
{
  private readonly repo: MediaRepository
  private readonly s3Client: S3Client
  private readonly bucket: string
  private readonly publicUrl: string

  constructor(container: Record<string, unknown>, options: ModuleOptions) {
    super(container)

    this.repo = new MediaRepository(this as unknown as ConstructorParameters<typeof MediaRepository>[0])

    this.s3Client = new S3Client({
      region: 'auto',
      endpoint: options.r2Endpoint,
      credentials: {
        accessKeyId: options.r2AccessKeyId,
        secretAccessKey: options.r2SecretAccessKey,
      },
    })

    this.bucket = options.r2Bucket
    this.publicUrl = options.r2PublicUrl.replace(/\/$/, '')
  }

  // ── uploadFile ───────────────────────────────────────────────────────────────

  async uploadFile(
    file: IUploadFileDTO,
    options: IUploadOptions = {}
  ): Promise<IMediaFile> {
    const { entityType, entityId, uploadedBy, applyWatermark = true } = options

    logger.info('uploadFile', { originalname: file.originalname, mimetype: file.mimetype, size: file.size })

    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const uuid = uuidv4()

    let r2Key: string
    let finalBuffer: Buffer
    let finalMime: string
    let width: number | null = null
    let height: number | null = null
    let hasWatermark = false

    if (IMAGE_MIMES.has(file.mimetype)) {
      const processed = await this.processImage(file.buffer, applyWatermark)
      finalBuffer = processed.buffer
      finalMime = 'image/webp'
      width = processed.width
      height = processed.height
      hasWatermark = applyWatermark && (await this.hasActiveLogo())
      const folder = entityType ? `media/${entityType}` : 'media/general'
      r2Key = `${folder}/${year}/${month}/${uuid}.webp`
    } else if (file.mimetype === SVG_MIME) {
      finalBuffer = file.buffer
      finalMime = SVG_MIME
      const folder = entityType ? `media/${entityType}` : 'media/general'
      r2Key = `${folder}/${year}/${month}/${uuid}.svg`
    } else if (file.mimetype.startsWith('video/')) {
      finalBuffer = file.buffer
      finalMime = file.mimetype
      const ext = this.mimeToExt(file.mimetype)
      r2Key = `media/video/${year}/${month}/${uuid}.${ext}`
    } else {
      finalBuffer = file.buffer
      finalMime = file.mimetype
      const ext = this.mimeToExt(file.mimetype)
      r2Key = `media/document/${year}/${month}/${uuid}.${ext}`
    }

    const r2Url = await this.uploadToR2(finalBuffer, r2Key, finalMime)

    const ext = this.mimeToExt(finalMime)
    const mediaFile = await this.repo.createFile({
      originalName: file.originalname,
      fileName: ext ? `${uuid}.${ext}` : uuid,
      mimeType: finalMime,
      originalMimeType: file.mimetype,
      size: finalBuffer.length,
      width,
      height,
      r2Key,
      r2Url,
      hasWatermark,
      entityType: entityType ?? null,
      entityId: entityId ?? null,
      uploadedBy: uploadedBy ?? null,
    })

    logger.info('uploadFile success', { id: mediaFile.id, r2Key })
    return mediaFile
  }

  // ── deleteFile ───────────────────────────────────────────────────────────────

  async deleteFile(id: string): Promise<void> {
    logger.info('deleteFile', { id })

    const file = await this.repo.findFileById(id)
    if (!file) {
      logger.error('MediaFile not found on delete', { id })
      throw new NotFoundError('MediaFile', id)
    }

    await this.s3Client.send(
      new DeleteObjectCommand({ Bucket: this.bucket, Key: file.r2Key })
    )

    await this.repo.deleteFile(id)
    logger.info('deleteFile success', { id, r2Key: file.r2Key })
  }

  // ── getEntityMedia ────────────────────────────────────────────────────────────

  async getEntityMedia(entityType: string, entityId: string): Promise<IMediaFile[]> {
    logger.info('getEntityMedia', { entityType, entityId })
    const files = await this.repo.findFilesByEntity(entityType, entityId)
    logger.info('getEntityMedia success', { entityType, entityId, count: files.length })
    return files
  }

  // ── Brand Settings ────────────────────────────────────────────────────────────

  async getActiveBrandSettings(): Promise<IBrandSettings | null> {
    logger.info('getActiveBrandSettings')
    const settings = await this.repo.findActiveBrandSettings()
    logger.info('getActiveBrandSettings result', { found: settings !== null })
    return settings
  }

  async createBrandConfig(
    data: { name: string } & Partial<IUpdateBrandSettingsDTO>
  ): Promise<IBrandSettings> {
    logger.info('createBrandConfig', { name: data.name })
    const settings = await this.repo.createBrandSettings(data as Record<string, unknown>)
    logger.info('createBrandConfig success', { id: settings.id })
    return settings
  }

  async updateBrandConfig(id: string, data: IUpdateBrandSettingsDTO): Promise<IBrandSettings> {
    logger.info('updateBrandConfig', { id })
    const updated = await this.repo.updateBrandSettings(id, data)
    logger.info('updateBrandConfig success', { id })
    return updated
  }

  // ── uploadBrandLogo ───────────────────────────────────────────────────────────

  async uploadBrandLogo(file: IUploadFileDTO): Promise<string> {
    logger.info('uploadBrandLogo', { originalname: file.originalname })
    const pipeline = sharp(file.buffer).webp({ quality: 90, effort: 4 })
    const buffer = await pipeline.toBuffer()
    const uuid = uuidv4()
    const r2Key = `brand/watermark/${uuid}.webp`
    const url = await this.uploadToR2(buffer, r2Key, 'image/webp')
    logger.info('uploadBrandLogo success', { r2Key })
    return url
  }

  // ── Private: process image ────────────────────────────────────────────────────

  private async processImage(
    buffer: Buffer,
    applyWatermark: boolean
  ): Promise<ProcessedImage> {
    const metadata = await sharp(buffer).metadata()
    const width = metadata.width ?? 0
    const height = metadata.height ?? 0

    const webpBuffer = await sharp(buffer).webp({ quality: 85, effort: 4 }).toBuffer()

    if (!applyWatermark) {
      return { buffer: webpBuffer, width, height }
    }

    const brandSettings = await this.repo.findActiveBrandSettings()
    if (!brandSettings?.logoUrl) {
      return { buffer: webpBuffer, width, height }
    }

    const watermarked = await this.applyWatermark(webpBuffer, brandSettings)
    return { buffer: watermarked, width, height }
  }

  // ── Private: apply watermark ──────────────────────────────────────────────────

  private async applyWatermark(
    imageBuffer: Buffer,
    settings: IBrandSettings
  ): Promise<Buffer> {
    const image = sharp(imageBuffer)
    const { width = 0, height = 0 } = await image.metadata()

    const response = await fetch(settings.logoUrl as string)
    if (!response.ok) {
      logger.warn('applyWatermark: failed to fetch logo, skipping watermark', { logoUrl: settings.logoUrl })
      return imageBuffer
    }

    const logoBuffer = Buffer.from(await response.arrayBuffer())
    const watermarkWidth = Math.max(
      10,
      Math.round(width * (settings.watermarkSizePercent / 100))
    )

    const resizedLogo = await sharp(logoBuffer).resize(watermarkWidth).ensureAlpha().toBuffer()
    const opacity = Math.round(settings.watermarkOpacity * 255)

    const transparentLogo = await sharp(resizedLogo)
      .composite([
        {
          input: Buffer.from([255, 255, 255, opacity]),
          raw: { width: 1, height: 1, channels: 4 },
          tile: true,
          blend: 'dest-in',
        },
      ])
      .toBuffer()

    const logoMeta = await sharp(transparentLogo).metadata()
    const logoWidth = logoMeta.width ?? watermarkWidth
    const logoHeight = logoMeta.height ?? 0
    const pad = settings.watermarkPadding

    const positionMap: Record<WatermarkPosition, { top: number; left: number }> = {
      [WatermarkPosition.TOP_LEFT]: { top: pad, left: pad },
      [WatermarkPosition.TOP_RIGHT]: { top: pad, left: width - logoWidth - pad },
      [WatermarkPosition.BOTTOM_LEFT]: { top: height - logoHeight - pad, left: pad },
      [WatermarkPosition.BOTTOM_RIGHT]: { top: height - logoHeight - pad, left: width - logoWidth - pad },
      [WatermarkPosition.CENTER]: {
        top: Math.round((height - logoHeight) / 2),
        left: Math.round((width - logoWidth) / 2),
      },
    }

    const pos = positionMap[settings.watermarkPosition] ?? positionMap[WatermarkPosition.BOTTOM_RIGHT]

    return image
      .composite([{ input: transparentLogo, top: pos.top, left: pos.left }])
      .webp({ quality: 85 })
      .toBuffer()
  }

  // ── Private: upload to R2 ─────────────────────────────────────────────────────

  private async uploadToR2(buffer: Buffer, key: string, contentType: string): Promise<string> {
    const upload = new Upload({
      client: this.s3Client,
      params: {
        Bucket: this.bucket,
        Key: key,
        Body: buffer,
        ContentType: contentType,
        CacheControl: 'public, max-age=31536000',
      },
    })
    await upload.done()
    return `${this.publicUrl}/${key}`
  }

  // ── Private: check active logo ────────────────────────────────────────────────

  private async hasActiveLogo(): Promise<boolean> {
    const settings = await this.repo.findActiveBrandSettings()
    return !!settings?.logoUrl
  }

  // ── Private: mime → extension ─────────────────────────────────────────────────

  private mimeToExt(mime: string): string {
    return MIME_TO_EXT[mime] ?? 'bin'
  }
}

export default MediaModuleService
