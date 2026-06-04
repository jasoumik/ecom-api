import { WatermarkPosition } from '../models/brand-settings'

export interface IMediaFile {
  id: string
  originalName: string
  fileName: string
  mimeType: string
  originalMimeType: string
  size: number
  width: number | null
  height: number | null
  r2Key: string
  r2Url: string
  hasWatermark: boolean
  entityType: string | null
  entityId: string | null
  uploadedBy: string | null
}

export interface IBrandSettings {
  id: string
  name: string
  logoUrl: string | null
  watermarkPosition: WatermarkPosition
  watermarkOpacity: number
  watermarkSizePercent: number
  watermarkPadding: number
  isActive: boolean
}

export interface IUploadFileDTO {
  buffer: Buffer
  originalname: string
  mimetype: string
  size: number
}

export interface IUploadOptions {
  entityType?: string
  entityId?: string
  uploadedBy?: string
  applyWatermark?: boolean
}

export interface IUpdateBrandSettingsDTO {
  name?: string
  logoUrl?: string | null
  watermarkPosition?: WatermarkPosition
  watermarkOpacity?: number
  watermarkSizePercent?: number
  watermarkPadding?: number
  isActive?: boolean
}

export interface IMediaService {
  uploadFile(file: IUploadFileDTO, options?: IUploadOptions): Promise<IMediaFile>
  deleteFile(id: string): Promise<void>
  getEntityMedia(entityType: string, entityId: string): Promise<IMediaFile[]>
  getActiveBrandSettings(): Promise<IBrandSettings | null>
  createBrandConfig(data: { name: string } & Partial<IUpdateBrandSettingsDTO>): Promise<IBrandSettings>
  updateBrandConfig(id: string, data: IUpdateBrandSettingsDTO): Promise<IBrandSettings>
  uploadBrandLogo(file: IUploadFileDTO): Promise<string>
}
