import type { MedusaRequest, MedusaResponse } from '@medusajs/framework'
import { ATTRIBUTE_MODULE } from '../../../modules/attribute'
import type AttributeModuleService from '../../../modules/attribute/service/attribute-module-service'
import { CATEGORY_MODULE } from '../../../modules/category'
import type CategoryModuleService from '../../../modules/category/service/category-module-service'
import { errorHandler } from '../../../shared/errors/error-handler'
import { ValidationError } from '../../../shared/errors/app-error'

/**
 * GET /store/attributes?categoryId=xxx
 *
 * Returns the full attribute schema for a category including inherited groups
 * from ancestor categories. Used by the frontend filter sidebar.
 */
export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  try {
    const { categoryId } = req.query as { categoryId?: string }

    if (!categoryId) {
      throw new ValidationError('categoryId query parameter is required')
    }

    const attributeService = req.scope.resolve<AttributeModuleService>(ATTRIBUTE_MODULE)
    const categoryService = req.scope.resolve<CategoryModuleService>(CATEGORY_MODULE)

    const breadcrumb = await categoryService.getBreadcrumb(categoryId)
    const ancestorIds = breadcrumb.map((c) => c.id)

    const schema = await attributeService.getCategoryAttributeSchema(ancestorIds)

    res.status(200).json({ data: schema })
  } catch (error) {
    errorHandler(error, req, res)
  }
}
