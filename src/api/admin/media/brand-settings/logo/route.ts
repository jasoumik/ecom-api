import { MedusaRequest, MedusaResponse } from '@medusajs/framework/http'
import { MEDIA_MODULE } from '../../../../../modules/media'
import type MediaModuleService from '../../../../../modules/media/service/media-module-service'
import { uploadSingle } from '../../../../middlewares/upload'
import { errorHandler } from '../../../../../shared/errors/error-handler'
import { ValidationError } from '../../../../../shared/errors/app-error'

/**
 * POST /admin/media/brand-settings/logo
 *
 * Upload a watermark/logo image. Converts to WebP; no watermark applied.
 * Automatically saves the resulting URL to the active brand settings record.
 */
export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  try {
    await new Promise<void>((resolve, reject) => {
      uploadSingle(req as never, res as never, (err?: unknown) => {
        if (err) reject(err)
        else resolve()
      })
    })

    const file = (req as never as { file?: Express.Multer.File }).file

    if (!file) {
      throw new ValidationError("No file uploaded. Provide a 'file' field.")
    }

    if (!file.mimetype.startsWith('image/')) {
      throw new ValidationError('Brand logo must be an image file.')
    }

    const mediaService = req.scope.resolve<MediaModuleService>(MEDIA_MODULE)

    const r2Url = await mediaService.uploadBrandLogo({
      buffer: file.buffer,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
    })

    // Auto-save logoUrl to the active brand settings record
    const activeSettings = await mediaService.getActiveBrandSettings()
    if (activeSettings) {
      await mediaService.updateBrandConfig(activeSettings.id, { logoUrl: r2Url })
    }

    res.status(201).json({ data: { logo_url: r2Url } })
  } catch (error) {
    errorHandler(error, req, res)
  }
}
