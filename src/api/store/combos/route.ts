import type { MedusaRequest, MedusaResponse } from '@medusajs/framework'
import { COMBO_OFFER_MODULE } from '../../../modules/combo-offer'
import type ComboOfferModuleService from '../../../modules/combo-offer/service/combo-offer-module-service'
import { errorHandler } from '../../../shared/errors/error-handler'

export async function GET(req: MedusaRequest, res: MedusaResponse): Promise<void> {
  try {
    const comboService = req.scope.resolve<ComboOfferModuleService>(COMBO_OFFER_MODULE)
    const combos = await comboService.listCombos({ isActive: true })
    const withItems = await Promise.all(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      combos.map(async (combo: any) => ({
        ...combo,
        items: await comboService.getItems(combo.id),
      }))
    )
    res.status(200).json({ data: withItems })
  } catch (error) {
    errorHandler(error, req, res)
  }
}
