/**
 * Assigns categories to all existing products based on title keyword inference.
 * Safe to run multiple times — fully idempotent, no duplicates.
 *
 * Run with:
 *   npx medusa exec src/scripts/assign-product-categories.ts
 */
import { ExecArgs } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { IProductModuleService } from "@medusajs/framework/types"

// Hardcoded from production DB — safe to use directly
const CATEGORY_IDS: Record<string, string> = {
  "skincare":       "pcat_01KX4D84R09VNYFAZWYQE9X432",
  "serum":          "pcat_01KX4D84RK28RWSHWKVHJ8K824",
  "moisturizer":    "pcat_01KX4D84S1P65YKB628XWE1A75",
  "toner":          "pcat_01KX4D84SFFYNXQFP8WBJ2SDYQ",
  "cleanser":       "pcat_01KX4D84T1ZNA511EFX2PCDVVA",
  "sunscreen":      "pcat_01KX4D84TFCE38CT7M4H6CD1EJ",
  "face-mask":      "pcat_01KX4D84TVM947SPRG4ZDKYHD2",
  "eye-care":       "pcat_01KX4D84V6TK3VSB3YNQ3XQQ2A",
  "oil-cleanser":   "pcat_01KX4D84VHMM14CJYF48KBC7ZY",
  "cleansing-balm": "pcat_01KX4D84VV14Q6H8EKWV9WS8KZ",
  "sheet-mask":     "pcat_01KX4D84WA8QF22DSF4BPN7QM0",
  "ampule":         "pcat_01KX4D84WM6DZ99SCDTARGYVNQ",
  "gel-moisturizer":"pcat_01KX4D84WXV8X0P1MEY89TCJG2",
  "sun-stick":      "pcat_01KX4D84XATR6GSCQJG5FCMVFY",
  "skin-care-sets": "pcat_01KX4D84XSPMPQ81X1W07A930E",
  "hair-care":      "pcat_01KX4D84Y7DVG70XWWJ38JMAN5",
  "shampoo":        "pcat_01KX4D84YPPV7K3QV2PS24NJYM",
  "body-care":      "pcat_01KX4D84Z2AKP519YWFBTGBPD1",
  // Fill these in with the IDs printed by seed-categories.ts after it creates them.
  "baby-care":      "",
  "soap":           "",
}

function inferCategoryHandles(title: string): string[] {
  const t = title.toLowerCase()
  const cats: string[] = ["skincare"]

  if (t.includes("baby") || t.includes("kids") || t.includes("kodomo") || t.includes("mothercare")) return ["baby-care"]
  if (t.includes("soap")) return ["soap"]
  if (t.includes("shampoo")) return ["hair-care", "shampoo"]
  if (t.includes("conditioner") || t.includes("hair pack") || t.includes("hair mask") || (t.includes("hair") && !t.includes("skin"))) return ["hair-care"]
  if (t.includes("body lotion") || t.includes("body cream") || t.includes("body wash")) return ["body-care"]

  if (t.includes("sun stick") || t.includes("sunstick")) { cats.push("sun-stick", "sunscreen"); return [...new Set(cats)] }
  if (t.includes("sunscreen") || t.includes("sun cream") || t.includes("spf") || /\buv\b/.test(t)) cats.push("sunscreen")
  if (t.includes("sheet mask")) { cats.push("sheet-mask", "face-mask"); return [...new Set(cats)] }
  if ((t.includes("mask") || t.includes("face pack") || /\bpads?\b/.test(t)) && !t.includes("eye pad")) cats.push("face-mask")
  if (t.includes("eye")) cats.push("eye-care")
  if (t.includes("cleansing oil") || t.includes("oil cleanser") || (t.includes("cleansing") && t.includes("oil"))) { cats.push("oil-cleanser", "cleanser"); return [...new Set(cats)] }
  if (t.includes("cleansing balm") || t.includes("balm cleanser")) { cats.push("cleansing-balm", "cleanser"); return [...new Set(cats)] }
  if (t.includes("foam") || t.includes("cleanser") || t.includes("face wash") || t.includes("facial wash") || (t.includes("cleansing") && !cats.includes("oil-cleanser"))) cats.push("cleanser")
  if (t.includes("toner") || t.includes("softener") || (t.includes("essence") && !t.includes("serum"))) cats.push("toner")
  if (t.includes("ampoule") || t.includes("ampule")) cats.push("ampule")
  else if (t.includes("serum") || t.includes("booster")) cats.push("serum")
  if (t.includes("gel") && (t.includes("cream") || t.includes("moisturizer") || t.includes("moisture"))) { cats.push("gel-moisturizer", "moisturizer"); return [...new Set(cats)] }
  if (t.includes("cream") || t.includes("moisturizer") || t.includes("lotion") || t.includes("emulsion") || t.includes("barrier")) cats.push("moisturizer")
  if (t.includes("kit") || t.includes("set") || t.includes("starter")) cats.push("skin-care-sets")

  return [...new Set(cats)]
}

export default async function assignProductCategories({ container }: ExecArgs) {
  const productService: IProductModuleService = container.resolve(Modules.PRODUCT)

  console.log("Assigning categories to products…\n")

  // Load all products in batches
  const BATCH = 100
  let offset = 0
  let totalUpdated = 0
  let totalSkipped = 0
  let totalErrors = 0

  while (true) {
    const products = await productService.listProducts(
      {},
      { take: BATCH, skip: offset, relations: ["categories"] }
    ) as Array<{ id: string; title: string; categories?: { id: string }[] }>

    if (products.length === 0) break

    for (const product of products) {
      try {
        const handles = inferCategoryHandles(product.title)
        const targetIds = handles.map((h) => CATEGORY_IDS[h]).filter(Boolean)

        const existingIds = new Set((product.categories ?? []).map((c) => c.id))
        const missingIds = targetIds.filter((id) => !existingIds.has(id))

        if (missingIds.length === 0) {
          totalSkipped++
          continue
        }

        const allIds = [...Array.from(existingIds), ...missingIds]
        await productService.updateProducts(product.id, {
          category_ids: allIds,
        })

        console.log(`  ✓ ${product.title}`)
        console.log(`    → [${handles.join(", ")}]`)
        totalUpdated++
      } catch (err) {
        console.error(`  ✗ ${product.title}:`, err)
        totalErrors++
      }
    }

    offset += BATCH
    if (products.length < BATCH) break
  }

  console.log(`\nDone. Updated: ${totalUpdated}, Already correct: ${totalSkipped}, Errors: ${totalErrors}`)
}
