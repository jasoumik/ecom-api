import type {
  IComboOffer,
  IComboItem,
  ICreateComboOfferDTO,
  IUpdateComboOfferDTO,
  IAddComboItemDTO,
} from '../interfaces/combo-offer.interface'

type ServiceAdapter = {
  listComboOffers(filters?: Record<string, unknown>): Promise<IComboOffer[]>
  retrieveComboOffer(id: string): Promise<IComboOffer>
  createComboOffers(data: Record<string, unknown>): Promise<IComboOffer>
  updateComboOffers(id: string, data: Record<string, unknown>): Promise<IComboOffer>
  deleteComboOffers(id: string): Promise<void>

  listComboItems(filters?: Record<string, unknown>): Promise<IComboItem[]>
  createComboItems(data: Record<string, unknown>): Promise<IComboItem>
  deleteComboItems(id: string): Promise<void>
}

export class ComboOfferRepository {
  constructor(private readonly svc: ServiceAdapter) {}

  // ── Combo Offers ─────────────────────────────────────────────────────────────

  async findById(id: string): Promise<IComboOffer | null> {
    return this.svc.retrieveComboOffer(id).catch(() => null)
  }

  async findBySlug(slug: string): Promise<IComboOffer | null> {
    const results = await this.svc.listComboOffers({ slug })
    return results[0] ?? null
  }

  async findAll(filters: Record<string, unknown> = {}): Promise<IComboOffer[]> {
    return this.svc.listComboOffers(filters)
  }

  async create(data: ICreateComboOfferDTO & { discountValue: number }): Promise<IComboOffer> {
    return this.svc.createComboOffers(data as unknown as Record<string, unknown>)
  }

  async update(id: string, data: Partial<IUpdateComboOfferDTO & { discountValue: number }>): Promise<IComboOffer> {
    return this.svc.updateComboOffers(id, data as Record<string, unknown>)
  }

  async delete(id: string): Promise<void> {
    return this.svc.deleteComboOffers(id)
  }

  async exists(id: string): Promise<boolean> {
    const result = await this.findById(id)
    return result !== null
  }

  // ── Combo Items ──────────────────────────────────────────────────────────────

  async findItems(comboOfferId: string): Promise<IComboItem[]> {
    return this.svc.listComboItems({ comboOfferId })
  }

  async addItem(comboOfferId: string, item: IAddComboItemDTO): Promise<IComboItem> {
    return this.svc.createComboItems({
      comboOfferId,
      productId: item.productId,
      quantity: item.quantity,
    })
  }

  async deleteItem(id: string): Promise<void> {
    return this.svc.deleteComboItems(id)
  }
}
