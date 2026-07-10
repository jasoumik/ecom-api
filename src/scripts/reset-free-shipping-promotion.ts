/**
 * reset-free-shipping-promotion.ts
 *
 * Deletes the existing FREE_SHIPPING_BD promotion and recreates it with the
 * correct threshold: subtotal >= 2000 (taka — BDT is stored as whole taka in this instance)
 *
 * Run with:
 *   medusa exec src/scripts/reset-free-shipping-promotion.ts
 */

import { ExecArgs } from '@medusajs/framework/types'
import { Modules, ContainerRegistrationKeys } from '@medusajs/framework/utils'

export default async function resetFreeShippingPromotion({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const promotionService = container.resolve(Modules.PROMOTION)

  const existing = await promotionService.listPromotions({ code: ['FREE_SHIPPING_BD'] })
  if (existing.length > 0) {
    await promotionService.deletePromotions(existing.map((p: any) => p.id))
    logger.info(`Deleted existing promotion: ${existing[0].id}`)
  } else {
    logger.info('No existing promotion found — creating fresh.')
  }

  const promotion = await promotionService.createPromotions({
    code: 'FREE_SHIPPING_BD',
    type: 'standard',
    status: 'active',
    is_automatic: true,
    application_method: {
      type: 'percentage',
      target_type: 'shipping_methods',
      allocation: 'each',
      value: 100,
      apply_to_quantity: 1,
      max_quantity: 1,
    },
    rules: [
      {
        attribute: 'subtotal',
        operator: 'gte',
        values: ['2000'], // ৳2000 — BDT stored as whole taka in this Medusa instance
      },
    ],
  })

  logger.info(`✓ Created free shipping promotion: ${promotion.id}`)
  logger.info('  Code: FREE_SHIPPING_BD (automatic — no code needed)')
  logger.info('  Threshold: subtotal >= 2000 (৳2000)')
  logger.info('  Action: 100% discount on shipping')
}
