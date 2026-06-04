import { Module } from "@medusajs/framework/utils"
import MediaModuleService from "./service/media-module-service"

export const MEDIA_MODULE = "mediaModule"

export default Module(MEDIA_MODULE, {
  service: MediaModuleService,
})
