import type { MedusaRequest, MedusaResponse } from '@medusajs/framework'
import { COMBO_OFFER_MODULE } from '../../../../../modules/combo-offer'
import type ComboOfferModuleService from '../../../../../modules/combo-offer/service/combo-offer-module-service'
import { validateBody } from '../../../../../shared/validation'
import { errorHandler } from '../../../../../shared/errors/error-handler'
import { AddComboItemsSchema } from '../../../../../modules/combo-offer/validation/combo-offer.validation'

/**
 * GET /admin/combos/:id/items
 *
 * List all items in a combo offer.
 */
export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  try {
    const { id } = req.params
    const comboService = req.scope.resolve<ComboOfferModuleService>(COMBO_OFFER_MODULE)
    const items = await comboService.getItems(id)
    res.status(200).json({ data: items })
  } catch (error) {
    errorHandler(error, req, res)
  }
}

/**
 * POST /admin/combos/:id/items
 *
 * Add products to a combo offer.
 * Body: { items: [{ productId, quantity }] }
 */
export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  try {
    const { id } = req.params
    const body = validateBody(AddComboItemsSchema, req.body)
    const comboService = req.scope.resolve<ComboOfferModuleService>(COMBO_OFFER_MODULE)
    const items = await comboService.addItems(id, body.items)
    res.status(201).json({ data: items })
  } catch (error) {
    errorHandler(error, req, res)
  }
}
