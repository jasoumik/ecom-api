export interface IBaseService<T, CreateDTO, UpdateDTO> {
  findById(id: string): Promise<T>
  findAll(filters?: unknown): Promise<T[]>
  create(data: CreateDTO): Promise<T>
  update(id: string, data: UpdateDTO): Promise<T>
  remove(id: string): Promise<void>
}
