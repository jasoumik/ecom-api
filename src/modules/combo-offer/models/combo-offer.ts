import { model } from "@medusajs/framework/utils"

export enum ComboOfferType {
  FIXED_BUNDLE = "FIXED_BUNDLE",
  BUY_X_GET_Y = "BUY_X_GET_Y",
  PERCENTAGE_OFF = "PERCENTAGE_OFF",
  TIERED_PRICING = "TIERED_PRICING",
  CUSTOM_BUNDLE = "CUSTOM_BUNDLE",
}

export const ComboOffer = model.define("combo_offer", {
  id: model.id().primaryKey(),
  name: model.text(),
  slug: model.text(),
  description: model.text().nullable(),
  image: model.text().nullable(),
  type: model.enum(Object.values(ComboOfferType)).default(ComboOfferType.FIXED_BUNDLE),
  discountValue: model.number().default(0),
  originalPrice: model.number(),
  comboPrice: model.number(),
  isActive: model.boolean().default(true),
  startsAt: model.dateTime().nullable(),
  endsAt: model.dateTime().nullable(),
})
