import type { MedusaRequest, MedusaResponse } from '@medusajs/framework'
import { Modules } from '@medusajs/framework/utils'
import { errorHandler } from '../../../../shared/errors/error-handler'
import { createLogger } from '../../../../shared/logger'
import { buildComboFromCollection, parseComboProductIds, type RawCollection } from '../shared'

const logger = createLogger('store/combo-collections/[handle]')

/**
 * GET /store/combo-collections/:handle
 *
 * Returns a single combo offer by collection handle.
 */
export async function GET(req: MedusaRequest, res: MedusaResponse): Promise<void> {
  try {
    const { handle } = req.params
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const productService = req.scope.resolve(Modules.PRODUCT) as any

    const collections: RawCollection[] = await productService.listProductCollections(
      { handle },
      { take: 1 },
    )

    // Verify it's marked as a combo — guards against regular collections being accessed
    const collection = collections[0]
    if (!collection || (collection.metadata?.is_combo !== 'true' && collection.metadata?.is_combo !== true)) {
      res.status(404).json({ message: 'Combo not found' })
      return
    }

    // Member products are referenced by id in metadata.product_ids (not by collection_id),
    // so combo members keep their own brand collection.
    const ids = parseComboProductIds(collection.metadata)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const products: any[] = ids.length
      ? await productService.listProducts(
          { id: ids },
          { relations: ['variants', 'images'] },
        )
      : []
    const byId = new Map(products.map((p) => [p.id, p]))

    const data = buildComboFromCollection(
      collection,
      ids.map((id) => byId.get(id)).filter(Boolean),
    )
    logger.info('combo-collections get', { handle })
    res.status(200).json({ data })
  } catch (error) {
    errorHandler(error, req, res)
  }
}
