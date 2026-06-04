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

type RawProduct = {
  id: string
  categories?: Array<{ id: string }>
}

/**
 * GET /store/categories
 *
 * Returns the full recursive category tree for active categories.
 *
 * Query params:
 *   filter_empty=true  — omit categories (and branches) that have no products
 */
export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> => {
  try {
    const filterEmpty = req.query.filter_empty === 'true'
    const productService = req.scope.resolve(Modules.PRODUCT)

    const svc = productService as {
      listProductCategories: (
        filters: Record<string, unknown>,
        options: Record<string, unknown>
      ) => Promise<ProductCategory[]>
      listProducts: (
        filters: Record<string, unknown>,
        options: Record<string, unknown>
      ) => Promise<RawProduct[]>
    }

    const categories = await svc.listProductCategories(
      { is_active: true },
      {
        take: 500,
        select: ['id', 'name', 'handle', 'parent_category_id', 'rank', 'is_active'],
      }
    )

    let populatedIds: Set<string> | null = null

    if (filterEmpty) {
      const categoryIds = categories.map((c) => c.id)
      const products = await svc.listProducts(
        { categories: { id: categoryIds } },
        { take: 1000, select: ['id'], relations: ['categories'] }
      )
      populatedIds = new Set<string>()
      for (const p of products) {
        for (const cat of p.categories ?? []) {
          populatedIds.add(cat.id)
        }
      }
      // Propagate upward: if a child has products, its ancestors are shown too
      for (const cat of categories) {
        if (populatedIds.has(cat.id) && cat.parent_category_id) {
          propagateUp(cat.parent_category_id, categories, populatedIds)
        }
      }
    }

    const tree = buildTree(categories, null, populatedIds)
    res.status(200).json({ data: tree })
  } catch (error) {
    errorHandler(error, req, res)
  }
}

function propagateUp(
  parentId: string,
  all: ProductCategory[],
  set: Set<string>
): void {
  if (set.has(parentId)) return
  set.add(parentId)
  const parent = all.find((c) => c.id === parentId)
  if (parent?.parent_category_id) {
    propagateUp(parent.parent_category_id, all, set)
  }
}

function buildTree(
  nodes: ProductCategory[],
  parentId: string | null,
  populatedIds: Set<string> | null
): ProductCategory[] {
  return nodes
    .filter((n) => (n.parent_category_id ?? null) === parentId)
    .filter((n) => !populatedIds || populatedIds.has(n.id))
    .sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0))
    .map((node) => ({
      ...node,
      children: buildTree(nodes, node.id, populatedIds),
    }))
}
