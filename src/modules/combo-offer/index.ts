import { Module } from "@medusajs/framework/utils"
import ComboOfferModuleService from "./service/combo-offer-module-service"

export const COMBO_OFFER_MODULE = "comboOfferModule"

export default Module(COMBO_OFFER_MODULE, {
  service: ComboOfferModuleService,
})
