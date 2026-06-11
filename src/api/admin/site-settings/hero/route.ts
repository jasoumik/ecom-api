import { MedusaRequest, MedusaResponse } from '@medusajs/framework/http'
import { MEDIA_MODULE } from '../../../../modules/media'
import type MediaModuleService from '../../../../modules/media/service/media-module-service'
import { uploadSingle } from '../../../middlewares/upload'
import { errorHandler } from '../../../../shared/errors/error-handler'
import { ValidationError } from '../../../../shared/errors/app-error'

/**
 * GET /admin/site-settings/hero
 *
 * Returns the current hero image URL.
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

/**
 * POST /admin/site-settings/hero
 *
 * Upload a new hero image. Converts to WebP and stores the URL.
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
      throw new ValidationError('Hero image must be an image file.')
    }

    const mediaService = req.scope.resolve<MediaModuleService>(MEDIA_MODULE)

    const heroImageUrl = await mediaService.uploadHeroImage({
      buffer: file.buffer,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
    })

    res.status(201).json({ data: { heroImageUrl } })
  } catch (error) {
    errorHandler(error, req, res)
  }
}
