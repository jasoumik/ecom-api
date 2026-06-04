import { MedusaRequest, MedusaResponse } from '@medusajs/framework/http'
import { MEDIA_MODULE } from '../../../modules/media'
import type MediaModuleService from '../../../modules/media/service/media-module-service'
import { uploadSingle } from '../../middlewares/upload'
import { errorHandler } from '../../../shared/errors/error-handler'
import { validateBody } from '../../../shared/validation'
import { PaginationSchema } from '../../../shared/dto/pagination.dto'

/**
 * POST /admin/media
 *
 * Upload a file. Converts images to WebP, optionally applies watermark.
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
      res.status(400).json({
        error: { code: 'VALIDATION_ERROR', message: "No file uploaded. Provide a 'file' field." },
      })
      return
    }

    const body = req.body as {
      entityType?: string
      entityId?: string
      applyWatermark?: string
      uploadedBy?: string
    }

    const applyWatermark = body.applyWatermark !== 'false'

    const mediaService = req.scope.resolve<MediaModuleService>(MEDIA_MODULE)

    const mediaFile = await mediaService.uploadFile(
      {
        buffer: file.buffer,
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
      },
      {
        entityType: body.entityType,
        entityId: body.entityId,
        uploadedBy: body.uploadedBy,
        applyWatermark,
      }
    )

    res.status(201).json({ data: mediaFile })
  } catch (error) {
    errorHandler(error, req, res)
  }
}

/**
 * GET /admin/media
 *
 * List media files with optional entity filters and pagination.
 */
export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  try {
    const query = req.query as {
      entityType?: string
      entityId?: string
      page?: string
      limit?: string
    }

    const pagination = validateBody(PaginationSchema, {
      page: query.page,
      limit: query.limit,
    })

    const mediaService = req.scope.resolve<MediaModuleService>(MEDIA_MODULE)

    const filters: Record<string, unknown> = {}
    if (query.entityType) filters.entityType = query.entityType
    if (query.entityId) filters.entityId = query.entityId

    const page = pagination.page ?? 1
    const limit = pagination.limit ?? 20
    const offset = (page - 1) * limit

    const [mediaFiles, count] = await mediaService.listAndCountMediaFiles(filters, {
      take: limit,
      skip: offset,
      order: { created_at: 'DESC' },
    })

    res.status(200).json({
      data: mediaFiles,
      meta: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    })
  } catch (error) {
    errorHandler(error, req, res)
  }
}
