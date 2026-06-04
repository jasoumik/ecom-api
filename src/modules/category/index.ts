import { Module } from "@medusajs/framework/utils"
import CategoryModuleService from "./service/category-module-service"

export const CATEGORY_MODULE = "categoryModule"

export default Module(CATEGORY_MODULE, {
  service: CategoryModuleService,
})
