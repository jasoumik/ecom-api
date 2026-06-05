import type { MedusaRequest, MedusaResponse } from '@medusajs/framework'
import { Modules } from '@medusajs/framework/utils'
import { errorHandler } from '../../../shared/errors/error-handler'

type ProductCategory = {
  id: string
  parent_category_id: string | null
}

/**
 * GET /store/products
 *
 * Lists products with support for parent-category rollup.
 * When category_id is provided, all products from that category AND
 * any descendant categories are returned.
 *
 * Query params:
 *   category_id  — one or more category IDs (repeated param)
 *   limit        — default 20
 *   offset       — default 0
 *   q            — full-text search
 */
export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> => {
  try {
    const productService = req.scope.resolve(Modules.PRODUCT)

    const svc = productService as {
      listProductCategories: (
        filters: Record<string, unknown>,
        options: Record<string, unknown>
      ) => Promise<ProductCategory[]>
      listAndCountProducts: (
        filters: Record<string, unknown>,
        options: Record<string, unknown>
      ) => Promise<[unknown[], number]>
    }

    const limit = Math.min(Number(req.query.limit ?? 20), 100)
    const offset = Number(req.query.offset ?? 0)

    // Normalise category_id to an array (supports ?category_id=x&category_id=y or ?category_id[]=x)
    let rawIds: string[] = []
    const raw = req.query.category_id
    if (raw) {
      rawIds = Array.isArray(raw) ? (raw as string[]) : [raw as string]
    }

    let categoryIds: string[] | undefined

    if (rawIds.length > 0) {
      // Fetch the full category list once and expand each requested ID to
      // include all of its descendants.
      const allCategories = await svc.listProductCategories(
        { is_active: true },
        { take: 500, select: ['id', 'parent_category_id'] }
      )

      const expanded = new Set<string>()
      for (const id of rawIds) {
        collectDescendants(id, allCategories, expanded)
      }
      categoryIds = Array.from(expanded)
    }

    // Normalise collection_id to an array
    let collectionIds: string[] | undefined
    const rawCollectionId = req.query.collection_id
    if (rawCollectionId) {
      collectionIds = Array.isArray(rawCollectionId)
        ? (rawCollectionId as string[])
        : [rawCollectionId as string]
    }

    const filters: Record<string, unknown> = {}
    if (categoryIds) {
      filters.categories = { id: categoryIds }
    }
    if (collectionIds) {
      filters.collection_id = collectionIds
    }
    if (req.query.q) {
      filters.q = req.query.q
    }
    if (req.query.handle) {
      filters.handle = req.query.handle
    }

    const [products, count] = await svc.listAndCountProducts(filters, {
      take: limit,
      skip: offset,
      relations: [
        'variants',
        'images',
        'categories',
        'collection',
        'tags',
      ],
    })

    res.status(200).json({ products, count })
  } catch (error) {
    errorHandler(error, req, res)
  }
}

/**
 * Recursively adds the given categoryId and all its descendants into `result`.
 */
function collectDescendants(
  categoryId: string,
  all: ProductCategory[],
  result: Set<string>
): void {
  if (result.has(categoryId)) return
  result.add(categoryId)
  for (const cat of all) {
    if (cat.parent_category_id === categoryId) {
      collectDescendants(cat.id, all, result)
    }
  }
}
