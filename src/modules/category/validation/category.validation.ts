import { z } from 'zod'

export const CreateCategorySchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/, {
    message: 'Slug must contain only lowercase letters, numbers, and hyphens',
  }),
  description: z.string().max(500).optional(),
  image: z.string().url().optional(),
  order: z.number().int().min(0).optional(),
  parentId: z.string().uuid().optional(),
})

export const UpdateCategorySchema = CreateCategorySchema.partial().extend({
  isActive: z.boolean().optional(),
  parentId: z.string().uuid().nullable().optional(),
})

export type CreateCategoryDTO = z.infer<typeof CreateCategorySchema>
export type UpdateCategoryDTO = z.infer<typeof UpdateCategorySchema>
