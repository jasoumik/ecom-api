import { MedusaRequest, MedusaResponse } from '@medusajs/framework/http'
import { MEDIA_MODULE } from '../../../../modules/media'
import type MediaModuleService from '../../../../modules/media/service/media-module-service'
import { errorHandler } from '../../../../shared/errors/error-handler'

/**
 * DELETE /admin/media/:id
 *
 * Delete a media file from R2 and the database.
 */
export async function DELETE(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  try {
    const { id } = req.params
    const mediaService = req.scope.resolve<MediaModuleService>(MEDIA_MODULE)
    await mediaService.deleteFile(id)
    res.status(200).json({ data: { id, deleted: true } })
  } catch (error) {
    errorHandler(error, req, res)
  }
}
