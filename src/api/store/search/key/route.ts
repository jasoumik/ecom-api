import type { MedusaRequest, MedusaResponse } from '@medusajs/framework'
import { SEARCH_MODULE } from '../../../../modules/search'
import type SearchModuleService from '../../../../modules/search/service/search-module-service'
import { errorHandler } from '../../../../shared/errors/error-handler'

/**
 * GET /store/search/key
 *
 * Returns a search-only MeiliSearch API key and the host URL.
 * The frontend uses this to call MeiliSearch directly for instant search.
 */
export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse,
): Promise<void> => {
  try {
    const searchService = req.scope.resolve<SearchModuleService>(SEARCH_MODULE)
    const searchKey = await searchService.getSearchKey()

    res.status(200).json({
      searchKey,
      host: process.env.MEILISEARCH_HOST ?? 'http://localhost:7700',
    })
  } catch (error) {
    errorHandler(error, req, res)
  }
}
