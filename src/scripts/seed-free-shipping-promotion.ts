/**
 * seed-free-shipping-promotion.ts
 *
 * Creates a Medusa native automatic promotion:
 *   "Free Shipping on orders ≥ ৳2000"
 *
 * - type: standard
 * - is_automatic: true (no code required)
 * - rule: cart subtotal >= 200000 paisa (৳2000)
 * - action: 100% discount on shipping methods
 *
 * Run with:
 *   medusa exec src/scripts/seed-free-shipping-promotion.ts
 *
 * To change threshold: update in Medusa Admin → Promotions → Free Shipping
 */

import { ExecArgs } from '@medusajs/framework/types'
import { Modules, ContainerRegistrationKeys } from '@medusajs/framework/utils'

export default async function seedFreeShippingPromotion({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const promotionService = container.resolve(Modules.PROMOTION)

  const existing = await promotionService.listPromotions({ code: ['FREE_SHIPPING_BD'] })
  if (existing.length > 0) {
    logger.info('Free shipping promotion already exists. Skipping.')
    return
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
        values: ['200000'], // ৳2000 in paisa
      },
    ],
  })

  logger.info(`✓ Created free shipping promotion: ${promotion.id}`)
  logger.info('  Code: FREE_SHIPPING_BD (automatic — no code needed)')
  logger.info('  Threshold: ৳2000 (200000 paisa)')
  logger.info('  Action: 100% discount on shipping')
  logger.info('')
  logger.info('To change the threshold: Medusa Admin → Promotions → Free Shipping BD → edit rule')
}
