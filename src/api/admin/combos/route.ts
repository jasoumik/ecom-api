import type { MedusaRequest, MedusaResponse } from '@medusajs/framework'
import { COMBO_OFFER_MODULE } from '../../../modules/combo-offer'
import type ComboOfferModuleService from '../../../modules/combo-offer/service/combo-offer-module-service'
import { errorHandler } from '../../../shared/errors/error-handler'

/**
 * GET /admin/combos
 *
 * List all combo offers, optionally filtered by isActive.
 */
export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  try {
    const { isActive } = req.query as { isActive?: string }
    const comboService = req.scope.resolve<ComboOfferModuleService>(COMBO_OFFER_MODULE)

    const filters: Partial<{ isActive: boolean }> = {}
    if (isActive !== undefined) filters.isActive = isActive === 'true'

    const combos = await comboService.listCombos(filters)
    res.status(200).json({ data: combos })
  } catch (error) {
    errorHandler(error, req, res)
  }
}

/**
 * POST /admin/combos
 *
 * Create a new combo offer.
 */
export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  try {
    const comboService = req.scope.resolve<ComboOfferModuleService>(COMBO_OFFER_MODULE)
    const combo = await comboService.createCombo(req.body as Parameters<ComboOfferModuleService['createCombo']>[0])
    res.status(201).json({ data: combo })
  } catch (error) {
    errorHandler(error, req, res)
  }
}
