export interface ILandingPage {
  id: string
  productId: string
  slug: string
  headline: string
  subHeadline: string
  benefits: unknown[]
  beforeAfterImages: Record<string, unknown>
  urgencyText: string | null
  countdownEndsAt: Date | null
  whatsappNumber: string
  messengerLink: string | null
  isCODAvailable: boolean
  deliveryDhaka: string
  deliveryOutsideDhaka: string
  bkashNumber: string | null
  nagadNumber: string | null
  isActive: boolean
}

export interface ICreateLandingPageDTO {
  productId: string
  slug: string
  headline: string
  subHeadline: string
  benefits: unknown[]
  beforeAfterImages?: Record<string, unknown>
  urgencyText?: string | null
  countdownEndsAt?: Date | null
  whatsappNumber: string
  messengerLink?: string | null
  isCODAvailable?: boolean
  deliveryDhaka?: string
  deliveryOutsideDhaka?: string
  bkashNumber?: string | null
  nagadNumber?: string | null
  isActive?: boolean
}

export interface IUpdateLandingPageDTO {
  productId?: string
  slug?: string
  headline?: string
  subHeadline?: string
  benefits?: unknown[]
  beforeAfterImages?: Record<string, unknown>
  urgencyText?: string | null
  countdownEndsAt?: Date | null
  whatsappNumber?: string
  messengerLink?: string | null
  isCODAvailable?: boolean
  deliveryDhaka?: string
  deliveryOutsideDhaka?: string
  bkashNumber?: string | null
  nagadNumber?: string | null
  isActive?: boolean
}

export interface ILandingPageService {
  findById(id: string): Promise<ILandingPage>
  findBySlug(slug: string): Promise<ILandingPage>
  findAll(filters?: { isActive?: boolean }): Promise<ILandingPage[]>
  create(data: ICreateLandingPageDTO): Promise<ILandingPage>
  update(id: string, data: IUpdateLandingPageDTO): Promise<ILandingPage>
  publish(id: string): Promise<ILandingPage>
  unpublish(id: string): Promise<ILandingPage>
  remove(id: string): Promise<void>
}
