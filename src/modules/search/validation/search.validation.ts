import { z } from 'zod'

export const SearchSchema = z.object({
  query: z.string().min(1).max(200),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  sortBy: z
    .enum(['price_asc', 'price_desc', 'newest', 'relevance'])
    .default('relevance'),
  filters: z
    .object({
      categoryId: z.string().optional(),
      brand: z.string().optional(),
      originCountry: z.string().optional(),
      minPrice: z.coerce.number().min(0).optional(),
      maxPrice: z.coerce.number().min(0).optional(),
      isOnSale: z.coerce.boolean().optional(),
      attributes: z
        .record(z.string(), z.union([z.string(), z.array(z.string())]))
        .optional(),
    })
    .optional(),
})

export type SearchInput = z.infer<typeof SearchSchema>
