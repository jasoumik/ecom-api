import { Module } from '@medusajs/framework/utils'
import SearchModuleService from './service/search-module-service'

export const SEARCH_MODULE = 'searchModule'

export default Module(SEARCH_MODULE, {
  service: SearchModuleService,
})
