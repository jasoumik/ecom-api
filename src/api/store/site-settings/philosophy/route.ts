import { MedusaRequest, MedusaResponse } from '@medusajs/framework/http'
import { MEDIA_MODULE } from '../../../../modules/media'
import type MediaModuleService from '../../../../modules/media/service/media-module-service'
import { errorHandler } from '../../../../shared/errors/error-handler'

/**
 * GET /store/site-settings/philosophy
 *
 * Public endpoint — returns philosophy image URLs for the storefront.
 */
export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  try {
    const mediaService = req.scope.resolve<MediaModuleService>(MEDIA_MODULE)
    const data = await mediaService.getPhilosophyImages()
    res.status(200).json({ data })
  } catch (error) {
    errorHandler(error, req, res)
  }
}
