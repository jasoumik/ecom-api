import type { MedusaRequest, MedusaResponse } from '@medusajs/framework'
import { COMBO_OFFER_MODULE } from '../../../../modules/combo-offer'
import type ComboOfferModuleService from '../../../../modules/combo-offer/service/combo-offer-module-service'
import { errorHandler } from '../../../../shared/errors/error-handler'

/**
 * GET /admin/combos/:id
 *
 * Get a single combo offer with its items.
 */
export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  try {
    const { id } = req.params
    const comboService = req.scope.resolve<ComboOfferModuleService>(COMBO_OFFER_MODULE)
    const combo = await comboService.getCombo(id)
    const items = await comboService.getItems(id)
    res.status(200).json({ data: { ...combo, items } })
  } catch (error) {
    errorHandler(error, req, res)
  }
}

/**
 * PATCH /admin/combos/:id
 *
 * Update a combo offer's fields.
 */
export async function PATCH(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  try {
    const { id } = req.params
    const comboService = req.scope.resolve<ComboOfferModuleService>(COMBO_OFFER_MODULE)
    const combo = await comboService.updateCombo(id, req.body as Parameters<ComboOfferModuleService['updateCombo']>[1])
    res.status(200).json({ data: combo })
  } catch (error) {
    errorHandler(error, req, res)
  }
}

/**
 * DELETE /admin/combos/:id
 *
 * Delete a combo offer and all its items.
 */
export async function DELETE(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  try {
    const { id } = req.params
    const comboService = req.scope.resolve<ComboOfferModuleService>(COMBO_OFFER_MODULE)
    await comboService.deleteCombo(id)
    res.status(200).json({ data: { id, deleted: true } })
  } catch (error) {
    errorHandler(error, req, res)
  }
}
