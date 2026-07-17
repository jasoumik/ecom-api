import { ExecArgs } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

/**
 * Seed script: populates the skincare category tree using Medusa's built-in
 * product_category module.
 *
 * Run with:
 *   pnpm medusa exec src/scripts/seed-categories.ts
 */
export default async function seedCategories({ container }: ExecArgs) {
  const productService = container.resolve(Modules.PRODUCT)

  console.log("Seeding categories…")

  type CategoryInput = {
    name: string
    handle: string
    description?: string
    rank?: number
    children?: CategoryInput[]
  }

  async function getExistingHandles(): Promise<Set<string>> {
    const existing = await (productService as {
      listProductCategories: (
        filters: Record<string, unknown>,
        options: Record<string, unknown>
      ) => Promise<Array<{ handle: string }>>
    }).listProductCategories({}, { take: 500 })
    return new Set(existing.map((c) => c.handle))
  }

  async function createTree(
    nodes: CategoryInput[],
    parentCategoryId: string | undefined,
    existingHandles: Set<string>
  ): Promise<void> {
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i]
      let id: string

      // Look the category up by its own handle each time — robust even when
      // the bulk pre-fetch returns nothing on this Medusa version.
      const records = await (productService as {
        listProductCategories: (
          filters: Record<string, unknown>,
          options: Record<string, unknown>
        ) => Promise<Array<{ id: string; handle: string }>>
      }).listProductCategories({ handle: node.handle }, { take: 1 })

      if (records.length > 0) {
        id = records[0].id
        console.log(`  Skipped (exists): ${node.handle} (id: ${id})`)
      } else {
        const payload: Record<string, unknown> = {
          name: node.name,
          handle: node.handle,
          is_active: true,
          rank: node.rank ?? i,
        }
        if (node.description) payload.description = node.description
        if (parentCategoryId) payload.parent_category_id = parentCategoryId

        const [created] = await (productService as unknown as {
          createProductCategories: (
            data: Record<string, unknown>[]
          ) => Promise<Array<{ id: string }>>
        }).createProductCategories([payload])
        id = created.id
        console.log(`  Created: ${node.handle} (id: ${id})`)
        existingHandles.add(node.handle)
      }

      if (node.children && node.children.length > 0) {
        await createTree(node.children, id, existingHandles)
      }
    }
  }

  const tree: CategoryInput[] = [
    {
      name: "Skincare",
      handle: "skincare",
      description: "Skincare products for every skin type",
      rank: 0,
      children: [
        { name: "Serum", handle: "serum", rank: 0 },
        { name: "Moisturizer", handle: "moisturizer", rank: 1 },
        { name: "Toner", handle: "toner", rank: 2 },
        { name: "Cleanser", handle: "cleanser", rank: 3 },
        { name: "Sunscreen", handle: "sunscreen", rank: 4 },
        { name: "Face Mask", handle: "face-mask", rank: 5 },
        { name: "Eye Care", handle: "eye-care", rank: 6 },
        { name: "Oil Cleanser", handle: "oil-cleanser", rank: 7 },
        { name: "Cleansing Balm", handle: "cleansing-balm", rank: 8 },
        { name: "Sheet Mask", handle: "sheet-mask", rank: 9 },
        { name: "Ampule", handle: "ampule", rank: 10 },
        { name: "Gel Moisturizer", handle: "gel-moisturizer", rank: 11 },
        { name: "Sun Stick", handle: "sun-stick", rank: 12 },
        { name: "Skin Care Sets", handle: "skin-care-sets", rank: 13 },
      ],
    },
    {
      name: "Hair Care",
      handle: "hair-care",
      description: "Shampoos, conditioners, treatments and styling",
      rank: 1,
      children: [
        { name: "Shampoo", handle: "shampoo", rank: 0 },
      ],
    },
    {
      name: "Body Care",
      handle: "body-care",
      description: "Body moisturisers, cleansers, and scrubs",
      rank: 2,
    },
    {
      name: "Baby Care",
      handle: "baby-care",
      description: "Gentle baby washes, shampoos, lotions, oils, creams, and soaps",
      rank: 3,
    },
    {
      name: "Soap",
      handle: "soap",
      description: "Bar soaps — whitening, kojic, herbal, and cleansing",
      rank: 4,
    },
  ]

  const existingHandles = await getExistingHandles()
  await createTree(tree, undefined, existingHandles)

  console.log("Category seeding complete.")
}
