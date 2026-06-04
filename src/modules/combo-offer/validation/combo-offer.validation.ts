import { z } from 'zod'
import { ComboOfferType } from '../models/combo-offer'

export const CreateComboOfferSchema = z
  .object({
    name: z.string().min(1).max(200),
    slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/, {
      message: 'Slug must contain only lowercase letters, numbers, and hyphens',
    }),
    description: z.string().max(1000).nullable().optional(),
    image: z.string().url().nullable().optional(),
    type: z.nativeEnum(ComboOfferType).optional(),
    discountValue: z.number().min(0).optional(),
    originalPrice: z.number().positive(),
    comboPrice: z.number().positive(),
    isActive: z.boolean().optional(),
    startsAt: z.coerce.date().nullable().optional(),
    endsAt: z.coerce.date().nullable().optional(),
  })
  .refine((data) => data.comboPrice < data.originalPrice, {
    message: 'comboPrice must be less than originalPrice',
    path: ['comboPrice'],
  })
  .refine(
    (data) => {
      if (data.startsAt && data.endsAt) {
        return data.endsAt > data.startsAt
      }
      return true
    },
    {
      message: 'endsAt must be after startsAt',
      path: ['endsAt'],
    }
  )

export const UpdateComboOfferSchema = z
  .object({
    name: z.string().min(1).max(200).optional(),
    slug: z
      .string()
      .min(1)
      .max(200)
      .regex(/^[a-z0-9-]+$/, {
        message: 'Slug must contain only lowercase letters, numbers, and hyphens',
      })
      .optional(),
    description: z.string().max(1000).nullable().optional(),
    image: z.string().url().nullable().optional(),
    type: z.nativeEnum(ComboOfferType).optional(),
    discountValue: z.number().min(0).optional(),
    originalPrice: z.number().positive().optional(),
    comboPrice: z.number().positive().optional(),
    isActive: z.boolean().optional(),
    startsAt: z.coerce.date().nullable().optional(),
    endsAt: z.coerce.date().nullable().optional(),
  })
  .refine(
    (data) => {
      if (data.originalPrice !== undefined && data.comboPrice !== undefined) {
        return data.comboPrice < data.originalPrice
      }
      return true
    },
    {
      message: 'comboPrice must be less than originalPrice',
      path: ['comboPrice'],
    }
  )
  .refine(
    (data) => {
      if (data.startsAt && data.endsAt) {
        return data.endsAt > data.startsAt
      }
      return true
    },
    {
      message: 'endsAt must be after startsAt',
      path: ['endsAt'],
    }
  )

export const AddComboItemSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().min(1).max(99),
})

export const AddComboItemsSchema = z.object({
  items: z.array(AddComboItemSchema).min(1),
})

export type CreateComboOfferDTO = z.infer<typeof CreateComboOfferSchema>
export type UpdateComboOfferDTO = z.infer<typeof UpdateComboOfferSchema>
export type AddComboItemDTO = z.infer<typeof AddComboItemSchema>
export type AddComboItemsDTO = z.infer<typeof AddComboItemsSchema>
