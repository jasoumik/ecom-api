import type { MedusaRequest, MedusaResponse } from '@medusajs/framework'
import { COMBO_OFFER_MODULE } from '../../../../modules/combo-offer'
import type ComboOfferModuleService from '../../../../modules/combo-offer/service/combo-offer-module-service'
import { errorHandler } from '../../../../shared/errors/error-handler'

/**
 * GET /store/combos/:slug
 *
 * Returns a single combo offer by slug, with its items.
 */
export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> => {
  try {
    const { slug } = req.params as { slug: string }
    const comboOfferService = req.scope.resolve<ComboOfferModuleService>(COMBO_OFFER_MODULE)
    const offer = await comboOfferService.findBySlug(slug)
    if (!offer) {
      res.status(404).json({ message: `ComboOffer with slug '${slug}' not found` })
      return
    }
    const items = await comboOfferService.getItems(offer.id)
    res.status(200).json({ data: { ...offer, items } })
  } catch (error) {
    errorHandler(error, req, res)
  }
}
