import type { ICategory, ICreateCategoryDTO, IUpdateCategoryDTO } from '../interfaces/category.interface'

/**
 * CategoryRepository
 *
 * All database access for the Category aggregate.
 * Services must NOT access Medusa model methods directly — they call this repository.
 *
 * In Medusa v2 the MedusaService mixin auto-generates list/retrieve/create/update/delete
 * helpers from the model definition. This repository wraps those generated methods so
 * the service depends only on this interface, not on MedusaService internals.
 */
export class CategoryRepository {
  constructor(
    private readonly service: {
      listCategories(filters?: Record<string, unknown>): Promise<ICategory[]>
      retrieveCategory(id: string): Promise<ICategory>
      createCategories(data: Record<string, unknown>): Promise<ICategory>
      updateCategories(id: string, data: Record<string, unknown>): Promise<ICategory>
      deleteCategories(id: string): Promise<void>
    }
  ) {}

  async findById(id: string): Promise<ICategory | null> {
    return this.service.retrieveCategory(id).catch(() => null)
  }

  async findBySlug(slug: string): Promise<ICategory | null> {
    const results = await this.service.listCategories({ slug })
    return results[0] ?? null
  }

  async findAll(filters: Record<string, unknown> = {}): Promise<ICategory[]> {
    return this.service.listCategories(filters)
  }

  async findChildren(parentId: string): Promise<ICategory[]> {
    return this.service.listCategories({ parentId })
  }

  async findAncestors(id: string): Promise<ICategory[]> {
    const trail: ICategory[] = []
    let current = await this.findById(id)

    while (current) {
      trail.unshift(current)
      if (!current.parentId) break
      current = await this.findById(current.parentId)
    }

    return trail
  }

  async create(data: ICreateCategoryDTO & { level: number }): Promise<ICategory> {
    return this.service.createCategories(data as unknown as Record<string, unknown>)
  }

  async update(id: string, data: Partial<IUpdateCategoryDTO & { level?: number }>): Promise<ICategory> {
    return this.service.updateCategories(id, data as Record<string, unknown>)
  }

  async delete(id: string): Promise<void> {
    return this.service.deleteCategories(id)
  }

  async exists(id: string): Promise<boolean> {
    const result = await this.findById(id)
    return result !== null
  }

  async hasChildren(id: string): Promise<boolean> {
    const children = await this.findChildren(id)
    return children.length > 0
  }
}
