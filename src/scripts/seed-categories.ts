import { ExecArgs } from "@medusajs/framework/types"
import { CATEGORY_MODULE } from "../modules/category"
import CategoryModuleService from "../modules/category/service/category-module-service"

/**
 * Seed script: populates the full Beauty & Baby Care category tree.
 *
 * Run with:
 *   pnpm medusa exec src/scripts/seed-categories.ts
 */
export default async function seedCategories({ container }: ExecArgs) {
  const categoryService: CategoryModuleService =
    container.resolve(CATEGORY_MODULE)

  console.log("Seeding categories…")

  // ─── Helper ──────────────────────────────────────────────────────────────

  type CategoryInput = {
    name: string
    slug: string
    description?: string
    image?: string
    order?: number
    children?: CategoryInput[]
  }

  type CreatedCategory = {
    id: string
    name: string
    slug: string
  }

  async function createTree(
    nodes: CategoryInput[],
    parentId: string | undefined = undefined
  ): Promise<void> {
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i]
      const created: CreatedCategory = (await categoryService.create({
        name: node.name,
        slug: node.slug,
        description: node.description ?? undefined,
        image: node.image ?? undefined,
        parentId,
        order: node.order ?? i,
        isActive: true,
      })) as unknown as CreatedCategory

      console.log(`  Created: ${node.slug} (id: ${created.id})`)

      if (node.children && node.children.length > 0) {
        await createTree(node.children, created.id)
      }
    }
  }

  // ─── Category Tree ────────────────────────────────────────────────────────

  const tree: CategoryInput[] = [
    {
      name: "Beauty & Personal Care",
      slug: "beauty-personal-care",
      description: "All beauty and personal care products",
      order: 0,
      children: [
        {
          name: "Skincare",
          slug: "skincare",
          description: "Skincare products for every skin type",
          order: 0,
          children: [
            {
              name: "Face",
              slug: "skincare-face",
              order: 0,
              children: [
                {
                  name: "Cleanser",
                  slug: "skincare-face-cleanser",
                  order: 0,
                  children: [
                    { name: "Foam Cleanser", slug: "foam-cleanser", order: 0 },
                    { name: "Oil Cleanser", slug: "oil-cleanser", order: 1 },
                    { name: "Micellar Water", slug: "micellar-water", order: 2 },
                  ],
                },
                {
                  name: "Toner",
                  slug: "skincare-face-toner",
                  order: 1,
                  children: [
                    { name: "Hydrating Toner", slug: "hydrating-toner", order: 0 },
                    { name: "Exfoliating Toner", slug: "exfoliating-toner", order: 1 },
                  ],
                },
                {
                  name: "Serum",
                  slug: "skincare-face-serum",
                  order: 2,
                  children: [
                    { name: "Vitamin C Serum", slug: "vitamin-c-serum", order: 0 },
                    { name: "Niacinamide Serum", slug: "niacinamide-serum", order: 1 },
                    { name: "Snail Serum", slug: "snail-serum", order: 2 },
                  ],
                },
                {
                  name: "Moisturiser",
                  slug: "skincare-face-moisturiser",
                  order: 3,
                  children: [
                    { name: "Gel Moisturiser", slug: "gel-moisturiser", order: 0 },
                    { name: "Cream Moisturiser", slug: "cream-moisturiser", order: 1 },
                    { name: "Night Cream", slug: "night-cream", order: 2 },
                  ],
                },
                {
                  name: "Sunscreen",
                  slug: "skincare-face-sunscreen",
                  order: 4,
                  children: [
                    { name: "SPF 30", slug: "sunscreen-spf-30", order: 0 },
                    { name: "SPF 50+", slug: "sunscreen-spf-50-plus", order: 1 },
                    { name: "Tinted Sunscreen", slug: "tinted-sunscreen", order: 2 },
                  ],
                },
                {
                  name: "Eye Care",
                  slug: "skincare-eye-care",
                  order: 5,
                  children: [
                    { name: "Eye Cream", slug: "eye-cream", order: 0 },
                    { name: "Eye Serum", slug: "eye-serum", order: 1 },
                  ],
                },
              ],
            },
            {
              name: "Masks & Treatments",
              slug: "skincare-masks-treatments",
              order: 1,
              children: [
                { name: "Sheet Masks", slug: "sheet-masks", order: 0 },
                { name: "Clay Masks", slug: "clay-masks", order: 1 },
                { name: "Sleeping Masks", slug: "sleeping-masks", order: 2 },
                { name: "Exfoliants & Peels", slug: "exfoliants-peels", order: 3 },
              ],
            },
          ],
        },
        {
          name: "Hair Care",
          slug: "hair-care",
          description: "Shampoos, conditioners, treatments and styling",
          order: 1,
          children: [
            {
              name: "Scalp Care",
              slug: "scalp-care",
              order: 0,
              children: [
                { name: "Anti-Dandruff", slug: "anti-dandruff", order: 0 },
                { name: "Scalp Serum", slug: "scalp-serum", order: 1 },
                { name: "Scalp Scrub", slug: "scalp-scrub", order: 2 },
              ],
            },
            {
              name: "Shampoo",
              slug: "shampoo",
              order: 1,
              children: [
                { name: "Moisturising Shampoo", slug: "moisturising-shampoo", order: 0 },
                { name: "Volumising Shampoo", slug: "volumising-shampoo", order: 1 },
                { name: "Colour-Safe Shampoo", slug: "colour-safe-shampoo", order: 2 },
                { name: "Sulphate-Free Shampoo", slug: "sulphate-free-shampoo", order: 3 },
              ],
            },
            {
              name: "Conditioner",
              slug: "conditioner",
              order: 2,
              children: [
                { name: "Rinse-Out Conditioner", slug: "rinse-out-conditioner", order: 0 },
                { name: "Leave-In Conditioner", slug: "leave-in-conditioner", order: 1 },
                { name: "Deep Conditioner", slug: "deep-conditioner", order: 2 },
              ],
            },
            {
              name: "Hair Treatment",
              slug: "hair-treatment",
              order: 3,
              children: [
                { name: "Hair Mask", slug: "hair-mask", order: 0 },
                { name: "Hair Oil", slug: "hair-oil", order: 1 },
                { name: "Hair Serum", slug: "hair-serum", order: 2 },
                { name: "Hair Tonic", slug: "hair-tonic", order: 3 },
              ],
            },
          ],
        },
        {
          name: "Body Care",
          slug: "body-care",
          description: "Body moisturisers, cleansers, and scrubs",
          order: 2,
          children: [
            {
              name: "Body Moisturiser",
              slug: "body-moisturiser",
              order: 0,
              children: [
                { name: "Body Lotion", slug: "body-lotion", order: 0 },
                { name: "Body Butter", slug: "body-butter", order: 1 },
                { name: "Body Oil", slug: "body-oil", order: 2 },
                { name: "Body Gel", slug: "body-gel", order: 3 },
              ],
            },
            {
              name: "Body Cleanse",
              slug: "body-cleanse",
              order: 1,
              children: [
                { name: "Body Wash", slug: "body-wash", order: 0 },
                { name: "Bar Soap", slug: "bar-soap", order: 1 },
                { name: "Body Scrub", slug: "body-scrub", order: 2 },
              ],
            },
            {
              name: "Sun Care",
              slug: "sun-care",
              order: 2,
              children: [
                { name: "Body Sunscreen", slug: "body-sunscreen", order: 0 },
                { name: "After Sun", slug: "after-sun", order: 1 },
              ],
            },
          ],
        },
      ],
    },
    {
      name: "Baby Care",
      slug: "baby-care",
      description: "Gentle, safe products for babies and toddlers",
      order: 1,
      children: [
        {
          name: "Baby Skincare",
          slug: "baby-skincare",
          order: 0,
          children: [
            { name: "Baby Moisturiser", slug: "baby-moisturiser", order: 0 },
            { name: "Baby Cleanser", slug: "baby-cleanser", order: 1 },
            { name: "Baby Sunscreen", slug: "baby-sunscreen", order: 2 },
            { name: "Nappy Rash Cream", slug: "nappy-rash-cream", order: 3 },
          ],
        },
        {
          name: "Baby Bath",
          slug: "baby-bath",
          order: 1,
          children: [
            { name: "Baby Shampoo", slug: "baby-shampoo", order: 0 },
            { name: "Baby Body Wash", slug: "baby-body-wash", order: 1 },
            { name: "Baby Bubble Bath", slug: "baby-bubble-bath", order: 2 },
            { name: "Baby Bath Oil", slug: "baby-bath-oil", order: 3 },
          ],
        },
        {
          name: "Baby Hair Care",
          slug: "baby-hair-care",
          order: 2,
          children: [
            { name: "Baby Hair Oil", slug: "baby-hair-oil", order: 0 },
            { name: "Baby Conditioner", slug: "baby-conditioner", order: 1 },
          ],
        },
        {
          name: "Baby Wipes & Nappies",
          slug: "baby-wipes-nappies",
          order: 3,
          children: [
            { name: "Baby Wipes", slug: "baby-wipes", order: 0 },
            { name: "Nappies", slug: "nappies", order: 1 },
          ],
        },
      ],
    },
    {
      name: "Makeup",
      slug: "makeup",
      description: "Face, eye, and lip makeup",
      order: 2,
      children: [
        {
          name: "Face Makeup",
          slug: "face-makeup",
          order: 0,
          children: [
            { name: "Foundation", slug: "foundation", order: 0 },
            { name: "Concealer", slug: "concealer", order: 1 },
            { name: "Blush & Bronzer", slug: "blush-bronzer", order: 2 },
            { name: "Setting Powder & Spray", slug: "setting-powder-spray", order: 3 },
          ],
        },
        {
          name: "Eye Makeup",
          slug: "eye-makeup",
          order: 1,
          children: [
            { name: "Mascara", slug: "mascara", order: 0 },
            { name: "Eyeliner", slug: "eyeliner", order: 1 },
            { name: "Eyeshadow", slug: "eyeshadow", order: 2 },
            { name: "Eyebrow Products", slug: "eyebrow-products", order: 3 },
          ],
        },
        {
          name: "Lip Makeup",
          slug: "lip-makeup",
          order: 2,
          children: [
            { name: "Lipstick", slug: "lipstick", order: 0 },
            { name: "Lip Gloss", slug: "lip-gloss", order: 1 },
            { name: "Lip Liner", slug: "lip-liner", order: 2 },
            { name: "Lip Balm", slug: "lip-balm", order: 3 },
          ],
        },
      ],
    },
    {
      name: "Fragrance",
      slug: "fragrance",
      description: "Perfumes, body mists, and deodorants",
      order: 3,
      children: [
        { name: "Perfume", slug: "perfume", order: 0 },
        { name: "Body Mist", slug: "body-mist", order: 1 },
        { name: "Deodorant", slug: "deodorant", order: 2 },
        { name: "Attar / Oud", slug: "attar-oud", order: 3 },
      ],
    },
  ]

  await createTree(tree)

  console.log("Category seeding complete.")
}
