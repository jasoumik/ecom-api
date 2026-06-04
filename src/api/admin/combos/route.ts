import type { MedusaRequest, MedusaResponse } from '@medusajs/framework'
import { COMBO_OFFER_MODULE } from '../../../modules/combo-offer'
import type ComboOfferModuleService from '../../../modules/combo-offer/service/combo-offer-module-service'
import { validateBody } from '../../../shared/validation'
import { errorHandler } from '../../../shared/errors/error-handler'
import { CreateComboOfferSchema } from '../../../modules/combo-offer/validation/combo-offer.validation'

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

    const filters: Record<string, unknown> = {}
    if (isActive !== undefined) filters.isActive = isActive === 'true'

    const offers = await comboService.findAll(filters)

    res.status(200).json({ data: offers })
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
    const body = validateBody(CreateComboOfferSchema, req.body)
    const comboService = req.scope.resolve<ComboOfferModuleService>(COMBO_OFFER_MODULE)
    const offer = await comboService.create(body)
    res.status(201).json({ data: offer })
  } catch (error) {
    errorHandler(error, req, res)
  }
}
