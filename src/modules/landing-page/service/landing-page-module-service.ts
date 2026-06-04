import { MedusaService } from '@medusajs/framework/utils'
import { LandingPage } from '../models/landing-page'
import { LandingPageRepository } from '../repository/landing-page.repository'
import { NotFoundError, ConflictError } from '../../../shared/errors/app-error'
import { createLogger } from '../../../shared/logger'
import type {
  ILandingPage,
  ICreateLandingPageDTO,
  IUpdateLandingPageDTO,
  ILandingPageService,
} from '../interfaces/landing-page.interface'

const logger = createLogger('LandingPageModule')

class LandingPageModuleService
  extends MedusaService({ LandingPage })
  implements ILandingPageService
{
  private readonly repo: LandingPageRepository

  constructor(container: Record<string, unknown>) {
    super(container)
    this.repo = new LandingPageRepository(this as unknown as ConstructorParameters<typeof LandingPageRepository>[0])
  }

  // ── findById ────────────────────────────────────────────────────────────────

  async findById(id: string): Promise<ILandingPage> {
    logger.info('findById', { id })
    const page = await this.repo.findById(id)
    if (!page) {
      logger.error('LandingPage not found', { id })
      throw new NotFoundError('LandingPage', id)
    }
    logger.info('findById success', { id })
    return page
  }

  // ── findBySlug ──────────────────────────────────────────────────────────────

  async findBySlug(slug: string): Promise<ILandingPage> {
    logger.info('findBySlug', { slug })
    const page = await this.repo.findBySlug(slug)
    if (!page) {
      logger.error('LandingPage not found by slug', { slug })
      throw new NotFoundError('LandingPage', slug)
    }
    logger.info('findBySlug success', { slug })
    return page
  }

  // ── findAll ─────────────────────────────────────────────────────────────────

  async findAll(filters: { isActive?: boolean } = {}): Promise<ILandingPage[]> {
    logger.info('findAll', { filters })
    const results = await this.repo.findAll(filters as Record<string, unknown>)
    logger.info('findAll success', { count: results.length })
    return results
  }

  // ── create ──────────────────────────────────────────────────────────────────

  async create(data: ICreateLandingPageDTO): Promise<ILandingPage> {
    logger.info('create', { slug: data.slug })

    const existing = await this.repo.findBySlug(data.slug)
    if (existing) {
      logger.error('Slug conflict on create', { slug: data.slug })
      throw new ConflictError(`LandingPage with slug '${data.slug}' already exists`)
    }

    const created = await this.repo.create(data)
    logger.info('create success', { id: created.id, slug: created.slug })
    return created
  }

  // ── update ──────────────────────────────────────────────────────────────────

  async update(id: string, data: IUpdateLandingPageDTO): Promise<ILandingPage> {
    logger.info('update', { id })

    const existing = await this.repo.findById(id)
    if (!existing) {
      logger.error('LandingPage not found on update', { id })
      throw new NotFoundError('LandingPage', id)
    }

    if (data.slug && data.slug !== existing.slug) {
      const slugConflict = await this.repo.findBySlug(data.slug)
      if (slugConflict && slugConflict.id !== id) {
        logger.error('Slug conflict on update', { slug: data.slug })
        throw new ConflictError(`LandingPage with slug '${data.slug}' already exists`)
      }
    }

    const updated = await this.repo.update(id, data)
    logger.info('update success', { id })
    return updated
  }

  // ── publish / unpublish ─────────────────────────────────────────────────────

  async publish(id: string): Promise<ILandingPage> {
    logger.info('publish', { id })
    const result = await this.update(id, { isActive: true })
    logger.info('publish success', { id })
    return result
  }

  async unpublish(id: string): Promise<ILandingPage> {
    logger.info('unpublish', { id })
    const result = await this.update(id, { isActive: false })
    logger.info('unpublish success', { id })
    return result
  }

  // ── remove ──────────────────────────────────────────────────────────────────

  async remove(id: string): Promise<void> {
    logger.info('remove', { id })

    const existing = await this.repo.findById(id)
    if (!existing) {
      logger.error('LandingPage not found on remove', { id })
      throw new NotFoundError('LandingPage', id)
    }

    await this.repo.delete(id)
    logger.info('remove success', { id })
  }

  // ── Legacy alias ─────────────────────────────────────────────────────────────

  /** @deprecated Use findBySlug() */
  async getBySlug(slug: string): Promise<ILandingPage | null> {
    return this.repo.findBySlug(slug)
  }

  /** @deprecated Use findAll() */
  async list(filters: { isActive?: boolean } = {}): Promise<ILandingPage[]> {
    return this.findAll(filters)
  }
}

export default LandingPageModuleService
