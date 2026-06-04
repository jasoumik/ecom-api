export interface ICategory {
  id: string
  name: string
  slug: string
  description: string | null
  image: string | null
  level: number
  order: number
  isActive: boolean
  parentId: string | null
  createdAt: Date
  updatedAt: Date
}

export interface ICreateCategoryDTO {
  name: string
  slug: string
  description?: string
  image?: string
  order?: number
  parentId?: string
  isActive?: boolean
}

export interface IUpdateCategoryDTO {
  name?: string
  slug?: string
  description?: string
  image?: string
  order?: number
  isActive?: boolean
  parentId?: string | null
}

export interface ICategoryTree extends ICategory {
  children: ICategoryTree[]
}

export interface IBreadcrumb {
  id: string
  name: string
  slug: string
}

export interface ICategoryService {
  findById(id: string): Promise<ICategory>
  findBySlug(slug: string): Promise<ICategory>
  findAll(filters?: { isActive?: boolean; parentId?: string }): Promise<ICategory[]>
  getTree(parentId?: string | null): Promise<ICategoryTree[]>
  getBreadcrumb(id: string): Promise<IBreadcrumb[]>
  create(data: ICreateCategoryDTO): Promise<ICategory>
  update(id: string, data: IUpdateCategoryDTO): Promise<ICategory>
  remove(id: string): Promise<void>
}
