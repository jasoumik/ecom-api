import { MedusaService } from '@medusajs/framework/utils'
import { Attribute, AttributeType } from '../models/attribute'
import { AttributeGroup } from '../models/attribute-group'
import { AttributeOption } from '../models/attribute-option'
import { ProductAttribute } from '../models/product-attribute'
import { AttributeRepository } from '../repository/attribute.repository'
import { NotFoundError } from '../../../shared/errors/app-error'
import { createLogger } from '../../../shared/logger'
import type {
  IAttributeGroup,
  IAttribute,
  IAttributeOption,
  IAttributeWithValue,
  IAttributeSchema,
  ICreateAttributeGroupDTO,
  IUpdateAttributeGroupDTO,
  ICreateAttributeDTO,
  IUpdateAttributeDTO,
  ICreateAttributeOptionDTO,
  ISetProductAttributeDTO,
  IAttributeService,
} from '../interfaces/attribute.interface'

const logger = createLogger('AttributeModule')

class AttributeModuleService
  extends MedusaService({ Attribute, AttributeGroup, AttributeOption, ProductAttribute })
  implements IAttributeService
{
  private readonly repo: AttributeRepository

  constructor(container: Record<string, unknown>) {
    super(container)
    this.repo = new AttributeRepository(this as unknown as ConstructorParameters<typeof AttributeRepository>[0])
  }

  // ── Attribute Groups ────────────────────────────────────────────────────────

  async createGroup(data: ICreateAttributeGroupDTO): Promise<IAttributeGroup> {
    logger.info('createGroup', { name: data.name, categoryId: data.categoryId })
    const group = await this.repo.createGroup(data)
    logger.info('createGroup success', { id: group.id })
    return group
  }

  async updateGroup(id: string, data: IUpdateAttributeGroupDTO): Promise<IAttributeGroup> {
    logger.info('updateGroup', { id })
    const existing = await this.repo.findGroupById(id)
    if (!existing) {
      logger.error('AttributeGroup not found', { id })
      throw new NotFoundError('AttributeGroup', id)
    }
    const updated = await this.repo.updateGroup(id, data)
    logger.info('updateGroup success', { id })
    return updated
  }

  async deleteGroup(id: string): Promise<void> {
    logger.info('deleteGroup', { id })
    const existing = await this.repo.findGroupById(id)
    if (!existing) {
      logger.error('AttributeGroup not found on delete', { id })
      throw new NotFoundError('AttributeGroup', id)
    }
    await this.repo.deleteGroup(id)
    logger.info('deleteGroup success', { id })
  }

  async listGroups(
    filters: Partial<{ categoryId: string; isActive: boolean; isInherited: boolean }> = {}
  ): Promise<IAttributeGroup[]> {
    logger.info('listGroups', { filters })
    const groups = await this.repo.findGroupsByCategory(filters)
    logger.info('listGroups success', { count: groups.length })
    return groups
  }

  // ── Attributes ──────────────────────────────────────────────────────────────

  async createAttribute(data: ICreateAttributeDTO): Promise<IAttribute> {
    logger.info('createAttribute', { name: data.name, groupId: data.groupId })
    const group = await this.repo.findGroupById(data.groupId)
    if (!group) {
      logger.error('AttributeGroup not found on createAttribute', { groupId: data.groupId })
      throw new NotFoundError('AttributeGroup', data.groupId)
    }
    const attribute = await this.repo.createAttribute(data)
    logger.info('createAttribute success', { id: attribute.id })
    return attribute
  }

  async updateAttribute(id: string, data: IUpdateAttributeDTO): Promise<IAttribute> {
    logger.info('updateAttribute', { id })
    const existing = await this.repo.findAttributeById(id)
    if (!existing) {
      logger.error('Attribute not found on update', { id })
      throw new NotFoundError('Attribute', id)
    }
    const updated = await this.repo.updateAttribute(id, data)
    logger.info('updateAttribute success', { id })
    return updated
  }

  async deleteAttribute(id: string): Promise<void> {
    logger.info('deleteAttribute', { id })
    const existing = await this.repo.findAttributeById(id)
    if (!existing) {
      logger.error('Attribute not found on delete', { id })
      throw new NotFoundError('Attribute', id)
    }
    // Warn if products have values for this attribute — do not block deletion
    const productAttrs = await this.repo.findProductAttributes(id)
    if (productAttrs.length > 0) {
      logger.warn('Deleting attribute that has product values', { id, affectedCount: productAttrs.length })
    }
    const options = await this.repo.findOptions(id)
    for (const opt of options) {
      await this.repo.deleteOption(opt.id)
    }
    await this.repo.deleteAttribute(id)
    logger.info('deleteAttribute success', { id })
  }

  async listAttributeDefinitions(
    filters: Partial<{ groupId: string; type: AttributeType; isActive: boolean; isFilterable: boolean; isSearchable: boolean }> = {}
  ): Promise<IAttribute[]> {
    logger.info('listAttributeDefinitions', { filters })
    const attributes = await this.repo.findAttributesByGroup(filters)
    logger.info('listAttributeDefinitions success', { count: attributes.length })
    return attributes
  }

  // ── Options ─────────────────────────────────────────────────────────────────

  async createOption(data: ICreateAttributeOptionDTO): Promise<IAttributeOption> {
    logger.info('createOption', { attributeId: data.attributeId, label: data.label })
    const attribute = await this.repo.findAttributeById(data.attributeId)
    if (!attribute) {
      logger.error('Attribute not found on createOption', { attributeId: data.attributeId })
      throw new NotFoundError('Attribute', data.attributeId)
    }
    const option = await this.repo.createOption(data)
    logger.info('createOption success', { id: option.id })
    return option
  }

  async updateOption(
    id: string,
    data: Partial<Omit<ICreateAttributeOptionDTO, 'attributeId'>>
  ): Promise<IAttributeOption> {
    logger.info('updateOption', { id })
    const updated = await this.repo.updateOption(id, data)
    logger.info('updateOption success', { id })
    return updated
  }

  async deleteOption(id: string): Promise<void> {
    logger.info('deleteOption', { id })
    await this.repo.deleteOption(id)
    logger.info('deleteOption success', { id })
  }

  async listOptions(attributeId: string): Promise<IAttributeOption[]> {
    logger.info('listOptions', { attributeId })
    const options = await this.repo.findOptions(attributeId)
    logger.info('listOptions success', { attributeId, count: options.length })
    return options
  }

  // ── Product Attribute Values ────────────────────────────────────────────────

  async setProductAttributes(
    productId: string,
    attributes: ISetProductAttributeDTO[]
  ): Promise<void> {
    logger.info('setProductAttributes', { productId, count: attributes.length })
    for (const item of attributes) {
      await this.repo.upsertProductAttribute({ ...item, productId })
    }
    logger.info('setProductAttributes success', { productId })
  }

  async getProductAttributes(productId: string): Promise<IAttributeWithValue[]> {
    logger.info('getProductAttributes', { productId })
    const productAttrs = await this.repo.findProductAttributes(productId)

    const result: IAttributeWithValue[] = []
    for (const pa of productAttrs) {
      const attribute = await this.repo.findAttributeById(pa.attributeId)
      if (attribute) {
        result.push({ attribute, value: pa.value })
      }
    }

    logger.info('getProductAttributes success', { productId, count: result.length })
    return result
  }

  async removeProductAttributes(productId: string): Promise<void> {
    logger.info('removeProductAttributes', { productId })
    await this.repo.deleteProductAttributesForProduct(productId)
    logger.info('removeProductAttributes success', { productId })
  }

  // ── Category Attribute Schema ───────────────────────────────────────────────

  async getCategoryAttributeSchema(
    categoryAncestors: string[]
  ): Promise<IAttributeSchema[]> {
    logger.info('getCategoryAttributeSchema', { ancestorCount: categoryAncestors.length })
    const schema: IAttributeSchema[] = []
    const seenGroupIds = new Set<string>()

    for (const categoryId of categoryAncestors) {
      const groups = await this.repo.findGroupsByCategory({ categoryId, isActive: true })

      for (const group of groups) {
        if (seenGroupIds.has(group.id)) {
          logger.debug('getCategoryAttributeSchema: skipping duplicate group', { groupId: group.id })
          continue
        }
        seenGroupIds.add(group.id)

        const attributes = await this.repo.findAttributesByGroup({ groupId: group.id, isActive: true })
        const attributesWithOptions = await Promise.all(
          attributes.map(async (attr) => {
            const options = await this.repo.findOptions(attr.id)
            return { ...attr, options }
          })
        )

        schema.push({ group, attributes: attributesWithOptions })
      }
    }

    logger.info('getCategoryAttributeSchema success', { groupCount: schema.length })
    return schema
  }

  // ── Seeding Helpers (kept for backward compatibility) ───────────────────────

  async seedBeautyAttributes(
    categoryHandleToId: Record<string, string>
  ): Promise<void> {
    const rootId = categoryHandleToId['root'] ?? 'root'
    const skincareId = categoryHandleToId['skincare'] ?? 'skincare'
    const babyCareId = categoryHandleToId['baby-care'] ?? 'baby-care'
    const hairCareId = categoryHandleToId['hair-care'] ?? 'hair-care'
    const bodyCareId = categoryHandleToId['body-care'] ?? 'body-care'

    // Product Origin group (root)
    const originGroup = await this.createGroup({
      name: 'Product Origin',
      description: 'Country and brand information applicable to all products',
      categoryId: rootId,
      isInherited: true,
      order: 0,
    })
    const originCountry = await this.createAttribute({
      name: 'Origin Country',
      handle: 'origin_country',
      groupId: originGroup.id,
      type: AttributeType.SELECT,
      isFilterable: true,
      isSearchable: false,
      order: 0,
    })
    await Promise.all(
      [
        { label: 'Korea', value: 'korea' },
        { label: 'Japan', value: 'japan' },
        { label: 'France', value: 'france' },
        { label: 'UK', value: 'uk' },
        { label: 'USA', value: 'usa' },
        { label: 'Germany', value: 'germany' },
        { label: 'Australia', value: 'australia' },
      ].map((opt, i) =>
        this.createOption({ ...opt, attributeId: originCountry.id, order: i })
      )
    )
    await this.createAttribute({
      name: 'Brand',
      handle: 'brand',
      groupId: originGroup.id,
      type: AttributeType.TEXT,
      isFilterable: true,
      isSearchable: true,
      order: 1,
    })

    // Skin Profile group (skincare)
    const skinProfileGroup = await this.createGroup({
      name: 'Skin Profile',
      description: 'Skin type and concern targeting',
      categoryId: skincareId,
      isInherited: true,
      order: 0,
    })
    const skinType = await this.createAttribute({
      name: 'Skin Type',
      handle: 'skin_type',
      groupId: skinProfileGroup.id,
      type: AttributeType.MULTISELECT,
      isFilterable: true,
      isSearchable: true,
      order: 0,
    })
    await Promise.all(
      ['Oily', 'Dry', 'Combination', 'Sensitive', 'Normal', 'All'].map((label, i) =>
        this.createOption({ label, value: label.toLowerCase(), attributeId: skinType.id, order: i })
      )
    )
    const skinConcerns = await this.createAttribute({
      name: 'Skin Concerns',
      handle: 'skin_concerns',
      groupId: skinProfileGroup.id,
      type: AttributeType.MULTISELECT,
      isFilterable: true,
      isSearchable: true,
      order: 1,
    })
    await Promise.all(
      [
        { label: 'Acne', value: 'acne' },
        { label: 'Brightening', value: 'brightening' },
        { label: 'Anti-aging', value: 'anti_aging' },
        { label: 'Hydration', value: 'hydration' },
        { label: 'Pores', value: 'pores' },
        { label: 'Redness', value: 'redness' },
        { label: 'Dark Spots', value: 'dark_spots' },
      ].map((opt, i) =>
        this.createOption({ ...opt, attributeId: skinConcerns.id, order: i })
      )
    )
    await this.createAttribute({
      name: 'Key Ingredients',
      handle: 'key_ingredients',
      groupId: skinProfileGroup.id,
      type: AttributeType.TEXT,
      isFilterable: false,
      isSearchable: true,
      order: 2,
    })
    const freeFromSkin = await this.createAttribute({
      name: 'Free From',
      handle: 'free_from',
      groupId: skinProfileGroup.id,
      type: AttributeType.MULTISELECT,
      isFilterable: true,
      isSearchable: false,
      order: 3,
    })
    await Promise.all(
      ['Parabens', 'Sulfates', 'Alcohol', 'Fragrance', 'Silicone'].map((label, i) =>
        this.createOption({ label, value: label.toLowerCase(), attributeId: freeFromSkin.id, order: i })
      )
    )

    // Product Details group (skincare)
    const productDetailsGroup = await this.createGroup({
      name: 'Product Details',
      description: 'Physical and regulatory product details',
      categoryId: skincareId,
      isInherited: true,
      order: 1,
    })
    await this.createAttribute({ name: 'Volume / Size', handle: 'volume_size', groupId: productDetailsGroup.id, type: AttributeType.TEXT, unit: 'ml', isFilterable: false, isSearchable: false, order: 0 })
    await this.createAttribute({ name: 'SPF', handle: 'spf', groupId: productDetailsGroup.id, type: AttributeType.NUMBER, isFilterable: true, isSearchable: false, order: 1 })
    await this.createAttribute({ name: 'Is Vegan', handle: 'is_vegan', groupId: productDetailsGroup.id, type: AttributeType.BOOLEAN, isFilterable: true, isSearchable: false, order: 2 })
    await this.createAttribute({ name: 'Is Cruelty Free', handle: 'is_cruelty_free', groupId: productDetailsGroup.id, type: AttributeType.BOOLEAN, isFilterable: true, isSearchable: false, order: 3 })
    await this.createAttribute({ name: 'Is Organic', handle: 'is_organic', groupId: productDetailsGroup.id, type: AttributeType.BOOLEAN, isFilterable: true, isSearchable: false, order: 4 })

    // Baby Safety group
    const babySafetyGroup = await this.createGroup({ name: 'Baby Safety', description: 'Safety certifications and age suitability for baby products', categoryId: babyCareId, isInherited: true, order: 0 })
    const ageRange = await this.createAttribute({ name: 'Age Range', handle: 'age_range', groupId: babySafetyGroup.id, type: AttributeType.SELECT, isFilterable: true, isSearchable: false, order: 0 })
    await Promise.all(
      [
        { label: '0–3 months', value: '0_3_months' },
        { label: '3–12 months', value: '3_12_months' },
        { label: '1–3 years', value: '1_3_years' },
        { label: '3+ years', value: '3_plus_years' },
        { label: 'All ages', value: 'all_ages' },
      ].map((opt, i) => this.createOption({ ...opt, attributeId: ageRange.id, order: i }))
    )
    await this.createAttribute({ name: 'Is Hypoallergenic', handle: 'is_hypoallergenic', groupId: babySafetyGroup.id, type: AttributeType.BOOLEAN, isFilterable: true, isSearchable: false, order: 1 })
    await this.createAttribute({ name: 'Is Baby Safe', handle: 'is_baby_safe', groupId: babySafetyGroup.id, type: AttributeType.BOOLEAN, isFilterable: true, isSearchable: false, order: 2 })
    await this.createAttribute({ name: 'Is Pediatrician Tested', handle: 'is_pediatrician_tested', groupId: babySafetyGroup.id, type: AttributeType.BOOLEAN, isFilterable: true, isSearchable: false, order: 3 })
    const freeFromBaby = await this.createAttribute({ name: 'Free From', handle: 'free_from', groupId: babySafetyGroup.id, type: AttributeType.MULTISELECT, isFilterable: true, isSearchable: false, order: 4 })
    await Promise.all(
      ['Parabens', 'Sulfates', 'Alcohol', 'Fragrance', 'Mineral Oil'].map((label, i) =>
        this.createOption({ label, value: label.toLowerCase().replace(' ', '_'), attributeId: freeFromBaby.id, order: i })
      )
    )
    const certifications = await this.createAttribute({ name: 'Certifications', handle: 'certifications', groupId: babySafetyGroup.id, type: AttributeType.MULTISELECT, isFilterable: true, isSearchable: false, order: 5 })
    await Promise.all(
      [
        { label: 'EWG Verified', value: 'ewg_verified' },
        { label: 'COSMOS', value: 'cosmos' },
        { label: 'Ecocert', value: 'ecocert' },
        { label: 'NATRUE', value: 'natrue' },
        { label: 'USDA Organic', value: 'usda_organic' },
      ].map((opt, i) => this.createOption({ ...opt, attributeId: certifications.id, order: i }))
    )

    // Hair Profile group
    const hairProfileGroup = await this.createGroup({ name: 'Hair Profile', description: 'Hair type and concern targeting', categoryId: hairCareId, isInherited: true, order: 0 })
    const hairType = await this.createAttribute({ name: 'Hair Type', handle: 'hair_type', groupId: hairProfileGroup.id, type: AttributeType.MULTISELECT, isFilterable: true, isSearchable: true, order: 0 })
    await Promise.all(
      ['Oily', 'Dry', 'Normal', 'Damaged', 'Color-treated', 'Curly'].map((label, i) =>
        this.createOption({ label, value: label.toLowerCase().replace('-', '_'), attributeId: hairType.id, order: i })
      )
    )
    const hairConcerns = await this.createAttribute({ name: 'Hair Concerns', handle: 'hair_concerns', groupId: hairProfileGroup.id, type: AttributeType.MULTISELECT, isFilterable: true, isSearchable: true, order: 1 })
    await Promise.all(
      [
        { label: 'Hair Loss', value: 'hair_loss' },
        { label: 'Dandruff', value: 'dandruff' },
        { label: 'Frizz', value: 'frizz' },
        { label: 'Shine', value: 'shine' },
        { label: 'Volume', value: 'volume' },
        { label: 'Moisture', value: 'moisture' },
      ].map((opt, i) => this.createOption({ ...opt, attributeId: hairConcerns.id, order: i }))
    )

    // Body Details group
    const bodyDetailsGroup = await this.createGroup({ name: 'Body Details', description: 'Scent and texture details for body care products', categoryId: bodyCareId, isInherited: true, order: 0 })
    await this.createAttribute({ name: 'Scent', handle: 'scent', groupId: bodyDetailsGroup.id, type: AttributeType.TEXT, isFilterable: false, isSearchable: true, order: 0 })
    const texture = await this.createAttribute({ name: 'Texture', handle: 'texture', groupId: bodyDetailsGroup.id, type: AttributeType.SELECT, isFilterable: true, isSearchable: false, order: 1 })
    await Promise.all(
      ['Lotion', 'Cream', 'Gel', 'Oil', 'Butter', 'Foam'].map((label, i) =>
        this.createOption({ label, value: label.toLowerCase(), attributeId: texture.id, order: i })
      )
    )
  }
}

export default AttributeModuleService
