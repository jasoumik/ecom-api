/**
 * seed-medusa-core.ts
 *
 * Seeds all Medusa native infrastructure required for the Bangladeshi store:
 *   - Sales Channel: Default Storefront
 *   - Region: Bangladesh (BD), currency BDT
 *   - Stock Location: Default Warehouse
 *   - Fulfillment Set + Provider link + Service Zone
 *   - Shipping Options: Inside Dhaka (৳70) / Outside Dhaka (৳130)
 *   - Shipping profiles attached to options
 *   - Sales channel → stock location link
 *   - Publishable API key → sales channel link
 *
 * Run with:
 *   npx medusa exec src/scripts/seed-medusa-core.ts
 */

import { ExecArgs } from '@medusajs/framework/types'
import { Modules, ContainerRegistrationKeys } from '@medusajs/framework/utils'

export default async function seedMedusaCore({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const remoteLink = container.resolve(ContainerRegistrationKeys.REMOTE_LINK)

  const regionService = container.resolve(Modules.REGION)
  const salesChannelService = container.resolve(Modules.SALES_CHANNEL)
  const fulfillmentService = container.resolve(Modules.FULFILLMENT)
  const stockLocationService = container.resolve(Modules.STOCK_LOCATION)
  const pricingService = container.resolve(Modules.PRICING)
  const apiKeyService = container.resolve(Modules.API_KEY)

  // ─── 1. Sales Channel ────────────────────────────────────────────────────────
  logger.info('Seeding sales channel...')
  const existingChannels = await salesChannelService.listSalesChannels({ name: 'Default Storefront' })
  let salesChannel = existingChannels[0]

  if (!salesChannel) {
    salesChannel = await salesChannelService.createSalesChannels({
      name: 'Default Storefront',
      description: 'Main online storefront',
    })
    logger.info(`Created sales channel: ${salesChannel.id}`)
  } else {
    logger.info(`Sales channel already exists: ${salesChannel.id}`)
  }

  // ─── 2. Region ───────────────────────────────────────────────────────────────
  logger.info('Seeding Bangladesh region...')
  const existingRegions = await regionService.listRegions({ name: 'Bangladesh' })
  let region = existingRegions[0]

  if (!region) {
    region = await regionService.createRegions({
      name: 'Bangladesh',
      currency_code: 'bdt',
      countries: ['bd'],
    })
    logger.info(`Created region: ${region.id}`)
  } else {
    logger.info(`Region already exists: ${region.id}`)
  }

  // ─── 3. Stock Location ───────────────────────────────────────────────────────
  logger.info('Seeding stock location...')
  const existingLocations = await stockLocationService.listStockLocations({ name: 'Default Warehouse' })
  let stockLocation = existingLocations[0]

  if (!stockLocation) {
    stockLocation = await stockLocationService.createStockLocations({
      name: 'Default Warehouse',
      address: { address_1: 'Dhaka', city: 'Dhaka', country_code: 'BD' },
    })
    logger.info(`Created stock location: ${stockLocation.id}`)
  } else {
    logger.info(`Stock location already exists: ${stockLocation.id}`)
  }

  // ─── 4. Fulfillment Set ──────────────────────────────────────────────────────
  logger.info('Seeding fulfillment set...')
  const existingSets = await fulfillmentService.listFulfillmentSets({ name: 'Bangladesh Delivery' })
  let fulfillmentSet = existingSets[0]

  if (!fulfillmentSet) {
    fulfillmentSet = await fulfillmentService.createFulfillmentSets({
      name: 'Bangladesh Delivery',
      type: 'shipping',
    })
    logger.info(`Created fulfillment set: ${fulfillmentSet.id}`)
  } else {
    logger.info(`Fulfillment set already exists: ${fulfillmentSet.id}`)
  }

  // Link stock location → fulfillment set
  try {
    await remoteLink.create({
      [Modules.STOCK_LOCATION]: { stock_location_id: stockLocation.id },
      [Modules.FULFILLMENT]: { fulfillment_set_id: fulfillmentSet.id },
    })
  } catch (e: any) {
    if (!e.message?.includes('already exists') && !e.message?.includes('duplicate')) throw e
  }

  // ─── 5. Fulfillment Provider → Stock Location ────────────────────────────────
  logger.info('Linking fulfillment provider to stock location...')
  const providers = await fulfillmentService.listFulfillmentProviders({})
  const manualProvider = providers.find((p: any) => p.id === 'manual') ?? providers[0]

  if (!manualProvider) {
    logger.error('No fulfillment provider found. Ensure the manual provider is registered.')
    return
  }
  logger.info(`Using fulfillment provider: ${manualProvider.id}`)

  try {
    await remoteLink.create({
      [Modules.STOCK_LOCATION]: { stock_location_id: stockLocation.id },
      [Modules.FULFILLMENT]: { fulfillment_provider_id: manualProvider.id },
    })
    logger.info('Fulfillment provider linked to stock location.')
  } catch (e: any) {
    if (!e.message?.includes('already exists') && !e.message?.includes('duplicate')) throw e
    logger.info('Provider link already exists — skipping.')
  }

  // ─── 6. Service Zone ─────────────────────────────────────────────────────────
  logger.info('Seeding service zone...')
  const fulfillmentSetWithZones = await fulfillmentService.retrieveFulfillmentSet(fulfillmentSet.id, {
    relations: ['service_zones'],
  })
  let serviceZone = fulfillmentSetWithZones.service_zones?.find((z: any) => z.name === 'Bangladesh')

  if (!serviceZone) {
    serviceZone = await fulfillmentService.createServiceZones({
      name: 'Bangladesh',
      fulfillment_set_id: fulfillmentSet.id,
      geo_zones: [{ type: 'country', country_code: 'bd' }],
    })
    logger.info(`Created service zone: ${serviceZone.id}`)
  } else {
    logger.info(`Service zone already exists: ${serviceZone.id}`)
  }

  // ─── 7. Default Shipping Profile ─────────────────────────────────────────────
  logger.info('Resolving default shipping profile...')
  const profiles = await fulfillmentService.listShippingProfiles({})
  const defaultProfile = profiles[0]

  if (!defaultProfile) {
    logger.error('No shipping profiles found. Start the Medusa server once to auto-create the default profile.')
    return
  }
  logger.info(`Using shipping profile: ${defaultProfile.id} (${defaultProfile.name})`)

  // ─── 8. Shipping Options + Prices ────────────────────────────────────────────
  logger.info('Seeding shipping options...')
  const existingOptions = await fulfillmentService.listShippingOptions({
    service_zone: { id: serviceZone.id },
  })

  const shippingOptionDefs = [
    {
      name: 'Inside Dhaka',
      code: 'INSIDE_DHAKA',
      label: 'Standard Delivery',
      description: 'Delivery within Dhaka city',
      amount: 70,
    },
    {
      name: 'Outside Dhaka',
      code: 'OUTSIDE_DHAKA',
      label: 'Outside Dhaka Delivery',
      description: 'Delivery outside Dhaka city',
      amount: 130,
    },
  ]

  for (const def of shippingOptionDefs) {
    const existing = existingOptions.find((o: any) => o.name === def.name)

    if (existing) {
      // Ensure shipping profile is set (fix for options created with null profile)
      if (!existing.shipping_profile_id) {
        await fulfillmentService.updateShippingOptions(existing.id, {
          shipping_profile_id: defaultProfile.id,
        })
        logger.info(`Fixed shipping profile on "${def.name}"`)
      } else {
        logger.info(`Shipping option "${def.name}" already exists`)
      }
      continue
    }

    const shippingOption = await fulfillmentService.createShippingOptions({
      name: def.name,
      service_zone_id: serviceZone.id,
      shipping_profile_id: defaultProfile.id,
      provider_id: manualProvider.id,
      price_type: 'flat',
      type: {
        label: def.label,
        description: def.description,
        code: def.code,
      },
      rules: [],
    })

    const priceSet = await pricingService.createPriceSets({
      prices: [{ currency_code: 'bdt', amount: def.amount }],
    })

    try {
      await remoteLink.create({
        [Modules.FULFILLMENT]: { shipping_option_id: shippingOption.id },
        [Modules.PRICING]: { price_set_id: priceSet.id },
      })
    } catch (e: any) {
      if (!e.message?.includes('already exists') && !e.message?.includes('duplicate')) throw e
    }

    logger.info(`Created shipping option: ${def.name} (৳${def.amount})`)
  }

  // ─── 9. Sales Channel → Stock Location ───────────────────────────────────────
  logger.info('Linking sales channel → stock location...')
  try {
    await remoteLink.create({
      [Modules.SALES_CHANNEL]: { sales_channel_id: salesChannel.id },
      [Modules.STOCK_LOCATION]: { stock_location_id: stockLocation.id },
    })
  } catch (e: any) {
    if (!e.message?.includes('already exists') && !e.message?.includes('duplicate')) throw e
    logger.info('Sales channel → stock location link already exists.')
  }

  // ─── 10. Publishable API Key → Sales Channel ─────────────────────────────────
  logger.info('Linking publishable API key → sales channel...')
  const keys = await apiKeyService.listApiKeys({ type: 'publishable' })

  if (!keys.length) {
    logger.warn('No publishable API keys found. Create one in Admin → Settings → API Keys, then re-run this script.')
  } else {
    for (const key of keys as any[]) {
      try {
        await remoteLink.create({
          [Modules.API_KEY]: { publishable_key_id: key.id },
          [Modules.SALES_CHANNEL]: { sales_channel_id: salesChannel.id },
        })
        logger.info(`Linked API key ${key.redacted_token ?? key.id} → sales channel`)
      } catch (e: any) {
        if (!e.message?.includes('already exists') && !e.message?.includes('duplicate')) throw e
        logger.info(`API key ${key.redacted_token ?? key.id} already linked — skipping.`)
      }
    }
  }

  // ─── Done ─────────────────────────────────────────────────────────────────────
  logger.info('')
  logger.info('✓ Medusa core seeding complete.')
  logger.info(`  Sales Channel : ${salesChannel.id}`)
  logger.info(`  Region        : ${region.id}  (Bangladesh / BDT)`)
  logger.info(`  Stock Location: ${stockLocation.id}`)
  logger.info(`  Fulfillment   : ${fulfillmentSet.id}`)
  logger.info(`  Service Zone  : ${serviceZone.id}`)
  logger.info(`  Provider      : ${manualProvider.id}`)
}
