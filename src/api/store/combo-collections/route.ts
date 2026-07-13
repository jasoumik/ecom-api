import type { MedusaRequest, MedusaResponse } from '@medusajs/framework'
import { Modules } from '@medusajs/framework/utils'
import { errorHandler } from '../../../shared/errors/error-handler'
import { createLogger } from '../../../shared/logger'
import { buildComboFromCollection, type RawCollection } from './shared'

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

    const all: RawCollection[] = await productService.listProductCollections(
      {},
      { relations: ['products', 'products.variants'], take: 200 },
    )

    // Filter in JS — Medusa ORM does not support JSON metadata field filtering
    const collections = all.filter((c) => c.metadata?.is_combo === 'true' || c.metadata?.is_combo === true)
    const data = collections.map(buildComboFromCollection)
    logger.info('combo-collections list', { count: data.length })
    res.status(200).json({ data })
  } catch (error) {
    errorHandler(error, req, res)
  }
}
