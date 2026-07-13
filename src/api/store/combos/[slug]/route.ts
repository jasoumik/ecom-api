import type { MedusaRequest, MedusaResponse } from '@medusajs/framework'
import { COMBO_OFFER_MODULE } from '../../../../modules/combo-offer'
import { Modules } from '@medusajs/framework/utils'
import type ComboOfferModuleService from '../../../../modules/combo-offer/service/combo-offer-module-service'
import { errorHandler } from '../../../../shared/errors/error-handler'
import { createLogger } from '../../../../shared/logger'

const logger = createLogger('store/combos/[slug]')

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function enrichItems(items: any[], scope: MedusaRequest['scope']): Promise<any[]> {
  if (!items.length) return items
  const productIds = [...new Set(items.map((i: { productId: string }) => i.productId))]
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const productService = scope.resolve(Modules.PRODUCT) as any
    const products = await productService.listProducts(
      { id: productIds },
      { relations: ['variants'], take: productIds.length }
    )
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const map: Record<string, any> = Object.fromEntries(products.map((p: any) => [p.id, p]))
    return items.map((item: { productId: string }) => {
      const p = map[item.productId]
      if (!p) logger.warn('enrichItems: product not found', { productId: item.productId })
      return {
        ...item,
        productTitle: p?.title ?? null,
        productThumb: p?.thumbnail ?? null,
        productHandle: p?.handle ?? null,
        productVariants: p?.variants ?? [],
      }
    })
  } catch (err) {
    logger.error('enrichItems failed', { error: String(err), productIds })
    return items
  }
}

export async function GET(req: MedusaRequest, res: MedusaResponse): Promise<void> {
  try {
    const { slug } = req.params
    const comboService = req.scope.resolve<ComboOfferModuleService>(COMBO_OFFER_MODULE)
    const combos = await comboService.listCombos({ isActive: true })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const combo = combos.find((c: any) => c.slug === slug)
    if (!combo) {
      res.status(404).json({ message: 'Combo not found' })
      return
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rawItems = await comboService.getItems((combo as any).id)
    const items = await enrichItems(rawItems, req.scope)
    res.status(200).json({ data: { ...combo, items } })
  } catch (error) {
    errorHandler(error, req, res)
  }
}
