import { model } from "@medusajs/framework/utils"

export const SiteSettings = model.define("site_settings", {
  id: model.id().primaryKey(),
  heroImageUrl: model.text().nullable(),
  philosophyImage1Url: model.text().nullable(),
  philosophyImage2Url: model.text().nullable(),
})
