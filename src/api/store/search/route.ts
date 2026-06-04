import type { MedusaRequest, MedusaResponse } from '@medusajs/framework'
import { SEARCH_MODULE } from '../../../modules/search'
import type SearchModuleService from '../../../modules/search/service/search-module-service'
import { SearchSchema } from '../../../modules/search/validation/search.validation'
import { errorHandler } from '../../../shared/errors/error-handler'

/**
 * POST /store/search
 *
 * Full-text product search powered by MeiliSearch.
 * Supports filtering, sorting, and pagination.
 */
export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse,
): Promise<void> => {
  try {
    const parsed = SearchSchema.parse(req.body)

    const searchService = req.scope.resolve<SearchModuleService>(SEARCH_MODULE)
    const result = await searchService.search(parsed)

    res.status(200).json(result)
  } catch (error) {
    errorHandler(error, req, res)
  }
}
