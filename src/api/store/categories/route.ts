import type { MedusaRequest, MedusaResponse } from '@medusajs/framework'
import { Modules } from '@medusajs/framework/utils'
import { errorHandler } from '../../../shared/errors/error-handler'

type ProductCategory = {
  id: string
  name: string
  handle: string
  parent_category_id: string | null
  rank: number
  is_active: boolean
  children?: ProductCategory[]
}

/**
 * GET /store/categories
 *
 * Returns the full recursive category tree for active categories using
 * Medusa's built-in product_category module.
 */
export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> => {
  try {
    const productService = req.scope.resolve(Modules.PRODUCT)

    const categories = await (productService as {
      listProductCategories: (
        filters: Record<string, unknown>,
        options: Record<string, unknown>
      ) => Promise<ProductCategory[]>
    }).listProductCategories(
      { is_active: true },
      { take: 500 }
    )

    const tree = buildTree(categories, null)
    res.status(200).json({ data: tree })
  } catch (error) {
    errorHandler(error, req, res)
  }
}

function buildTree(
  nodes: ProductCategory[],
  parentId: string | null
): ProductCategory[] {
  return nodes
    .filter((n) => (n.parent_category_id ?? null) === parentId)
    .sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0))
    .map((node) => ({
      ...node,
      children: buildTree(nodes, node.id),
    }))
}
