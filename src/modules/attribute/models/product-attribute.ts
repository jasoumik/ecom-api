import { model } from "@medusajs/framework/utils"

export const ProductAttribute = model.define("product_attribute", {
  id: model.id().primaryKey(),
  productId: model.text(),
  attributeId: model.text(),
  value: model.json(),
})
