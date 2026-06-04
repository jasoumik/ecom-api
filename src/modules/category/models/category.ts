import { model } from "@medusajs/framework/utils"

export const Category = model.define("category", {
  id: model.id().primaryKey(),
  name: model.text(),
  slug: model.text(),
  description: model.text().nullable(),
  image: model.text().nullable(),
  level: model.number().default(0),
  order: model.number().default(0),
  isActive: model.boolean().default(true),
  parentId: model.text().nullable(),
})
