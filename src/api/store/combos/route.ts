import type { MedusaRequest, MedusaResponse } from '@medusajs/framework'
import { COMBO_OFFER_MODULE } from '../../../modules/combo-offer'
import type ComboOfferModuleService from '../../../modules/combo-offer/service/combo-offer-module-service'
import { errorHandler } from '../../../shared/errors/error-handler'

/**
 * GET /store/combos
 *
 * Returns all active combo offers whose date window covers the current time.
 */
export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> => {
  try {
    const comboOfferService = req.scope.resolve<ComboOfferModuleService>(COMBO_OFFER_MODULE)
    const offers = await comboOfferService.getActiveOffers()
    res.status(200).json({ data: offers, meta: { total: offers.length } })
  } catch (error) {
    errorHandler(error, req, res)
  }
}
