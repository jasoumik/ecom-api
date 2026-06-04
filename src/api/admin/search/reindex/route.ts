import { Modules } from '@medusajs/framework/utils'
import type { MedusaRequest, MedusaResponse } from '@medusajs/framework'
import { SEARCH_MODULE } from '../../../../modules/search'
import type SearchModuleService from '../../../../modules/search/service/search-module-service'
import { mapProductToSearchable } from '../../../../modules/search/subscribers/product-indexer'
import { errorHandler } from '../../../../shared/errors/error-handler'
import { createLogger } from '../../../../shared/logger'

const logger = createLogger('ReindexRoute')

/**
 * POST /admin/search/reindex
 *
 * Triggers a full reindex of all products into MeiliSearch.
 * Fetches all products from Medusa and re-populates the index.
 */
export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse,
): Promise<void> => {
  try {
    const searchService = req.scope.resolve<SearchModuleService>(SEARCH_MODULE)
    const productService = req.scope.resolve(Modules.PRODUCT)

    logger.info('Admin triggered full reindex')

    // Clear the index
    await searchService.reindexAll()

    // Fetch all products with required relations
    type ProductListResult = {
      products: Parameters<typeof mapProductToSearchable>[0][]
      count: number
    }

    const { products } = await (productService as unknown as {
      listProducts: (
        filters: Record<string, unknown>,
        options: { relations: string[]; take: number }
      ) => Promise<ProductListResult>
    }).listProducts({}, {
      relations: ['categories', 'variants', 'variants.prices', 'tags'],
      take: 10000,
    })

    const searchableProducts = products.map(mapProductToSearchable)
    await searchService.indexProducts(searchableProducts)

    logger.info('Full reindex complete', { totalProducts: searchableProducts.length })

    res.status(200).json({
      message: 'Reindexing complete',
      totalProducts: searchableProducts.length,
    })
  } catch (error) {
    errorHandler(error, req, res)
  }
}
