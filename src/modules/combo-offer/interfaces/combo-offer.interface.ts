import { ComboOfferType } from '../models/combo-offer'

export interface IComboOffer {
  id: string
  name: string
  slug: string
  description: string | null
  image: string | null
  type: ComboOfferType
  discountValue: number
  originalPrice: number
  comboPrice: number
  isActive: boolean
  startsAt: Date | null
  endsAt: Date | null
}

export interface IComboItem {
  id: string
  comboOfferId: string
  productId: string
  quantity: number
}

export interface ICreateComboOfferDTO {
  name: string
  slug: string
  description?: string | null
  image?: string | null
  type?: ComboOfferType
  discountValue?: number
  originalPrice: number
  comboPrice: number
  isActive?: boolean
  startsAt?: Date | null
  endsAt?: Date | null
}

export interface IUpdateComboOfferDTO {
  name?: string
  slug?: string
  description?: string | null
  image?: string | null
  type?: ComboOfferType
  discountValue?: number
  originalPrice?: number
  comboPrice?: number
  isActive?: boolean
  startsAt?: Date | null
  endsAt?: Date | null
}

export interface IAddComboItemDTO {
  productId: string
  quantity: number
}

export interface IComboOfferService {
  findById(id: string): Promise<IComboOffer>
  findBySlug(slug: string): Promise<IComboOffer | null>
  getActiveOffers(): Promise<IComboOffer[]>
  create(data: ICreateComboOfferDTO): Promise<IComboOffer>
  update(id: string, data: IUpdateComboOfferDTO): Promise<IComboOffer>
  addItems(comboOfferId: string, items: IAddComboItemDTO[]): Promise<IComboItem[]>
  getItems(comboOfferId: string): Promise<IComboItem[]>
  remove(id: string): Promise<void>
}
