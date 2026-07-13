import { MedusaService } from '@medusajs/framework/utils'
import { ComboOffer } from '../models/combo-offer'
import { ComboItem } from '../models/combo-item'
import { NotFoundError } from '../../../shared/errors/app-error'
import { createLogger } from '../../../shared/logger'

const logger = createLogger('ComboOfferModule')

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecord = Record<string, any>

class ComboOfferModuleService extends MedusaService({ ComboOffer, ComboItem }) {
  // ── Combo Offers ────────────────────────────────────────────────────────────

  async listCombos(filters: Partial<{ isActive: boolean }> = {}): Promise<AnyRecord[]> {
    logger.info('listCombos', { filters })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const combos = await (this as any).listComboOffers(filters)
    logger.info('listCombos success', { count: combos.length })
    return combos
  }

  async getCombo(id: string): Promise<AnyRecord> {
    logger.info('getCombo', { id })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [combo] = await (this as any).listComboOffers({ id })
    if (!combo) {
      logger.error('ComboOffer not found', { id })
      throw new NotFoundError('ComboOffer', id)
    }
    logger.info('getCombo success', { id })
    return combo
  }

  async createCombo(data: AnyRecord): Promise<AnyRecord> {
    logger.info('createCombo', { name: data.name })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const combo = await (this as any).createComboOffers(data)
    logger.info('createCombo success', { id: combo.id })
    return combo
  }

  async updateCombo(id: string, data: AnyRecord): Promise<AnyRecord> {
    logger.info('updateCombo', { id })
    await this.getCombo(id)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updated = await (this as any).updateComboOffers({ id }, data)
    logger.info('updateCombo success', { id })
    return Array.isArray(updated) ? updated[0] : updated
  }

  async deleteCombo(id: string): Promise<void> {
    logger.info('deleteCombo', { id })
    await this.getCombo(id)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const items = await (this as any).listComboItems({ comboOfferId: id })
    for (const item of items) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (this as any).deleteComboItems(item.id)
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (this as any).deleteComboOffers(id)
    logger.info('deleteCombo success', { id })
  }

  // ── Combo Items ──────────────────────────────────────────────────────────────

  async addItems(
    comboOfferId: string,
    items: Array<{ productId: string; quantity?: number }>
  ): Promise<AnyRecord[]> {
    logger.info('addItems', { comboOfferId, count: items.length })
    await this.getCombo(comboOfferId)
    const created = await Promise.all(
      items.map((item) =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (this as any).createComboItems({ comboOfferId, productId: item.productId, quantity: item.quantity ?? 1 })
      )
    )
    logger.info('addItems success', { comboOfferId, count: created.length })
    return created
  }

  async getItems(comboOfferId: string): Promise<AnyRecord[]> {
    logger.info('getItems', { comboOfferId })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const items = await (this as any).listComboItems({ comboOfferId })
    logger.info('getItems success', { comboOfferId, count: items.length })
    return items
  }

  async replaceItems(
    comboOfferId: string,
    items: Array<{ productId: string; quantity?: number }>
  ): Promise<AnyRecord[]> {
    logger.info('replaceItems', { comboOfferId, count: items.length })
    await this.getCombo(comboOfferId)
    const existing = await this.getItems(comboOfferId)
    for (const item of existing) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (this as any).deleteComboItems(item.id)
    }
    const created = await this.addItems(comboOfferId, items)
    logger.info('replaceItems success', { comboOfferId, count: created.length })
    return created
  }
}

export default ComboOfferModuleService
