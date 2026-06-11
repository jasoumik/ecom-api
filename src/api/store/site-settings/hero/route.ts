import { MedusaRequest, MedusaResponse } from '@medusajs/framework/http'
import { MEDIA_MODULE } from '../../../../modules/media'
import type MediaModuleService from '../../../../modules/media/service/media-module-service'
import { errorHandler } from '../../../../shared/errors/error-handler'

/**
 * GET /store/site-settings/hero
 *
 * Public endpoint — returns the current hero image URL for the storefront.
 */
export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  try {
    const mediaService = req.scope.resolve<MediaModuleService>(MEDIA_MODULE)
    const heroImageUrl = await mediaService.getHeroImageUrl()
    res.status(200).json({ data: { heroImageUrl } })
  } catch (error) {
    errorHandler(error, req, res)
  }
}
