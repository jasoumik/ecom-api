import { z } from 'zod'
import { WatermarkPosition } from '../models/brand-settings'

export const UpdateBrandSettingsSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  logoUrl: z.string().url().nullable().optional(),
  watermarkPosition: z.nativeEnum(WatermarkPosition).optional(),
  watermarkOpacity: z.number().min(0).max(1).optional(),
  watermarkSizePercent: z.number().min(5).max(50).optional(),
  watermarkPadding: z.number().min(0).max(100).optional(),
  isActive: z.boolean().optional(),
})

export const CreateBrandSettingsSchema = UpdateBrandSettingsSchema.extend({
  name: z.string().min(1).max(100),
})

export type UpdateBrandSettingsDTO = z.infer<typeof UpdateBrandSettingsSchema>
export type CreateBrandSettingsDTO = z.infer<typeof CreateBrandSettingsSchema>
