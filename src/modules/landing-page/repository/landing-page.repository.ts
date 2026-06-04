import type {
  ILandingPage,
  ICreateLandingPageDTO,
  IUpdateLandingPageDTO,
} from '../interfaces/landing-page.interface'

type ServiceAdapter = {
  listLandingPages(filters?: Record<string, unknown>): Promise<ILandingPage[]>
  retrieveLandingPage(id: string): Promise<ILandingPage>
  createLandingPages(data: Record<string, unknown>): Promise<ILandingPage>
  updateLandingPages(id: string, data: Record<string, unknown>): Promise<ILandingPage>
  deleteLandingPages(id: string): Promise<void>
}

export class LandingPageRepository {
  constructor(private readonly svc: ServiceAdapter) {}

  async findById(id: string): Promise<ILandingPage | null> {
    return this.svc.retrieveLandingPage(id).catch(() => null)
  }

  async findBySlug(slug: string): Promise<ILandingPage | null> {
    const results = await this.svc.listLandingPages({ slug })
    return results[0] ?? null
  }

  async findAll(filters: Record<string, unknown> = {}): Promise<ILandingPage[]> {
    return this.svc.listLandingPages(filters)
  }

  async create(data: ICreateLandingPageDTO): Promise<ILandingPage> {
    return this.svc.createLandingPages(data as unknown as Record<string, unknown>)
  }

  async update(id: string, data: IUpdateLandingPageDTO): Promise<ILandingPage> {
    return this.svc.updateLandingPages(id, data as Record<string, unknown>)
  }

  async delete(id: string): Promise<void> {
    return this.svc.deleteLandingPages(id)
  }

  async exists(id: string): Promise<boolean> {
    const result = await this.findById(id)
    return result !== null
  }
}
