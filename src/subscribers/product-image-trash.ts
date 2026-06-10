import type { SubscriberArgs, SubscriberConfig } from '@medusajs/framework'
import { Modules } from '@medusajs/framework/utils'
import { MEDIA_MODULE } from '../modules/media'
import type MediaModuleService from '../modules/media/service/media-module-service'
import { createLogger } from '../shared/logger'

const logger = createLogger('ProductImageTrash')

export default async function productImageTrashSubscriber({
  event,
  container,
}: SubscriberArgs<{ id: string }>): Promise<void> {
  const productId = event.data.id

  try {
    const productService = container.resolve(Modules.PRODUCT)
    const mediaService = container.resolve<MediaModuleService>(MEDIA_MODULE)

    // Get current product images
    const product = await (productService as {
      retrieveProduct: (id: string, options: { relations: string[] }) => Promise<{ images?: Array<{ url: string }> }>
    }).retrieveProduct(productId, { relations: ['images'] })

    const currentUrls = new Set((product.images ?? []).map((img) => img.url))

    // Get all media files we track for this product
    const [trackedFiles] = await mediaService.listAndCountMediaFiles(
      { entityType: 'product', entityId: productId },
      { take: 500 }
    )

    // Find files no longer in the product's image list
    const orphaned = trackedFiles.filter((f) => !currentUrls.has(f.r2Url))

    if (orphaned.length === 0) return

    logger.info('Moving orphaned product images to trash', { productId, count: orphaned.length })

    await Promise.all(orphaned.map((f) => mediaService.deleteFile(f.id)))
  } catch (err) {
    logger.error('productImageTrashSubscriber error', { productId, error: err })
  }
}

export const config: SubscriberConfig = {
  event: ['product.updated'],
}
