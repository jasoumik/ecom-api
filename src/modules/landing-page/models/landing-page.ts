import { model } from "@medusajs/framework/utils"

export const LandingPage = model.define("landing_page", {
  id: model.id().primaryKey(),
  productId: model.text(),
  slug: model.text(),
  headline: model.text(),
  subHeadline: model.text(),
  benefits: model.json(),
  beforeAfterImages: model.json(),
  urgencyText: model.text().nullable(),
  countdownEndsAt: model.dateTime().nullable(),
  whatsappNumber: model.text(),
  messengerLink: model.text().nullable(),
  isCODAvailable: model.boolean().default(true),
  deliveryDhaka: model.text().default("1-2 days"),
  deliveryOutsideDhaka: model.text().default("3-5 days"),
  bkashNumber: model.text().nullable(),
  nagadNumber: model.text().nullable(),
  isActive: model.boolean().default(true),
})
