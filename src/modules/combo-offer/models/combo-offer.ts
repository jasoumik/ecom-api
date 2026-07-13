import { model } from "@medusajs/framework/utils"

export const ComboOffer = model.define("combo_offer", {
  id: model.id().primaryKey(),
  name: model.text(),
  slug: model.text(),
  description: model.text().nullable(),
  image: model.text().nullable(),
  originalPrice: model.number(),
  comboPrice: model.number(),
  isActive: model.boolean().default(true),
})
