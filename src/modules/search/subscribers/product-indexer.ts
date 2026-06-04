import { Modules } from '@medusajs/framework/utils'
import type { SubscriberArgs, SubscriberConfig } from '@medusajs/framework'
import { SEARCH_MODULE } from '../index'
import type SearchModuleService from '../service/search-module-service'
import type { ISearchableProduct } from '../interfaces/search.interface'

// ── Helpers ────────────────────────────────────────────────────────────────

type MedusaProductVariant = {
  prices?: Array<{ amount: number; calculated_price?: { calculated_amount?: number } }>
}

type MedusaProduct = {
  id: string
  handle: string
  title: string
  description?: string | null
  thumbnail?: string | null
  metadata?: Record<string, unknown> | null
  categories?: Array<{ id: string; name: string }>
  variants?: MedusaProductVariant[]
  tags?: Array<{ value: string }>
  created_at: string
  updated_at: string
}

function getLowestPrice(variants: MedusaProductVariant[]): number | null {
  if (!variants?.length) return null
  const prices = variants
    .flatMap((v) => v.prices ?? [])
    .map((p) => p.amount)
    .filter((a) => typeof a === 'number' && a > 0)
  return prices.length > 0 ? Math.min(...prices) : null
}

function getOriginalPrice(variants: MedusaProductVariant[]): number | null {
  // Use the first variant's calculated_price original amount if available
  if (!variants?.length) return null
  for (const v of variants) {
    for (const p of v.prices ?? []) {
      if (p.amount) return p.amount
    }
  }
  return null
}

function checkIsOnSale(variants: MedusaProductVariant[]): boolean {
  if (!variants?.length) return false
  for (const v of variants) {
    for (const p of v.prices ?? []) {
      const calc = p.calculated_price?.calculated_amount
      if (calc !== undefined && calc < p.amount) return true
    }
  }
  return false
}

export function mapProductToSearchable(product: MedusaProduct): ISearchableProduct {
  return {
    id: product.id,
    handle: product.handle,
    title: product.title,
    description: product.description ?? null,
    thumbnail: product.thumbnail ?? null,
    brand: (product.metadata?.brand as string) ?? null,
    originCountry: (product.metadata?.origin_country as string) ?? null,
    categoryIds: product.categories?.map((c) => c.id) ?? [],
    categoryNames: product.categories?.map((c) => c.name) ?? [],
    price: getLowestPrice(product.variants ?? []),
    originalPrice: getOriginalPrice(product.variants ?? []),
    isOnSale: checkIsOnSale(product.variants ?? []),
    tags: product.tags?.map((t) => t.value) ?? [],
    attributes: (product.metadata?.attributes as Record<string, unknown>) ?? {},
    createdAt: product.created_at,
    updatedAt: product.updated_at,
  }
}

// ── Subscriber ─────────────────────────────────────────────────────────────

export default async function productIndexerSubscriber({
  event,
  container,
}: SubscriberArgs<{ id: string }>): Promise<void> {
  const searchService = container.resolve<SearchModuleService>(SEARCH_MODULE)

  if (event.name === 'product.deleted') {
    await searchService.deleteProduct(event.data.id)
    return
  }

  const productService = container.resolve(Modules.PRODUCT)

  const product = await (productService as {
    retrieveProduct: (
      id: string,
      options: { relations: string[] }
    ) => Promise<MedusaProduct>
  }).retrieveProduct(event.data.id, {
    relations: ['categories', 'variants', 'variants.prices', 'tags'],
  })

  const searchableProduct = mapProductToSearchable(product)
  await searchService.indexProduct(searchableProduct)
}

export const config: SubscriberConfig = {
  event: ['product.created', 'product.updated', 'product.deleted'],
}
