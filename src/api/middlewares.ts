import { defineMiddlewares, MedusaNextFunction, MedusaRequest, MedusaResponse } from '@medusajs/framework/http'
import { Modules } from '@medusajs/framework/utils'
import { moveOrphanedImagesToTrash } from '../shared/r2-trash'
import { createLogger } from '../shared/logger'

const logger = createLogger('ProductImageTrashMiddleware')

async function captureProductImages(
  req: MedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction
): Promise<void> {
  const productId = req.params?.id
  if (!productId) return next()

  try {
    const productService = req.scope.resolve(Modules.PRODUCT)
    const product = await (productService as {
      retrieveProduct: (id: string, options: { relations: string[] }) => Promise<{ images?: Array<{ url: string }> }>
    }).retrieveProduct(productId, { relations: ['images'] })

    ;(req as MedusaRequest & { _prevImageUrls?: Set<string> })._prevImageUrls =
      new Set((product.images ?? []).map((img) => img.url))
  } catch {
    // product may not exist yet — ignore
  }

  const originalJson = res.json.bind(res)
  ;(res as MedusaResponse & { json: typeof res.json }).json = function (body: unknown) {
    const prevUrls = (req as MedusaRequest & { _prevImageUrls?: Set<string> })._prevImageUrls
    if (prevUrls && prevUrls.size > 0) {
      const currentImages: Array<{ url: string }> =
        (body as { product?: { images?: Array<{ url: string }> } })?.product?.images ?? []
      const currentUrls = new Set(currentImages.map((img) => img.url))
      const removed = [...prevUrls].filter((u) => !currentUrls.has(u))

      if (removed.length > 0) {
        logger.info('Moving removed product images to trash', { productId, count: removed.length })
        moveOrphanedImagesToTrash(removed).catch((err) =>
          logger.error('Failed to trash orphaned images', { error: err })
        )
      }
    }
    return originalJson(body)
  }

  next()
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')   // strip non-word chars
    .replace(/[\s_]+/g, '-')    // spaces/underscores → hyphens
    .replace(/--+/g, '-')       // collapse multiple hyphens
    .replace(/^-+|-+$/g, '')    // trim leading/trailing hyphens
}

async function autoGenerateCollectionHandle(
  req: MedusaRequest,
  _res: MedusaResponse,
  next: MedusaNextFunction
): Promise<void> {
  const body = req.body as Record<string, unknown> | undefined
  if (body && body.title && !body.handle) {
    body.handle = slugify(body.title as string)
  }
  next()
}

export default defineMiddlewares({
  routes: [
    {
      matcher: '/admin/products/:id',
      method: ['POST'],
      middlewares: [captureProductImages],
    },
    {
      matcher: '/admin/collections',
      method: ['POST'],
      middlewares: [autoGenerateCollectionHandle],
    },
  ],
})
