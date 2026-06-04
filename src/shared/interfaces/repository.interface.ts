export interface IRepository<T, CreateDTO, UpdateDTO> {
  findById(id: string): Promise<T | null>
  findAll(filters?: Record<string, unknown>): Promise<T[]>
  create(data: CreateDTO): Promise<T>
  update(id: string, data: UpdateDTO): Promise<T>
  delete(id: string): Promise<void>
  exists(id: string): Promise<boolean>
}
