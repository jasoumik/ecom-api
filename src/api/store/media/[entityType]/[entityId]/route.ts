import { MedusaRequest, MedusaResponse } from '@medusajs/framework/http'
import { MEDIA_MODULE } from '../../../../../modules/media'
import type MediaModuleService from '../../../../../modules/media/service/media-module-service'
import { errorHandler } from '../../../../../shared/errors/error-handler'

/**
 * GET /store/media/:entityType/:entityId
 *
 * Returns all media files associated with a given entity.
 */
export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  try {
    const { entityType, entityId } = req.params
    const mediaService = req.scope.resolve<MediaModuleService>(MEDIA_MODULE)
    const mediaFiles = await mediaService.getEntityMedia(entityType, entityId)
    res.status(200).json({ data: mediaFiles })
  } catch (error) {
    errorHandler(error, req, res)
  }
}
