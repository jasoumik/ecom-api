import { AttributeType } from '../models/attribute'
import type {
  IAttributeGroup,
  IAttribute,
  IAttributeOption,
  IProductAttribute,
  ICreateAttributeGroupDTO,
  IUpdateAttributeGroupDTO,
  ICreateAttributeDTO,
  IUpdateAttributeDTO,
  ICreateAttributeOptionDTO,
  ISetProductAttributeDTO,
} from '../interfaces/attribute.interface'

type ServiceAdapter = {
  listAttributeGroups(filters?: Record<string, unknown>): Promise<IAttributeGroup[]>
  retrieveAttributeGroup(id: string): Promise<IAttributeGroup>
  createAttributeGroups(data: Record<string, unknown>): Promise<IAttributeGroup>
  updateAttributeGroups(selector: Record<string, unknown>, data: Record<string, unknown>): Promise<IAttributeGroup[]>
  deleteAttributeGroups(id: string): Promise<void>

  listAttributes(filters?: Record<string, unknown>): Promise<IAttribute[]>
  retrieveAttribute(id: string): Promise<IAttribute>
  createAttributes(data: Record<string, unknown>): Promise<IAttribute>
  updateAttributes(selector: Record<string, unknown>, data: Record<string, unknown>): Promise<IAttribute[]>
  deleteAttributes(id: string): Promise<void>

  listAttributeOptions(filters?: Record<string, unknown>): Promise<IAttributeOption[]>
  createAttributeOptions(data: Record<string, unknown>): Promise<IAttributeOption>
  updateAttributeOptions(selector: Record<string, unknown>, data: Record<string, unknown>): Promise<IAttributeOption[]>
  deleteAttributeOptions(id: string): Promise<void>

  listProductAttributes(filters?: Record<string, unknown>): Promise<IProductAttribute[]>
  createProductAttributes(data: Record<string, unknown>): Promise<IProductAttribute>
  updateProductAttributes(selector: Record<string, unknown>, data: Record<string, unknown>): Promise<IProductAttribute[]>
  deleteProductAttributes(id: string): Promise<void>
}

export class AttributeRepository {
  constructor(private readonly svc: ServiceAdapter) {}

  // ── Groups ──────────────────────────────────────────────────────────────────

  async findGroupById(id: string): Promise<IAttributeGroup | null> {
    return this.svc.retrieveAttributeGroup(id).catch(() => null)
  }

  async findGroupsByCategory(
    filters: Partial<{ categoryId: string; isActive: boolean; isInherited: boolean }> = {}
  ): Promise<IAttributeGroup[]> {
    return this.svc.listAttributeGroups(filters as Record<string, unknown>)
  }

  async createGroup(data: ICreateAttributeGroupDTO): Promise<IAttributeGroup> {
    return this.svc.createAttributeGroups(data as unknown as Record<string, unknown>)
  }

  async updateGroup(id: string, data: IUpdateAttributeGroupDTO): Promise<IAttributeGroup> {
    const [updated] = await this.svc.updateAttributeGroups({ id }, data as Record<string, unknown>)
    return updated
  }

  async deleteGroup(id: string): Promise<void> {
    return this.svc.deleteAttributeGroups(id)
  }

  // ── Attributes ──────────────────────────────────────────────────────────────

  async findAttributeById(id: string): Promise<IAttribute | null> {
    return this.svc.retrieveAttribute(id).catch(() => null)
  }

  async findAttributesByGroup(
    filters: Partial<{ groupId: string; type: AttributeType; isActive: boolean; isFilterable: boolean; isSearchable: boolean }> = {}
  ): Promise<IAttribute[]> {
    return this.svc.listAttributes(filters as Record<string, unknown>)
  }

  async createAttribute(data: ICreateAttributeDTO): Promise<IAttribute> {
    return this.svc.createAttributes(data as unknown as Record<string, unknown>)
  }

  async updateAttribute(id: string, data: IUpdateAttributeDTO): Promise<IAttribute> {
    const [updated] = await this.svc.updateAttributes({ id }, data as Record<string, unknown>)
    return updated
  }

  async deleteAttribute(id: string): Promise<void> {
    return this.svc.deleteAttributes(id)
  }

  // ── Options ─────────────────────────────────────────────────────────────────

  async findOptions(attributeId: string): Promise<IAttributeOption[]> {
    return this.svc.listAttributeOptions({ attributeId, isActive: true })
  }

  async createOption(data: ICreateAttributeOptionDTO): Promise<IAttributeOption> {
    return this.svc.createAttributeOptions(data as unknown as Record<string, unknown>)
  }

  async updateOption(
    id: string,
    data: Partial<Omit<ICreateAttributeOptionDTO, 'attributeId'>>
  ): Promise<IAttributeOption> {
    const [updated] = await this.svc.updateAttributeOptions({ id }, data as Record<string, unknown>)
    return updated
  }

  async deleteOption(id: string): Promise<void> {
    return this.svc.deleteAttributeOptions(id)
  }

  // ── Product Attributes ──────────────────────────────────────────────────────

  async findProductAttributes(productId: string): Promise<IProductAttribute[]> {
    return this.svc.listProductAttributes({ productId })
  }

  async findProductAttribute(productId: string, attributeId: string): Promise<IProductAttribute | null> {
    const results = await this.svc.listProductAttributes({ productId, attributeId })
    return results[0] ?? null
  }

  async upsertProductAttribute(item: ISetProductAttributeDTO & { productId: string }): Promise<void> {
    const existing = await this.findProductAttribute(item.productId, item.attributeId)
    if (existing) {
      await this.svc.updateProductAttributes({ id: existing.id }, { value: item.value })
    } else {
      await this.svc.createProductAttributes({
        productId: item.productId,
        attributeId: item.attributeId,
        value: item.value,
      })
    }
  }

  async deleteProductAttributesForProduct(productId: string): Promise<void> {
    const existing = await this.findProductAttributes(productId)
    for (const pa of existing) {
      await this.svc.deleteProductAttributes(pa.id)
    }
  }
}
