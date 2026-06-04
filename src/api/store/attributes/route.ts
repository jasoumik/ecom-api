import type { MedusaRequest, MedusaResponse } from '@medusajs/framework'
import { Modules } from '@medusajs/framework/utils'
import { ATTRIBUTE_MODULE } from '../../../modules/attribute'
import type AttributeModuleService from '../../../modules/attribute/service/attribute-module-service'
import { errorHandler } from '../../../shared/errors/error-handler'
import { ValidationError } from '../../../shared/errors/app-error'

type ProductCategory = {
  id: string
  handle: string
  parent_category_id: string | null
}

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
    const productService = req.scope.resolve(Modules.PRODUCT)

    // Fetch all categories to walk the ancestor chain
    const allCategories = await (productService as {
      listProductCategories: (
        filters: Record<string, unknown>,
        options: Record<string, unknown>
      ) => Promise<ProductCategory[]>
    }).listProductCategories({}, { take: 500 })

    const ancestorIds = getAncestorIds(allCategories, categoryId)

    const schema = await attributeService.getCategoryAttributeSchema(ancestorIds)

    res.status(200).json({ data: schema })
  } catch (error) {
    errorHandler(error, req, res)
  }
}

/**
 * Returns the id of the given category plus all its ancestor ids,
 * ordered from root to leaf (mirrors the old getBreadcrumb behaviour).
 */
function getAncestorIds(
  categories: ProductCategory[],
  categoryId: string
): string[] {
  const byId = new Map(categories.map((c) => [c.id, c]))
  const chain: string[] = []
  let current = byId.get(categoryId)
  while (current) {
    chain.unshift(current.id)
    current = current.parent_category_id
      ? byId.get(current.parent_category_id)
      : undefined
  }
  return chain
}
