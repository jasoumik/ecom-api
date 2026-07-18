/**
 * Migration: move combo membership off `collection_id` onto `metadata.product_ids`.
 *
 * Background: brands and combos are both Medusa product collections, but a product
 * has only one `collection_id`. Adding a product to a combo collection stole it from
 * its brand collection, so it disappeared from brand filters.
 *
 * This script, for every combo collection (metadata.is_combo):
 *   1. Records its current member product ids into metadata.product_ids.
 *   2. Re-assigns each of those products back to its brand collection, resolved from
 *      the product's own metadata.brand (set by seed-products.ts).
 *
 * Idempotent: existing metadata.product_ids are preserved/merged, and products already
 * sitting in their brand collection are left untouched.
 *
 * Run with:
 *   npx medusa exec src/scripts/migrate-combo-members.ts
 */
import { ExecArgs } from '@medusajs/framework/types'
import { Modules } from '@medusajs/framework/utils'
import { IProductModuleService } from '@medusajs/framework/types'

function isCombo(metadata: Record<string, unknown> | null | undefined): boolean {
  return metadata?.is_combo === 'true' || metadata?.is_combo === true
}

function parseIds(metadata: Record<string, unknown> | null | undefined): string[] {
  const raw = metadata?.product_ids
  if (typeof raw !== 'string') return []
  return raw.split(',').map((id) => id.trim()).filter(Boolean)
}

export default async function migrateComboMembers({ container }: ExecArgs) {
  const productService: IProductModuleService = container.resolve(Modules.PRODUCT)

  console.log('Migrating combo membership → metadata.product_ids…\n')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const collections: any[] = await productService.listProductCollections(
    {},
    { relations: ['products'], take: 500 },
  )

  // Brand handle → collection id (every non-combo collection is a brand).
  const brandByHandle = new Map<string, string>()
  for (const c of collections) {
    if (!isCombo(c.metadata)) brandByHandle.set(c.handle, c.id)
  }

  const combos = collections.filter((c) => isCombo(c.metadata))
  console.log(`Found ${combos.length} combo collection(s).\n`)

  let reassigned = 0
  let missingBrand = 0

  for (const combo of combos) {
    const members: Array<{ id: string }> = combo.products ?? []
    const memberIds = members.map((p) => p.id)
    const existingIds = parseIds(combo.metadata)
    const mergedIds = [...new Set([...existingIds, ...memberIds])]

    console.log(`Combo "${combo.title}" (${combo.handle}) — ${mergedIds.length} member(s)`)

    // 1. Record membership in metadata.
    await productService.updateProductCollections(combo.id, {
      metadata: { ...(combo.metadata ?? {}), product_ids: mergedIds.join(',') },
    })

    if (memberIds.length === 0) {
      console.log('  (no products currently attached via collection_id)\n')
      continue
    }

    // 2. Re-assign each member back to its brand collection (metadata.brand).
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fullMembers: any[] = await productService.listProducts({ id: memberIds }, {})
    for (const product of fullMembers) {
      const brandHandle = product.metadata?.brand
      const brandId = typeof brandHandle === 'string' ? brandByHandle.get(brandHandle) : undefined

      if (!brandId) {
        console.warn(
          `  ! ${product.title}: no resolvable brand (metadata.brand=${JSON.stringify(brandHandle)}) — left in combo collection`,
        )
        missingBrand++
        continue
      }

      if (product.collection_id === brandId) continue

      await productService.updateProducts(product.id, { collection_id: brandId })
      console.log(`  ✓ ${product.title} → brand '${brandHandle}'`)
      reassigned++
    }
    console.log('')
  }

  console.log(`Done. Re-assigned ${reassigned} product(s) to their brand collections.`)
  if (missingBrand > 0) {
    console.warn(`${missingBrand} product(s) had no resolvable brand — review the warnings above.`)
  }
}
