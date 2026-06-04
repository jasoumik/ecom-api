import type { MedusaRequest, MedusaResponse } from '@medusajs/framework'
import { LANDING_PAGE_MODULE } from '../../../../../modules/landing-page'
import type LandingPageModuleService from '../../../../../modules/landing-page/service/landing-page-module-service'
import { errorHandler } from '../../../../../shared/errors/error-handler'

/**
 * POST /admin/landing-pages/:id/publish
 *
 * Publish a landing page (sets isActive = true).
 */
export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  try {
    const { id } = req.params
    const landingPageService = req.scope.resolve<LandingPageModuleService>(LANDING_PAGE_MODULE)
    const page = await landingPageService.publish(id)
    res.status(200).json({ data: page })
  } catch (error) {
    errorHandler(error, req, res)
  }
}
