import { MedusaRequest, MedusaResponse } from '@medusajs/framework/http'
import { errorHandler } from '../../../../shared/errors/error-handler'
import { listTrash, permanentlyDelete, restoreFromTrash } from '../../../../shared/r2-trash'

/**
 * GET /admin/media/trash
 * List all files in the trash folder
 */
export async function GET(req: MedusaRequest, res: MedusaResponse): Promise<void> {
  try {
    const items = await listTrash()
    res.status(200).json({ data: items, count: items.length })
  } catch (error) {
    errorHandler(error, req, res)
  }
}

/**
 * DELETE /admin/media/trash
 * Permanently delete one or all trash items
 * Body: { key?: string } — omit key to empty entire trash
 */
export async function DELETE(req: MedusaRequest, res: MedusaResponse): Promise<void> {
  try {
    const { key } = req.body as { key?: string }

    if (key) {
      await permanentlyDelete(key)
      res.status(200).json({ message: 'File permanently deleted from R2' })
    } else {
      const items = await listTrash()
      await Promise.all(items.map((i) => permanentlyDelete(i.key)))
      res.status(200).json({ message: `${items.length} file(s) permanently deleted from R2` })
    }
  } catch (error) {
    errorHandler(error, req, res)
  }
}

/**
 * POST /admin/media/trash/restore
 * Restore a file from trash back to its original location
 * Body: { key: string }
 */
export async function POST(req: MedusaRequest, res: MedusaResponse): Promise<void> {
  try {
    const { key } = req.body as { key: string }
    if (!key) {
      res.status(400).json({ error: { message: 'key is required' } })
      return
    }
    const url = await restoreFromTrash(key)
    res.status(200).json({ data: { url } })
  } catch (error) {
    errorHandler(error, req, res)
  }
}
