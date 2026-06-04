export interface ISearchableProduct {
  id: string
  handle: string
  title: string
  description: string | null
  thumbnail: string | null
  brand: string | null
  originCountry: string | null
  categoryIds: string[]
  categoryNames: string[]
  price: number | null
  originalPrice: number | null
  isOnSale: boolean
  tags: string[]
  attributes: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

export interface ISearchFilters {
  categoryId?: string
  brand?: string
  originCountry?: string
  minPrice?: number
  maxPrice?: number
  isOnSale?: boolean
  attributes?: Record<string, string | string[]>
}

export interface ISearchParams {
  query: string
  filters?: ISearchFilters
  page?: number
  limit?: number
  sortBy?: 'price_asc' | 'price_desc' | 'newest' | 'relevance'
}

export interface ISearchResult {
  hits: ISearchableProduct[]
  totalHits: number
  page: number
  limit: number
  totalPages: number
  processingTimeMs: number
  facetDistribution?: Record<string, Record<string, number>>
}

export interface ISearchService {
  search(params: ISearchParams): Promise<ISearchResult>
  indexProduct(product: ISearchableProduct): Promise<void>
  indexProducts(products: ISearchableProduct[]): Promise<void>
  deleteProduct(id: string): Promise<void>
  reindexAll(): Promise<{ totalProducts: number }>
  getSearchKey(): Promise<string>
}
