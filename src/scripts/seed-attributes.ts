/**
 * Seed script: attribute groups and attributes for beauty/baby-care categories.
 *
 * Run via Medusa exec:
 *   npx medusa exec src/scripts/seed-attributes.ts
 *
 * The script resolves the category IDs it needs from the database by slug,
 * then delegates seeding to AttributeModuleService.seedBeautyAttributes().
 */
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { ATTRIBUTE_MODULE } from "../modules/attribute"
import type AttributeModuleService from "../modules/attribute/service/attribute-module-service"
import { CATEGORY_MODULE } from "../modules/category"
import type CategoryModuleService from "../modules/category/service/category-module-service"

export default async function seedAttributes({
  container,
}: {
  container: Record<string, unknown>
}): Promise<void> {
  const logger = (
    container[ContainerRegistrationKeys.LOGGER] as {
      info: (msg: string) => void
      error: (msg: string) => void
    }
  ) ?? { info: console.log, error: console.error }

  logger.info("Starting attribute seed...")

  const categoryService =
    container[CATEGORY_MODULE] as CategoryModuleService

  const attributeService =
    container[ATTRIBUTE_MODULE] as AttributeModuleService

  // ── Resolve category IDs by slug ──────────────────────────────────────────
  const slugToHandle: Record<string, string> = {
    "all-products": "root",
    skincare: "skincare",
    "baby-care": "baby-care",
    "hair-care": "hair-care",
    "body-care": "body-care",
  }

  const categoryHandleToId: Record<string, string> = {}

  for (const [slug, handle] of Object.entries(slugToHandle)) {
    const category = await categoryService.getBySlug(slug)
    if (category) {
      categoryHandleToId[handle] = category.id
      logger.info(`Resolved category "${slug}" → ${category.id}`)
    } else {
      logger.error(
        `Category with slug "${slug}" not found — using slug as fallback ID`
      )
      categoryHandleToId[handle] = slug
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
