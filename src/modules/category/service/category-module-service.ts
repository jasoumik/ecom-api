import { MedusaService } from '@medusajs/framework/utils'
import { Category } from '../models/category'
import { CategoryRepository } from '../repository/category.repository'
import { NotFoundError, ConflictError } from '../../../shared/errors/app-error'
import { createLogger } from '../../../shared/logger'
import type {
  ICategory,
  ICreateCategoryDTO,
  IUpdateCategoryDTO,
  ICategoryTree,
  IBreadcrumb,
  ICategoryService,
} from '../interfaces/category.interface'

const logger = createLogger('CategoryModule')

class CategoryModuleService
  extends MedusaService({ Category })
  implements ICategoryService
{
  private readonly repo: CategoryRepository

  constructor(container: Record<string, unknown>) {
    super(container)
    this.repo = new CategoryRepository(this as unknown as ConstructorParameters<typeof CategoryRepository>[0])
  }

  // ── findById ────────────────────────────────────────────────────────────────

  async findById(id: string): Promise<ICategory> {
    logger.info('findById', { id })
    const category = await this.repo.findById(id)
    if (!category) {
      logger.error('Category not found', { id })
      throw new NotFoundError('Category', id)
    }
    logger.info('findById success', { id })
    return category
  }

  // ── findBySlug ──────────────────────────────────────────────────────────────

  async findBySlug(slug: string): Promise<ICategory> {
    logger.info('findBySlug', { slug })
    const category = await this.repo.findBySlug(slug)
    if (!category) {
      logger.error('Category not found by slug', { slug })
      throw new NotFoundError('Category', slug)
    }
    logger.info('findBySlug success', { slug })
    return category
  }

  // ── findAll ─────────────────────────────────────────────────────────────────

  async findAll(
    filters: { isActive?: boolean; parentId?: string } = {}
  ): Promise<ICategory[]> {
    logger.info('findAll', { filters })
    const results = await this.repo.findAll(filters as Record<string, unknown>)
    logger.info('findAll success', { count: results.length })
    return results
  }

  // ── getTree ─────────────────────────────────────────────────────────────────

  async getTree(parentId?: string | null): Promise<ICategoryTree[]> {
    logger.info('getTree', { parentId })
    const all = await this.repo.findAll({ isActive: true })
    const tree = this.buildTree(all as unknown as ICategoryTree[], parentId ?? null)
    logger.info('getTree success', { rootCount: tree.length })
    return tree
  }

  // ── getBreadcrumb ───────────────────────────────────────────────────────────

  async getBreadcrumb(id: string): Promise<IBreadcrumb[]> {
    logger.info('getBreadcrumb', { id })
    const ancestors = await this.repo.findAncestors(id)
    const breadcrumb = ancestors.map((c) => ({ id: c.id, name: c.name, slug: c.slug }))
    logger.info('getBreadcrumb success', { id, depth: breadcrumb.length })
    return breadcrumb
  }

  // ── create ──────────────────────────────────────────────────────────────────

  async create(data: ICreateCategoryDTO): Promise<ICategory> {
    logger.info('create', { slug: data.slug })

    const existing = await this.repo.findBySlug(data.slug)
    if (existing) {
      logger.error('Slug conflict on create', { slug: data.slug })
      throw new ConflictError(`Category with slug '${data.slug}' already exists`)
    }

    let level = 0
    if (data.parentId) {
      const parent = await this.repo.findById(data.parentId)
      if (!parent) {
        logger.error('Parent category not found', { parentId: data.parentId })
        throw new NotFoundError('Category', data.parentId)
      }
      level = (parent.level ?? 0) + 1
    }

    const created = await this.repo.create({ ...data, level })
    logger.info('create success', { id: created.id, slug: created.slug })
    return created
  }

  // ── update ──────────────────────────────────────────────────────────────────

  async update(id: string, data: IUpdateCategoryDTO): Promise<ICategory> {
    logger.info('update', { id })

    const existing = await this.repo.findById(id)
    if (!existing) {
      logger.error('Category not found on update', { id })
      throw new NotFoundError('Category', id)
    }

    if (data.slug && data.slug !== existing.slug) {
      const slugConflict = await this.repo.findBySlug(data.slug)
      if (slugConflict && slugConflict.id !== id) {
        logger.error('Slug conflict on update', { slug: data.slug })
        throw new ConflictError(`Category with slug '${data.slug}' already exists`)
      }
    }

    let level: number | undefined
    if (data.parentId !== undefined) {
      if (data.parentId) {
        const parent = await this.repo.findById(data.parentId)
        level = parent ? (parent.level ?? 0) + 1 : 0
      } else {
        level = 0
      }
    }

    const updated = await this.repo.update(id, { ...data, ...(level !== undefined ? { level } : {}) })
    logger.info('update success', { id })
    return updated
  }

  // ── remove ──────────────────────────────────────────────────────────────────

  async remove(id: string): Promise<void> {
    logger.info('remove', { id })

    const existing = await this.repo.findById(id)
    if (!existing) {
      logger.error('Category not found on remove', { id })
      throw new NotFoundError('Category', id)
    }

    const hasChildren = await this.repo.hasChildren(id)
    if (hasChildren) {
      logger.error('Cannot delete category with children', { id })
      throw new ConflictError(
        `Category '${id}' has child categories. Remove or reassign children before deleting.`
      )
    }

    await this.repo.delete(id)
    logger.info('remove success', { id })
  }

  // ── Legacy compatibility aliases (used by API routes) ───────────────────────

  /** @deprecated Use getTree() */
  async getBySlug(slug: string): Promise<ICategory | null> {
    return this.repo.findBySlug(slug)
  }

  /** @deprecated Use getTree() */
  async list(filters: { isActive?: boolean } = {}): Promise<ICategory[]> {
    return this.findAll(filters)
  }

  /** @deprecated Use getTree() */
  async delete(id: string): Promise<void> {
    return this.remove(id)
  }

  // ── Private helpers ──────────────────────────────────────────────────────────

  private buildTree(
    nodes: ICategoryTree[],
    parentId: string | null
  ): ICategoryTree[] {
    return nodes
      .filter((n) => n.parentId === parentId)
      .sort((a, b) => a.order - b.order)
      .map((node) => ({
        ...node,
        children: this.buildTree(nodes, node.id),
      }))
  }
}

export default CategoryModuleService
