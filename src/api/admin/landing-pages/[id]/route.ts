import type { MedusaRequest, MedusaResponse } from '@medusajs/framework'
import { LANDING_PAGE_MODULE } from '../../../../modules/landing-page'
import type LandingPageModuleService from '../../../../modules/landing-page/service/landing-page-module-service'
import { validateBody } from '../../../../shared/validation'
import { errorHandler } from '../../../../shared/errors/error-handler'
import { UpdateLandingPageSchema } from '../../../../modules/landing-page/validation/landing-page.validation'

/**
 * GET /admin/landing-pages/:id
 *
 * Retrieve a single landing page.
 */
export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  try {
    const { id } = req.params
    const landingPageService = req.scope.resolve<LandingPageModuleService>(LANDING_PAGE_MODULE)
    const page = await landingPageService.findById(id)
    res.status(200).json({ data: page })
  } catch (error) {
    errorHandler(error, req, res)
  }
}

/**
 * PATCH /admin/landing-pages/:id
 *
 * Update a landing page's fields.
 */
export async function PATCH(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  try {
    const { id } = req.params
    const body = validateBody(UpdateLandingPageSchema, req.body)
    const landingPageService = req.scope.resolve<LandingPageModuleService>(LANDING_PAGE_MODULE)
    const page = await landingPageService.update(id, body)
    res.status(200).json({ data: page })
  } catch (error) {
    errorHandler(error, req, res)
  }
}

/**
 * DELETE /admin/landing-pages/:id
 *
 * Delete a landing page.
 */
export async function DELETE(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  try {
    const { id } = req.params
    const landingPageService = req.scope.resolve<LandingPageModuleService>(LANDING_PAGE_MODULE)
    await landingPageService.remove(id)
    res.status(200).json({ data: { id, deleted: true } })
  } catch (error) {
    errorHandler(error, req, res)
  }
}
