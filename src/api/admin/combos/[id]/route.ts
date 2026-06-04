import type { MedusaRequest, MedusaResponse } from '@medusajs/framework'
import { COMBO_OFFER_MODULE } from '../../../../modules/combo-offer'
import type ComboOfferModuleService from '../../../../modules/combo-offer/service/combo-offer-module-service'
import { validateBody } from '../../../../shared/validation'
import { errorHandler } from '../../../../shared/errors/error-handler'
import { UpdateComboOfferSchema } from '../../../../modules/combo-offer/validation/combo-offer.validation'

/**
 * GET /admin/combos/:id
 *
 * Retrieve a single combo offer with its items.
 */
export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  try {
    const { id } = req.params
    const comboService = req.scope.resolve<ComboOfferModuleService>(COMBO_OFFER_MODULE)
    const offer = await comboService.findById(id)
    const items = await comboService.getItems(id)
    res.status(200).json({ data: { ...offer, items } })
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
    const body = validateBody(UpdateComboOfferSchema, req.body)
    const comboService = req.scope.resolve<ComboOfferModuleService>(COMBO_OFFER_MODULE)
    const offer = await comboService.update(id, body)
    res.status(200).json({ data: offer })
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
    await comboService.remove(id)
    res.status(200).json({ data: { id, deleted: true } })
  } catch (error) {
    errorHandler(error, req, res)
  }
}
