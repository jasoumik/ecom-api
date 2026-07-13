import type { MedusaRequest, MedusaResponse } from '@medusajs/framework'
import { COMBO_OFFER_MODULE } from '../../../modules/combo-offer'
import type ComboOfferModuleService from '../../../modules/combo-offer/service/combo-offer-module-service'
import { errorHandler } from '../../../shared/errors/error-handler'

export async function GET(req: MedusaRequest, res: MedusaResponse): Promise<void> {
  try {
    const comboService = req.scope.resolve<ComboOfferModuleService>(COMBO_OFFER_MODULE)
    const combos = await comboService.listCombos({ isActive: true })
    res.status(200).json({ data: combos })
  } catch (error) {
    errorHandler(error, req, res)
  }
}
