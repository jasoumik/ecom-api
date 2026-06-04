import { MedusaRequest, MedusaResponse } from '@medusajs/framework/http'
import { MEDIA_MODULE } from '../../../../../modules/media'
import type MediaModuleService from '../../../../../modules/media/service/media-module-service'
import { validateBody } from '../../../../../shared/validation'
import { errorHandler } from '../../../../../shared/errors/error-handler'
import { UpdateBrandSettingsSchema } from '../../../../../modules/media/validation/media.validation'

/**
 * PUT /admin/media/brand-settings/:id
 *
 * Update brand settings by ID.
 */
export async function PUT(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  try {
    const { id } = req.params
    const body = validateBody(UpdateBrandSettingsSchema, req.body)
    const mediaService = req.scope.resolve<MediaModuleService>(MEDIA_MODULE)
    const settings = await mediaService.updateBrandConfig(id, body)
    res.status(200).json({ data: settings })
  } catch (error) {
    errorHandler(error, req, res)
  }
}
