import type { MedusaRequest, MedusaResponse } from '@medusajs/framework'
import { Modules } from '@medusajs/framework/utils'
import { errorHandler } from '../../../../shared/errors/error-handler'
import { createLogger } from '../../../../shared/logger'
import { buildComboFromCollection, type RawCollection } from '../shared'

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
      { handle, metadata: { is_combo: 'true' } },
      { relations: ['products', 'products.variants'], take: 1 },
    )

    const collection = collections[0]
    if (!collection) {
      res.status(404).json({ message: 'Combo not found' })
      return
    }

    const data = buildComboFromCollection(collection)
    logger.info('combo-collections get', { handle })
    res.status(200).json({ data })
  } catch (error) {
    errorHandler(error, req, res)
  }
}
