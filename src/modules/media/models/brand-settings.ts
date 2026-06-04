import { model } from "@medusajs/framework/utils"

export enum WatermarkPosition {
  TOP_LEFT = "TOP_LEFT",
  TOP_RIGHT = "TOP_RIGHT",
  BOTTOM_LEFT = "BOTTOM_LEFT",
  BOTTOM_RIGHT = "BOTTOM_RIGHT",
  CENTER = "CENTER",
}

export const BrandSettings = model.define("brand_settings", {
  id: model.id().primaryKey(),
  name: model.text(),
  logoUrl: model.text().nullable(),
  watermarkPosition: model.enum(WatermarkPosition).default(WatermarkPosition.BOTTOM_RIGHT),
  watermarkOpacity: model.number().default(0.7),
  watermarkSizePercent: model.number().default(15),
  watermarkPadding: model.number().default(20),
  isActive: model.boolean().default(true),
})
