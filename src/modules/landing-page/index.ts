import { Module } from "@medusajs/framework/utils"
import LandingPageModuleService from "./service/landing-page-module-service"

export const LANDING_PAGE_MODULE = "landingPageModule"

export default Module(LANDING_PAGE_MODULE, {
  service: LandingPageModuleService,
})
