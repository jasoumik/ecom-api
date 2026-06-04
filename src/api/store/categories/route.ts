import type { MedusaRequest, MedusaResponse } from '@medusajs/framework'
import { CATEGORY_MODULE } from '../../../modules/category'
import type CategoryModuleService from '../../../modules/category/service/category-module-service'
import { errorHandler } from '../../../shared/errors/error-handler'

/**
 * GET /store/categories
 *
 * Returns the full recursive category tree for active categories.
 */
export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> => {
  try {
    const categoryService = req.scope.resolve<CategoryModuleService>(CATEGORY_MODULE)
    const tree = await categoryService.getTree()
    res.status(200).json({ data: tree })
  } catch (error) {
    errorHandler(error, req, res)
  }
}
