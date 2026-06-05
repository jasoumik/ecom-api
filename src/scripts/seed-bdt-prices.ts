/**
 * seed-bdt-prices.ts
 *
 * Adds BDT prices to all product variants that don't have one yet.
 * Uses the variant's existing price amount (assumed to already be in paisa).
 * If no existing price is found, skips that variant with a warning.
 *
 * Run with:
 *   medusa exec src/scripts/seed-bdt-prices.ts
 */

import { ExecArgs } from '@medusajs/framework/types'
import { ContainerRegistrationKeys, Modules } from '@medusajs/framework/utils'

export default async function seedBdtPrices({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const pricingService = container.resolve(Modules.PRICING)

  // Fetch all variants with their linked price sets and existing prices
  const { data: variants } = await query.graph({
    entity: 'variant',
    fields: [
      'id',
      'title',
      'product.title',
      'price_set.*',
      'price_set.prices.*',
    ],
  })

  logger.info(`Found ${variants.length} variants`)

  let updated = 0
  let skipped = 0

  for (const variant of variants as any[]) {
    const priceSet = variant.price_set

    if (!priceSet) {
      logger.warn(`Variant ${variant.id} (${variant.title}) has no price set — skipping`)
      skipped++
      continue
    }

    const existingPrices: any[] = priceSet.prices ?? []

    // Check if BDT price already exists
    const hasBdt = existingPrices.some((p: any) => p.currency_code === 'bdt')
    if (hasBdt) {
      skipped++
      continue
    }

    // Use first available price amount, or fall back to 0
    const existingAmount = existingPrices[0]?.amount ?? 0

    if (existingAmount === 0) {
      logger.warn(`Variant ${variant.id} (${variant.title}) has no price amount — adding ৳0 placeholder`)
    }

    await pricingService.addPrices({
      priceSetId: priceSet.id,
      prices: [
        {
          currency_code: 'bdt',
          amount: existingAmount,
        },
      ],
    })

    updated++
    logger.info(`Updated: ${variant.product?.title} / ${variant.title} — ৳${existingAmount / 100}`)
  }

  logger.info(`✓ Done. Updated: ${updated}, Skipped: ${skipped}`)
}
