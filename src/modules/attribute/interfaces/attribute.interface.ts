import { AttributeType } from '../models/attribute'

export interface IAttributeGroup {
  id: string
  name: string
  description: string | null
  categoryId: string
  isInherited: boolean
  order: number
  isActive: boolean
}

export interface IAttribute {
  id: string
  name: string
  handle: string
  description: string | null
  groupId: string
  type: AttributeType
  isRequired: boolean
  isFilterable: boolean
  isSearchable: boolean
  isComparable: boolean
  unit: string | null
  order: number
  isActive: boolean
  created_at: Date
  updated_at: Date
  deleted_at: Date | null
}

export interface IAttributeOption {
  id: string
  attributeId: string
  label: string
  value: string
  color: string | null
  order: number
  isActive: boolean
}

export interface IProductAttribute {
  id: string
  productId: string
  attributeId: string
  value: unknown
}

export interface ICreateAttributeGroupDTO {
  name: string
  description?: string | null
  categoryId: string
  isInherited?: boolean
  order?: number
  isActive?: boolean
}

export interface IUpdateAttributeGroupDTO {
  name?: string
  description?: string | null
  categoryId?: string
  isInherited?: boolean
  order?: number
  isActive?: boolean
}

export interface ICreateAttributeDTO {
  name: string
  handle: string
  description?: string | null
  groupId: string
  type: AttributeType
  isRequired?: boolean
  isFilterable?: boolean
  isSearchable?: boolean
  isComparable?: boolean
  unit?: string | null
  order?: number
  isActive?: boolean
}

export interface IUpdateAttributeDTO {
  name?: string
  handle?: string
  description?: string | null
  groupId?: string
  type?: AttributeType
  isRequired?: boolean
  isFilterable?: boolean
  isSearchable?: boolean
  isComparable?: boolean
  unit?: string | null
  order?: number
  isActive?: boolean
}

export interface ICreateAttributeOptionDTO {
  attributeId: string
  label: string
  value: string
  color?: string | null
  order?: number
  isActive?: boolean
}

export interface ISetProductAttributeDTO {
  attributeId: string
  value: unknown
}

export interface IAttributeSchema {
  group: IAttributeGroup
  attributes: (IAttribute & { options: IAttributeOption[] })[]
}

export interface IAttributeWithValue {
  attribute: IAttribute
  value: unknown
}

export interface IAttributeService {
  // Groups
  createGroup(data: ICreateAttributeGroupDTO): Promise<IAttributeGroup>
  updateGroup(id: string, data: IUpdateAttributeGroupDTO): Promise<IAttributeGroup>
  deleteGroup(id: string): Promise<void>
  listGroups(filters?: Partial<{ categoryId: string; isActive: boolean; isInherited: boolean }>): Promise<IAttributeGroup[]>

  // Attributes
  createAttribute(data: ICreateAttributeDTO): Promise<IAttribute>
  updateAttribute(id: string, data: IUpdateAttributeDTO): Promise<IAttribute>
  deleteAttribute(id: string): Promise<void>
  listAttributeDefinitions(filters?: Partial<{ groupId: string; type: AttributeType; isActive: boolean; isFilterable: boolean; isSearchable: boolean }>): Promise<IAttribute[]>

  // Options
  createOption(data: ICreateAttributeOptionDTO): Promise<IAttributeOption>
  updateOption(id: string, data: Partial<Omit<ICreateAttributeOptionDTO, 'attributeId'>>): Promise<IAttributeOption>
  deleteOption(id: string): Promise<void>
  listOptions(attributeId: string): Promise<IAttributeOption[]>

  // Product attributes
  setProductAttributes(productId: string, attributes: ISetProductAttributeDTO[]): Promise<void>
  getProductAttributes(productId: string): Promise<IAttributeWithValue[]>
  removeProductAttributes(productId: string): Promise<void>

  // Schema
  getCategoryAttributeSchema(categoryAncestors: string[]): Promise<IAttributeSchema[]>
}
