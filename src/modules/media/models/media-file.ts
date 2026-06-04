import { model } from "@medusajs/framework/utils"

export const MediaFile = model.define("media_file", {
  id: model.id().primaryKey(),
  originalName: model.text(),
  fileName: model.text(),
  mimeType: model.text(),
  originalMimeType: model.text(),
  size: model.number(),
  width: model.number().nullable(),
  height: model.number().nullable(),
  r2Key: model.text(),
  r2Url: model.text(),
  hasWatermark: model.boolean().default(false),
  entityType: model.text().nullable(),
  entityId: model.text().nullable(),
  uploadedBy: model.text().nullable(),
})
