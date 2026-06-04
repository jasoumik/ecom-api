import { MedusaService } from '@medusajs/framework/utils'
import { ComboOffer } from '../models/combo-offer'
import { ComboItem } from '../models/combo-item'
import { ComboOfferRepository } from '../repository/combo-offer.repository'
import { NotFoundError, ConflictError } from '../../../shared/errors/app-error'
import { createLogger } from '../../../shared/logger'
import type {
  IComboOffer,
  IComboItem,
  ICreateComboOfferDTO,
  IUpdateComboOfferDTO,
  IAddComboItemDTO,
  IComboOfferService,
} from '../interfaces/combo-offer.interface'

const logger = createLogger('ComboOfferModule')

class ComboOfferModuleService
  extends MedusaService({ ComboOffer, ComboItem })
  implements IComboOfferService
{
  private readonly repo: ComboOfferRepository

  constructor(container: Record<string, unknown>) {
    super(container)
    this.repo = new ComboOfferRepository(this as unknown as ConstructorParameters<typeof ComboOfferRepository>[0])
  }

  // ── findById ────────────────────────────────────────────────────────────────

  async findById(id: string): Promise<IComboOffer> {
    logger.info('findById', { id })
    const offer = await this.repo.findById(id)
    if (!offer) {
      logger.error('ComboOffer not found', { id })
      throw new NotFoundError('ComboOffer', id)
    }
    logger.info('findById success', { id })
    return offer
  }

  // ── findBySlug ──────────────────────────────────────────────────────────────

  async findBySlug(slug: string): Promise<IComboOffer | null> {
    logger.info('findBySlug', { slug })
    const offer = await this.repo.findBySlug(slug)
    logger.info('findBySlug result', { slug, found: offer !== null })
    return offer
  }

  // ── findAll ─────────────────────────────────────────────────────────────────

  async findAll(filters: Record<string, unknown> = {}): Promise<IComboOffer[]> {
    logger.info('findAll', { filters })
    const results = await this.repo.findAll(filters)
    logger.info('findAll success', { count: results.length })
    return results
  }

  // ── getActiveOffers ─────────────────────────────────────────────────────────

  async getActiveOffers(): Promise<IComboOffer[]> {
    logger.info('getActiveOffers')
    const now = new Date()
    const all = await this.repo.findAll({ isActive: true })

    const active = all.filter((offer) => {
      const afterStart = !offer.startsAt || offer.startsAt <= now
      const beforeEnd = !offer.endsAt || offer.endsAt >= now
      return afterStart && beforeEnd
    })

    logger.info('getActiveOffers success', { count: active.length })
    return active
  }

  // ── create ──────────────────────────────────────────────────────────────────

  async create(data: ICreateComboOfferDTO): Promise<IComboOffer> {
    logger.info('create', { slug: data.slug })

    const existing = await this.repo.findBySlug(data.slug)
    if (existing) {
      logger.error('Slug conflict on create', { slug: data.slug })
      throw new ConflictError(`ComboOffer with slug '${data.slug}' already exists`)
    }

    const discountValue =
      data.discountValue !== undefined
        ? data.discountValue
        : data.originalPrice > 0
        ? Math.round(((data.originalPrice - data.comboPrice) / data.originalPrice) * 100)
        : 0

    const created = await this.repo.create({ ...data, discountValue })
    logger.info('create success', { id: created.id, slug: created.slug, discountValue })
    return created
  }

  // ── update ──────────────────────────────────────────────────────────────────

  async update(id: string, data: IUpdateComboOfferDTO): Promise<IComboOffer> {
    logger.info('update', { id })

    const existing = await this.repo.findById(id)
    if (!existing) {
      logger.error('ComboOffer not found on update', { id })
      throw new NotFoundError('ComboOffer', id)
    }

    if (data.slug && data.slug !== existing.slug) {
      const slugConflict = await this.repo.findBySlug(data.slug)
      if (slugConflict && slugConflict.id !== id) {
        logger.error('Slug conflict on update', { slug: data.slug })
        throw new ConflictError(`ComboOffer with slug '${data.slug}' already exists`)
      }
    }

    const originalPrice = data.originalPrice ?? existing.originalPrice
    const comboPrice = data.comboPrice ?? existing.comboPrice

    const discountValue =
      data.discountValue !== undefined
        ? data.discountValue
        : originalPrice > 0
        ? Math.round(((originalPrice - comboPrice) / originalPrice) * 100)
        : 0

    const updated = await this.repo.update(id, { ...data, discountValue })
    logger.info('update success', { id, discountValue })
    return updated
  }

  // ── addItems ────────────────────────────────────────────────────────────────

  async addItems(comboOfferId: string, items: IAddComboItemDTO[]): Promise<IComboItem[]> {
    logger.info('addItems', { comboOfferId, count: items.length })

    const offer = await this.repo.findById(comboOfferId)
    if (!offer) {
      logger.error('ComboOffer not found on addItems', { comboOfferId })
      throw new NotFoundError('ComboOffer', comboOfferId)
    }

    const created: IComboItem[] = []
    for (const item of items) {
      const comboItem = await this.repo.addItem(comboOfferId, item)
      created.push(comboItem)
    }

    logger.info('addItems success', { comboOfferId, added: created.length })
    return created
  }

  // ── getItems ────────────────────────────────────────────────────────────────

  async getItems(comboOfferId: string): Promise<IComboItem[]> {
    logger.info('getItems', { comboOfferId })
    const items = await this.repo.findItems(comboOfferId)
    logger.info('getItems success', { comboOfferId, count: items.length })
    return items
  }

  // ── remove ──────────────────────────────────────────────────────────────────

  async remove(id: string): Promise<void> {
    logger.info('remove', { id })

    const existing = await this.repo.findById(id)
    if (!existing) {
      logger.error('ComboOffer not found on remove', { id })
      throw new NotFoundError('ComboOffer', id)
    }

    const items = await this.repo.findItems(id)
    for (const item of items) {
      await this.repo.deleteItem(item.id)
    }

    await this.repo.delete(id)
    logger.info('remove success', { id })
  }

  // ── Legacy aliases ───────────────────────────────────────────────────────────

  /** @deprecated Use findBySlug() */
  async getBySlug(slug: string): Promise<IComboOffer | null> {
    return this.repo.findBySlug(slug)
  }
}

export default ComboOfferModuleService
