import { MedusaRequest, MedusaResponse } from '@medusajs/framework/http'
import { MEDIA_MODULE } from '../../../../modules/media'
import type MediaModuleService from '../../../../modules/media/service/media-module-service'
import { uploadSingle } from '../../../middlewares/upload'
import { errorHandler } from '../../../../shared/errors/error-handler'
import { ValidationError } from '../../../../shared/errors/app-error'

/**
 * GET /admin/site-settings/philosophy
 *
 * Returns the current philosophy image URLs.
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

/**
 * POST /admin/site-settings/philosophy
 *
 * Upload a philosophy image. Accepts `file` + `slot` ("1" or "2").
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
      throw new ValidationError('Philosophy image must be an image file.')
    }

    const slot = (req.body as Record<string, unknown>)?.slot
    if (slot !== '1' && slot !== '2') {
      throw new ValidationError("Provide a 'slot' field with value '1' or '2'.")
    }

    const mediaService = req.scope.resolve<MediaModuleService>(MEDIA_MODULE)

    const fileDto = {
      buffer: file.buffer,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
    }

    let imageUrl: string
    if (slot === '1') {
      imageUrl = await mediaService.uploadPhilosophyImage1(fileDto)
      res.status(201).json({ data: { slot: '1', imageUrl } })
    } else {
      imageUrl = await mediaService.uploadPhilosophyImage2(fileDto)
      res.status(201).json({ data: { slot: '2', imageUrl } })
    }
  } catch (error) {
    errorHandler(error, req, res)
  }
}
