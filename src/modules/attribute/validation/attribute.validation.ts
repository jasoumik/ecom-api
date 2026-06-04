import { z } from 'zod'
import { AttributeType } from '../models/attribute'

export const CreateAttributeGroupSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).nullable().optional(),
  categoryId: z.string().min(1),
  isInherited: z.boolean().optional(),
  order: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
})

export const UpdateAttributeGroupSchema = CreateAttributeGroupSchema.partial()

export const CreateAttributeSchema = z.object({
  name: z.string().min(1).max(100),
  handle: z.string().min(1).max(100).regex(/^[a-z0-9_]+$/, {
    message: 'Handle must contain only lowercase letters, numbers, and underscores',
  }),
  description: z.string().max(500).nullable().optional(),
  groupId: z.string().min(1),
  type: z.nativeEnum(AttributeType),
  isRequired: z.boolean().optional(),
  isFilterable: z.boolean().optional(),
  isSearchable: z.boolean().optional(),
  isComparable: z.boolean().optional(),
  unit: z.string().max(20).nullable().optional(),
  order: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
})

export const UpdateAttributeSchema = CreateAttributeSchema.partial()

export const CreateAttributeOptionSchema = z.object({
  attributeId: z.string().min(1),
  label: z.string().min(1).max(100),
  value: z.string().min(1).max(100),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/).nullable().optional(),
  order: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
})

export const SetProductAttributesSchema = z.object({
  attributes: z.array(
    z.object({
      attributeId: z.string().min(1),
      value: z.unknown(),
    })
  ).min(1),
})

export type CreateAttributeGroupDTO = z.infer<typeof CreateAttributeGroupSchema>
export type UpdateAttributeGroupDTO = z.infer<typeof UpdateAttributeGroupSchema>
export type CreateAttributeDTO = z.infer<typeof CreateAttributeSchema>
export type UpdateAttributeDTO = z.infer<typeof UpdateAttributeSchema>
export type CreateAttributeOptionDTO = z.infer<typeof CreateAttributeOptionSchema>
export type SetProductAttributesDTO = z.infer<typeof SetProductAttributesSchema>
