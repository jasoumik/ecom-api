import type { MedusaRequest, MedusaResponse } from '@medusajs/framework'
import { Modules } from '@medusajs/framework/utils'
import { errorHandler } from '../../../shared/errors/error-handler'
import { createLogger } from '../../../shared/logger'
import { buildComboFromCollection, parseComboProductIds, type RawCollection } from './shared'

const logger = createLogger('store/combo-collections')

/**
 * GET /store/combo-collections
 *
 * Returns all active combo offers built from Medusa collections
 * where metadata.is_combo = "true".
 */
export async function GET(req: MedusaRequest, res: MedusaResponse): Promise<void> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const productService = req.scope.resolve(Modules.PRODUCT) as any

    const all: RawCollection[] = await productService.listProductCollections({}, { take: 200 })

    // Filter in JS — Medusa ORM does not support JSON metadata field filtering
    const collections = all.filter((c) => c.metadata?.is_combo === 'true' || c.metadata?.is_combo === true)

    // Member products are referenced by id in metadata.product_ids (not by collection_id),
    // so combo members keep their own brand collection. Resolve them in one batched fetch.
    const allIds = [...new Set(collections.flatMap((c) => parseComboProductIds(c.metadata)))]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const products: any[] = allIds.length
      ? await productService.listProducts(
          { id: allIds },
          { relations: ['variants', 'images'] },
        )
      : []
    const byId = new Map(products.map((p) => [p.id, p]))

    const data = collections.map((c) =>
      buildComboFromCollection(
        c,
        parseComboProductIds(c.metadata)
          .map((id) => byId.get(id))
          .filter(Boolean),
      ),
    )
    logger.info('combo-collections list', { count: data.length })
    res.status(200).json({ data })
  } catch (error) {
    errorHandler(error, req, res)
  }
}
