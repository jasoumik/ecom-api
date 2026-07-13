import type { MedusaRequest, MedusaResponse } from '@medusajs/framework'
import { COMBO_OFFER_MODULE } from '../../../../modules/combo-offer'
import type ComboOfferModuleService from '../../../../modules/combo-offer/service/combo-offer-module-service'
import { errorHandler } from '../../../../shared/errors/error-handler'

export async function GET(req: MedusaRequest, res: MedusaResponse): Promise<void> {
  try {
    const { slug } = req.params
    const comboService = req.scope.resolve<ComboOfferModuleService>(COMBO_OFFER_MODULE)
    const combos = await comboService.listCombos({ isActive: true })
    const combo = combos.find((c: Record<string, unknown>) => c.slug === slug)
    if (!combo) {
      res.status(404).json({ message: 'Combo not found' })
      return
    }
    const items = await comboService.getItems(combo.id as string)
    res.status(200).json({ data: { ...combo, items } })
  } catch (error) {
    errorHandler(error, req, res)
  }
}
