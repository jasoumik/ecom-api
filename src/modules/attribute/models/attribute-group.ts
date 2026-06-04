import { model } from "@medusajs/framework/utils"

export const AttributeGroup = model.define("attribute_group", {
  id: model.id().primaryKey(),
  name: model.text(),
  description: model.text().nullable(),
  categoryId: model.text(),
  isInherited: model.boolean().default(true),
  order: model.number().default(0),
  isActive: model.boolean().default(true),
})
