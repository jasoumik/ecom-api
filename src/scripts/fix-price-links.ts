/**
 * fix-price-links.ts
 *
 * Fixes variants that have price_set_id stored in metadata but no proper
 * Medusa v2 remote link between the variant and the price set.
 *
 * Run with:
 *   npx medusa exec src/scripts/fix-price-links.ts
 */

import { ExecArgs } from '@medusajs/framework/types'
import { ContainerRegistrationKeys, Modules } from '@medusajs/framework/utils'

export default async function fixPriceLinks({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const remoteLink = container.resolve(ContainerRegistrationKeys.REMOTE_LINK)

  const { data: variants } = await query.graph({
    entity: 'variant',
    fields: ['id', 'title', 'metadata', 'price_set.*'],
  })

  logger.info(`Found ${variants.length} variants`)

  let linked = 0
  let skipped = 0
  let errors = 0

  for (const variant of variants as any[]) {
    // Already has a proper link
    if (variant.price_set) {
      skipped++
      continue
    }

    const priceSetId = variant.metadata?.price_set_id
    if (!priceSetId) {
      logger.warn(`Variant ${variant.id} (${variant.title}) has no price_set_id in metadata — skipping`)
      skipped++
      continue
    }

    try {
      await remoteLink.create({
        [Modules.PRODUCT]: { variant_id: variant.id },
        [Modules.PRICING]: { price_set_id: priceSetId },
      })
      linked++
      logger.info(`Linked variant ${variant.id} → price set ${priceSetId}`)
    } catch (err: any) {
      logger.error(`Failed to link variant ${variant.id}: ${err.message}`)
      errors++
    }
  }

  logger.info(`✓ Done. Linked: ${linked}, Skipped: ${skipped}, Errors: ${errors}`)
}
