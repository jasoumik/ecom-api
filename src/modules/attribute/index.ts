import { Module } from "@medusajs/framework/utils"
import AttributeModuleService from "./service/attribute-module-service"

export const ATTRIBUTE_MODULE = "attributeModule"

export default Module(ATTRIBUTE_MODULE, {
  service: AttributeModuleService,
})
