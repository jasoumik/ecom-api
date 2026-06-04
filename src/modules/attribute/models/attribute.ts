import { model } from "@medusajs/framework/utils"

export enum AttributeType {
  TEXT = "TEXT",
  NUMBER = "NUMBER",
  BOOLEAN = "BOOLEAN",
  SELECT = "SELECT",
  MULTISELECT = "MULTISELECT",
  DATE = "DATE",
  COLOR = "COLOR",
  URL = "URL",
}

export const Attribute = model.define("attribute", {
  id: model.id().primaryKey(),
  name: model.text(),
  handle: model.text(),
  description: model.text().nullable(),
  groupId: model.text(),
  type: model.enum(AttributeType),
  isRequired: model.boolean().default(false),
  isFilterable: model.boolean().default(true),
  isSearchable: model.boolean().default(true),
  isComparable: model.boolean().default(false),
  unit: model.text().nullable(),
  order: model.number().default(0),
  isActive: model.boolean().default(true),
})
