import type { MedusaRequest, MedusaResponse } from '@medusajs/framework'
import { COMBO_OFFER_MODULE } from '../../../../../modules/combo-offer'
import type ComboOfferModuleService from '../../../../../modules/combo-offer/service/combo-offer-module-service'
import { errorHandler } from '../../../../../shared/errors/error-handler'

/**
 * POST /admin/combos/:id/items
 *
 * Replace all items on a combo offer.
 */
export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  try {
    const { id } = req.params
    const body = req.body as { items: Array<{ productId: string; quantity?: number }> }
    const comboService = req.scope.resolve<ComboOfferModuleService>(COMBO_OFFER_MODULE)
    const items = await comboService.replaceItems(id, body.items ?? [])
    res.status(200).json({ data: items })
  } catch (error) {
    errorHandler(error, req, res)
  }
}
