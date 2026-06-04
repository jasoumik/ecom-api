import { model } from "@medusajs/framework/utils"

export const AttributeOption = model.define("attribute_option", {
  id: model.id().primaryKey(),
  attributeId: model.text(),
  label: model.text(),
  value: model.text(),
  color: model.text().nullable(),
  order: model.number().default(0),
  isActive: model.boolean().default(true),
})
