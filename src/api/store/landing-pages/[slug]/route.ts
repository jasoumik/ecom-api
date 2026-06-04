import type { MedusaRequest, MedusaResponse } from '@medusajs/framework'
import { LANDING_PAGE_MODULE } from '../../../../modules/landing-page'
import type LandingPageModuleService from '../../../../modules/landing-page/service/landing-page-module-service'
import { errorHandler } from '../../../../shared/errors/error-handler'

/**
 * GET /store/landing-pages/:slug
 *
 * Returns an active landing page by its slug.
 */
export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> => {
  try {
    const { slug } = req.params as { slug: string }
    const landingPageService = req.scope.resolve<LandingPageModuleService>(LANDING_PAGE_MODULE)
    const page = await landingPageService.findBySlug(slug)
    res.status(200).json({ data: page })
  } catch (error) {
    errorHandler(error, req, res)
  }
}
