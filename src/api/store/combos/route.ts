import type { MedusaRequest, MedusaResponse } from '@medusajs/framework'
import { COMBO_OFFER_MODULE } from '../../../modules/combo-offer'
import { Modules } from '@medusajs/framework/utils'
import type ComboOfferModuleService from '../../../modules/combo-offer/service/combo-offer-module-service'
import { errorHandler } from '../../../shared/errors/error-handler'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function enrichItems(items: any[], scope: MedusaRequest['scope']): Promise<any[]> {
  if (!items.length) return items
  const productIds = [...new Set(items.map((i: { productId: string }) => i.productId))]
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const productService = scope.resolve(Modules.PRODUCT) as any
    const products = await productService.listProducts(
      { id: productIds },
      { select: ['id', 'title', 'thumbnail', 'handle'], take: productIds.length }
    )
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const map: Record<string, any> = Object.fromEntries(products.map((p: any) => [p.id, p]))
    return items.map((item: { productId: string }) => ({
      ...item,
      productTitle: map[item.productId]?.title ?? null,
      productThumb: map[item.productId]?.thumbnail ?? null,
      productHandle: map[item.productId]?.handle ?? null,
    }))
  } catch {
    return items
  }
}

export async function GET(req: MedusaRequest, res: MedusaResponse): Promise<void> {
  try {
    const comboService = req.scope.resolve<ComboOfferModuleService>(COMBO_OFFER_MODULE)
    const combos = await comboService.listCombos({ isActive: true })
    const withItems = await Promise.all(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      combos.map(async (combo: any) => {
        const rawItems = await comboService.getItems(combo.id)
        const items = await enrichItems(rawItems, req.scope)
        return { ...combo, items }
      })
    )
    res.status(200).json({ data: withItems })
  } catch (error) {
    errorHandler(error, req, res)
  }
}
