import { z } from 'zod'

export const CreateLandingPageSchema = z.object({
  productId: z.string().uuid(),
  slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/, {
    message: 'Slug must contain only lowercase letters, numbers, and hyphens',
  }),
  headline: z.string().min(1).max(200),
  subHeadline: z.string().max(300).optional().default(''),
  benefits: z.array(z.string()).max(10).default([]),
  beforeAfterImages: z.record(z.string(), z.unknown()).optional().default({}),
  urgencyText: z.string().max(200).nullable().optional(),
  countdownEndsAt: z.coerce.date().nullable().optional(),
  whatsappNumber: z.string().regex(/^880[0-9]{10}$/, {
    message: 'Phone number must be a valid Bangladeshi number starting with 880 followed by 10 digits',
  }),
  messengerLink: z.string().url().nullable().optional(),
  isCODAvailable: z.boolean().default(true),
  deliveryDhaka: z.string().max(100).default('1-2 days'),
  deliveryOutsideDhaka: z.string().max(100).default('3-5 days'),
  bkashNumber: z.string().regex(/^01[0-9]{9}$/, { message: 'Must be a valid 11-digit Bangladeshi mobile number' }).nullable().optional(),
  nagadNumber: z.string().regex(/^01[0-9]{9}$/, { message: 'Must be a valid 11-digit Bangladeshi mobile number' }).nullable().optional(),
  isActive: z.boolean().default(true),
})

export const UpdateLandingPageSchema = CreateLandingPageSchema.partial()

export type CreateLandingPageDTO = z.infer<typeof CreateLandingPageSchema>
export type UpdateLandingPageDTO = z.infer<typeof UpdateLandingPageSchema>
