import type { IMediaFile, IBrandSettings, IUpdateBrandSettingsDTO } from '../interfaces/media.interface'

type ServiceAdapter = {
  listMediaFiles(filters?: Record<string, unknown>): Promise<IMediaFile[]>
  createMediaFiles(data: Record<string, unknown>): Promise<IMediaFile>
  deleteMediaFiles(id: string): Promise<void>

  listBrandSettings(filters?: Record<string, unknown>): Promise<IBrandSettings[]>
  createBrandSettings(data: Record<string, unknown>): Promise<IBrandSettings>
  updateBrandSettings(updates: Array<{ id: string } & Record<string, unknown>>): Promise<IBrandSettings[]>
}

export class MediaRepository {
  constructor(private readonly svc: ServiceAdapter) {}

  // ── Media Files ──────────────────────────────────────────────────────────────

  async findFileById(id: string): Promise<IMediaFile | null> {
    const results = await this.svc.listMediaFiles({ id })
    return results[0] ?? null
  }

  async findFilesByEntity(entityType: string, entityId: string): Promise<IMediaFile[]> {
    return this.svc.listMediaFiles({ entityType, entityId })
  }

  async createFile(data: Record<string, unknown>): Promise<IMediaFile> {
    return this.svc.createMediaFiles(data)
  }

  async deleteFile(id: string): Promise<void> {
    return this.svc.deleteMediaFiles(id)
  }

  // ── Brand Settings ───────────────────────────────────────────────────────────

  async findActiveBrandSettings(): Promise<IBrandSettings | null> {
    const results = await this.svc.listBrandSettings({ isActive: true })
    return results[0] ?? null
  }

  async createBrandSettings(data: Record<string, unknown>): Promise<IBrandSettings> {
    return this.svc.createBrandSettings(data)
  }

  async updateBrandSettings(id: string, data: IUpdateBrandSettingsDTO): Promise<IBrandSettings> {
    const [updated] = await this.svc.updateBrandSettings([{ id, ...data }])
    return updated
  }
}
