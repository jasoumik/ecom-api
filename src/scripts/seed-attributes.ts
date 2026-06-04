/**
 * Seed script: attribute groups and attributes for beauty/baby-care categories.
 *
 * Run via Medusa exec:
 *   npx medusa exec src/scripts/seed-attributes.ts
 *
 * The script resolves the category IDs it needs from the database by handle,
 * then delegates seeding to AttributeModuleService.seedBeautyAttributes().
 */
import { ExecArgs } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { ATTRIBUTE_MODULE } from "../modules/attribute"
import type AttributeModuleService from "../modules/attribute/service/attribute-module-service"

export default async function seedAttributes({ container }: ExecArgs): Promise<void> {
  console.log("Starting attribute seed...")

  const productService = container.resolve(Modules.PRODUCT)
  const attributeService = container.resolve<AttributeModuleService>(ATTRIBUTE_MODULE)

  const logger = { info: console.log, error: console.error }

  // ── Resolve category IDs by handle ────────────────────────────────────────
  const handlesToResolve = [
    "all-products",
    "skincare",
    "baby-care",
    "hair-care",
    "body-care",
  ]

  const allCategories = await (productService as {
    listProductCategories: (
      filters: Record<string, unknown>,
      options: Record<string, unknown>
    ) => Promise<Array<{ id: string; handle: string }>>
  }).listProductCategories({}, { take: 500 })

  const byHandle = new Map(allCategories.map((c) => [c.handle, c.id]))

  const categoryHandleToId: Record<string, string> = {}

  for (const handle of handlesToResolve) {
    const id = byHandle.get(handle)
    if (id) {
      categoryHandleToId[handle] = id
      logger.info(`Resolved category "${handle}" → ${id}`)
    } else {
      logger.error(
        `Category with handle "${handle}" not found — using handle as fallback ID`
      )
      categoryHandleToId[handle] = handle
    }
  }

  // ── Check for existing attribute groups to avoid double-seeding ──────────
  const existing = await attributeService.listGroups({})
  if (existing.length > 0) {
    logger.info(
      `${existing.length} attribute group(s) already exist — skipping seed to prevent duplicates.`
    )
    return
  }

  // ── Delegate to the service seed helper ──────────────────────────────────
  await attributeService.seedBeautyAttributes(categoryHandleToId)

  logger.info("Attribute seed completed successfully.")
}
