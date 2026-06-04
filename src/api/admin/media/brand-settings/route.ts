import { MedusaRequest, MedusaResponse } from '@medusajs/framework/http'
import { MEDIA_MODULE } from '../../../../modules/media'
import type MediaModuleService from '../../../../modules/media/service/media-module-service'
import { validateBody } from '../../../../shared/validation'
import { errorHandler } from '../../../../shared/errors/error-handler'
import { CreateBrandSettingsSchema } from '../../../../modules/media/validation/media.validation'

/**
 * GET /admin/media/brand-settings
 *
 * Returns the currently active brand settings.
 */
export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  try {
    const mediaService = req.scope.resolve<MediaModuleService>(MEDIA_MODULE)
    const settings = await mediaService.getActiveBrandSettings()

    if (!settings) {
      res.status(404).json({
        error: { code: 'NOT_FOUND', message: 'No active brand settings found.' },
      })
      return
    }

    res.status(200).json({ data: settings })
  } catch (error) {
    errorHandler(error, req, res)
  }
}

/**
 * POST /admin/media/brand-settings
 *
 * Create new brand settings.
 */
export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  try {
    const body = validateBody(CreateBrandSettingsSchema, req.body)
    const mediaService = req.scope.resolve<MediaModuleService>(MEDIA_MODULE)
    const settings = await mediaService.createBrandConfig(body)
    res.status(201).json({ data: settings })
  } catch (error) {
    errorHandler(error, req, res)
  }
}
