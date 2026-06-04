import type { MedusaRequest, MedusaResponse } from '@medusajs/framework'
import { LANDING_PAGE_MODULE } from '../../../modules/landing-page'
import type LandingPageModuleService from '../../../modules/landing-page/service/landing-page-module-service'
import type { ICreateLandingPageDTO } from '../../../modules/landing-page/interfaces/landing-page.interface'
import { validateBody } from '../../../shared/validation'
import { errorHandler } from '../../../shared/errors/error-handler'
import { CreateLandingPageSchema } from '../../../modules/landing-page/validation/landing-page.validation'

/**
 * GET /admin/landing-pages
 *
 * List all landing pages, optionally filtered by isActive.
 */
export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  try {
    const { isActive } = req.query as { isActive?: string }

    const landingPageService = req.scope.resolve<LandingPageModuleService>(LANDING_PAGE_MODULE)

    const filters: Record<string, unknown> = {}
    if (isActive !== undefined) filters.isActive = isActive === 'true'

    const pages = await landingPageService.findAll(filters)

    res.status(200).json({ data: pages })
  } catch (error) {
    errorHandler(error, req, res)
  }
}

/**
 * POST /admin/landing-pages
 *
 * Create a new landing page.
 */
export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  try {
    const body = validateBody(CreateLandingPageSchema, req.body)
    const landingPageService = req.scope.resolve<LandingPageModuleService>(LANDING_PAGE_MODULE)
    const page = await landingPageService.create(body as ICreateLandingPageDTO)
    res.status(201).json({ data: page })
  } catch (error) {
    errorHandler(error, req, res)
  }
}
