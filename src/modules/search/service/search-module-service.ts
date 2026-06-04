import { MeiliSearch, Key } from 'meilisearch'
import { createLogger } from '../../../shared/logger'
import type {
  ISearchableProduct,
  ISearchFilters,
  ISearchParams,
  ISearchResult,
  ISearchService,
} from '../interfaces/search.interface'

const INDEX_NAME = 'products'
const BATCH_SIZE = 500
const SEARCH_KEY_DESCRIPTION = 'search-only-frontend'

const logger = createLogger('SearchModule')

export class SearchModuleService implements ISearchService {
  private client: MeiliSearch

  constructor() {
    this.client = new MeiliSearch({
      host: process.env.MEILISEARCH_HOST ?? 'http://localhost:7700',
      apiKey: process.env.MEILISEARCH_API_KEY ?? '',
    })
  }

  async configureIndex(): Promise<void> {
    logger.info('Configuring MeiliSearch index settings')
    const index = this.client.index(INDEX_NAME)

    await index.updateSettings({
      searchableAttributes: [
        'title',
        'description',
        'brand',
        'categoryNames',
        'tags',
        'attributes',
      ],
      filterableAttributes: [
        'categoryIds',
        'brand',
        'originCountry',
        'price',
        'isOnSale',
      ],
      sortableAttributes: ['price', 'createdAt'],
      rankingRules: [
        'words',
        'typo',
        'proximity',
        'attribute',
        'sort',
        'exactness',
      ],
      typoTolerance: {
        enabled: true,
        minWordSizeForTypos: {
          oneTypo: 4,
          twoTypos: 8,
        },
      },
    })

    logger.info('MeiliSearch index settings configured')
  }

  async search(params: ISearchParams): Promise<ISearchResult> {
    const {
      query,
      filters = {},
      page = 1,
      limit = 20,
      sortBy = 'relevance',
    } = params

    const offset = (page - 1) * limit
    const filterParts = this.buildFilterString(filters)
    const sort = this.buildSort(sortBy)

    logger.info('Searching products', { query, page, limit, sortBy })

    const result = await this.client.index(INDEX_NAME).search<ISearchableProduct>(
      query,
      {
        offset,
        limit,
        ...(filterParts ? { filter: filterParts } : {}),
        ...(sort.length > 0 ? { sort } : {}),
        facets: ['brand', 'originCountry', 'categoryNames', 'isOnSale'],
      },
    )

    const totalHits = result.estimatedTotalHits ?? result.hits.length
    const totalPages = Math.ceil(totalHits / limit)

    return {
      hits: result.hits,
      totalHits,
      page,
      limit,
      totalPages,
      processingTimeMs: result.processingTimeMs,
      facetDistribution: result.facetDistribution as Record<
        string,
        Record<string, number>
      >,
    }
  }

  async indexProduct(product: ISearchableProduct): Promise<void> {
    logger.info('Indexing product', { id: product.id, title: product.title })
    await this.client.index(INDEX_NAME).addDocuments([product])
    logger.info('Product indexed', { id: product.id })
  }

  async indexProducts(products: ISearchableProduct[]): Promise<void> {
    logger.info('Indexing products batch', { count: products.length })

    for (let i = 0; i < products.length; i += BATCH_SIZE) {
      const chunk = products.slice(i, i + BATCH_SIZE)
      await this.client.index(INDEX_NAME).addDocuments(chunk)
      logger.info('Indexed batch', {
        from: i,
        to: i + chunk.length,
        total: products.length,
      })
    }

    logger.info('All products indexed', { total: products.length })
  }

  async deleteProduct(id: string): Promise<void> {
    logger.info('Deleting product from index', { id })
    await this.client.index(INDEX_NAME).deleteDocument(id)
    logger.info('Product deleted from index', { id })
  }

  async reindexAll(): Promise<{ totalProducts: number }> {
    logger.info('Starting full reindex — deleting all documents')
    await this.client.index(INDEX_NAME).deleteAllDocuments()
    logger.info('All documents deleted — index ready for reindex')
    // Actual re-population is triggered by the caller (reindex route)
    // which fetches all products and calls indexProducts()
    return { totalProducts: 0 }
  }

  async getSearchKey(): Promise<string> {
    logger.info('Fetching search-only API key')

    try {
      const keys = await this.client.getKeys()
      const existing = keys.results.find(
        (k: Key) => k.description === SEARCH_KEY_DESCRIPTION,
      )
      if (existing?.key) {
        return existing.key
      }
    } catch (err) {
      logger.warn('Could not list keys, will attempt to create', {
        error: err instanceof Error ? err.message : String(err),
      })
    }

    const created = await this.client.createKey({
      description: SEARCH_KEY_DESCRIPTION,
      actions: ['search'],
      indexes: [INDEX_NAME],
      expiresAt: null,
    })

    logger.info('Search-only API key created')
    return created.key
  }

  // ── Private helpers ─────────────────────────────────────────────────────────

  private buildFilterString(filters: ISearchFilters): string {
    const parts: string[] = []

    if (filters.categoryId) {
      parts.push(`categoryIds = "${filters.categoryId}"`)
    }

    if (filters.brand) {
      parts.push(`brand = "${filters.brand}"`)
    }

    if (filters.originCountry) {
      parts.push(`originCountry = "${filters.originCountry}"`)
    }

    if (filters.minPrice !== undefined && filters.maxPrice !== undefined) {
      parts.push(`price >= ${filters.minPrice} AND price <= ${filters.maxPrice}`)
    } else if (filters.minPrice !== undefined) {
      parts.push(`price >= ${filters.minPrice}`)
    } else if (filters.maxPrice !== undefined) {
      parts.push(`price <= ${filters.maxPrice}`)
    }

    if (filters.isOnSale !== undefined) {
      parts.push(`isOnSale = ${filters.isOnSale}`)
    }

    return parts.join(' AND ')
  }

  private buildSort(sortBy: ISearchParams['sortBy']): string[] {
    switch (sortBy) {
      case 'price_asc':
        return ['price:asc']
      case 'price_desc':
        return ['price:desc']
      case 'newest':
        return ['createdAt:desc']
      case 'relevance':
      default:
        return []
    }
  }
}

export default SearchModuleService
