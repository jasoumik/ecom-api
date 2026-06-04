import { model } from "@medusajs/framework/utils"

export const ComboItem = model.define("combo_item", {
  id: model.id().primaryKey(),
  comboOfferId: model.text(),
  productId: model.text(),
  quantity: model.number().default(1),
})
