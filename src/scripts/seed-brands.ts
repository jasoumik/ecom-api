/**
 * Seed script: creates K-beauty brand collections based on ksecretbeautybd.com inventory.
 *
 * Run with:
 *   npx medusa exec src/scripts/seed-brands.ts
 */
import { ExecArgs } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { IProductModuleService } from "@medusajs/framework/types"

export default async function seedBrands({ container }: ExecArgs) {
  const productService: IProductModuleService = container.resolve(
    Modules.PRODUCT
  )

  console.log("Seeding brands (product collections)…")

  const brands = [
    {
      title: "COSRX",
      handle: "cosrx",
      metadata: {
        origin: "South Korea",
        description:
          "K-beauty pioneer known for snail mucin serums and BHA/AHA treatments. Science-backed, minimal ingredient lists.",
        logo_url: "",
        featured: true,
      },
    },
    {
      title: "Beauty of Joseon",
      handle: "beauty-of-joseon",
      metadata: {
        origin: "South Korea",
        description:
          "Inspired by Joseon Dynasty beauty secrets — hanbang (traditional herbal) ingredients blended with modern skincare.",
        logo_url: "",
        featured: true,
      },
    },
    {
      title: "ANUA",
      handle: "anua",
      metadata: {
        origin: "South Korea",
        description:
          "Clean, gentle formulas centred on heartleaf and botanical extracts for sensitive, acne-prone skin.",
        logo_url: "",
        featured: true,
      },
    },
    {
      title: "SKIN1004",
      handle: "skin1004",
      metadata: {
        origin: "South Korea",
        description:
          "Madagascar centella asiatica specialist. Minimal, hypoallergenic formulas for irritated and barrier-compromised skin.",
        logo_url: "",
        featured: true,
      },
    },
    {
      title: "I'm From",
      handle: "im-from",
      metadata: {
        origin: "South Korea",
        description:
          "Locally-sourced Korean natural ingredients — rice, ginseng, honey, mugwort — in high-concentration formulas.",
        logo_url: "",
        featured: true,
      },
    },
    {
      title: "Medicube",
      handle: "medicube",
      metadata: {
        origin: "South Korea",
        description:
          "Dermatologist-developed brand focused on pore care, brightening, and skin-clinic-grade actives.",
        logo_url: "",
        featured: true,
      },
    },
    {
      title: "Some By Mi",
      handle: "some-by-mi",
      metadata: {
        origin: "South Korea",
        description:
          "AHA/BHA/PHA toner fame. Targets acne, hyperpigmentation, and texture with gentle yet effective acid blends.",
        logo_url: "",
        featured: false,
      },
    },
    {
      title: "Heimish",
      handle: "heimish",
      metadata: {
        origin: "South Korea",
        description:
          "Danish-meets-Korean minimalism. Gentle cleansers and hydrating essences for everyday, fuss-free skincare.",
        logo_url: "",
        featured: false,
      },
    },
    {
      title: "AXIS-Y",
      handle: "axis-y",
      metadata: {
        origin: "South Korea",
        description:
          "Sustainably conscious K-beauty. Upcycled ingredients, vegan formulas, and targeted treatments for uneven skin.",
        logo_url: "",
        featured: false,
      },
    },
    {
      title: "Dr. Althea",
      handle: "dr-althea",
      metadata: {
        origin: "South Korea",
        description:
          "Derma-cosmetics brand with retinol, peptide, and brightening lines. Designed for results-focused routines.",
        logo_url: "",
        featured: false,
      },
    },
    {
      title: "iUNIK",
      handle: "iunik",
      metadata: {
        origin: "South Korea",
        description:
          "Clean beauty with high active percentages — centella, propolis, vitamin C — at accessible price points.",
        logo_url: "",
        featured: false,
      },
    },
    {
      title: "Missha",
      handle: "missha",
      metadata: {
        origin: "South Korea",
        description:
          "One of Korea's original affordable luxury brands. Famous for Time Revolution essence and BB creams.",
        logo_url: "",
        featured: false,
      },
    },
    {
      title: "CARE:NEL",
      handle: "carenel",
      metadata: {
        origin: "South Korea",
        description:
          "Lip care specialist known for watery tints, hydrating glosses, and long-wear lip colours.",
        logo_url: "",
        featured: false,
      },
    },
    {
      title: "Cos De BAHA",
      handle: "cos-de-baha",
      metadata: {
        origin: "South Korea",
        description:
          "High-potency actives at budget prices — niacinamide, retinol, vitamin C, salicylic acid serums.",
        logo_url: "",
        featured: false,
      },
    },
    {
      title: "Numbuzin",
      handle: "numbuzin",
      metadata: {
        origin: "South Korea",
        description:
          "Numbered skincare system targeting specific concerns — glass skin, brightening, pore minimising.",
        logo_url: "",
        featured: false,
      },
    },
    {
      title: "Isntree",
      handle: "isntree",
      metadata: {
        origin: "South Korea",
        description:
          "Hyaluronic acid powerhouse. Fragrance-free, minimalist toners and moisturisers for dry, sensitive skin.",
        logo_url: "",
        featured: false,
      },
    },
    {
      title: "COXIR",
      handle: "coxir",
      metadata: {
        origin: "South Korea",
        description:
          "Luxury K-beauty with gold, collagen, and black snail ingredients. Premium anti-ageing and brightening lines.",
        logo_url: "",
        featured: false,
      },
    },
    {
      title: "Arencia",
      handle: "arencia",
      metadata: {
        origin: "South Korea",
        description:
          "Fermented ingredient specialist. Probiotic and yeast-based formulas for microbiome-balanced, glowing skin.",
        logo_url: "",
        featured: false,
      },
    },
    {
      title: "Aromatica",
      handle: "aromatica",
      metadata: {
        origin: "South Korea",
        description:
          "Certified natural and vegan. Rosehip, tea tree, and calendula-led formulas in eco-friendly packaging.",
        logo_url: "",
        featured: false,
      },
    },
    {
      title: "Klairs",
      handle: "klairs",
      metadata: {
        origin: "South Korea",
        description:
          "Sensitive-skin pioneers. Fragrance-free, pH-balanced toners and essentials loved globally for barrier repair.",
        logo_url: "",
        featured: false,
      },
    },
    {
      title: "SKINFOOD",
      handle: "skinfood",
      metadata: {
        origin: "South Korea",
        description:
          "Food-to-skin philosophy. Real ingredients like black sugar, rice, and eggs in gentle, nourishing formulas.",
        logo_url: "",
        featured: false,
      },
    },
    {
      title: "ABIB",
      handle: "abib",
      metadata: {
        origin: "South Korea",
        description:
          "Minimal, clinical formulas inspired by dermatology. Jelly toners and concentrated essence pads.",
        logo_url: "",
        featured: false,
      },
    },
    {
      title: "Banila Co",
      handle: "banila-co",
      metadata: {
        origin: "South Korea",
        description:
          "Home of the iconic Clean It Zero cleansing balm. Makeup removal and clean skin as a self-care ritual.",
        logo_url: "",
        featured: false,
      },
    },
    {
      title: "By Wishtrend",
      handle: "by-wishtrend",
      metadata: {
        origin: "South Korea",
        description:
          "Science-backed brand from Wishtrend beauty lab. Vitamin C, mandelic acid, and bakuchiol actives.",
        logo_url: "",
        featured: false,
      },
    },
    {
      title: "Round Lab",
      handle: "round-lab",
      metadata: {
        origin: "South Korea",
        description:
          "Dokdo deep-sea water and birch sap skincare. Hydration-focused, dermatologically tested formulas.",
        logo_url: "",
        featured: false,
      },
    },
    {
      title: "Celimax",
      handle: "celimax",
      metadata: {
        origin: "South Korea",
        description:
          "Noni fruit and green ingredients for soothing and calming inflamed, acne-prone skin.",
        logo_url: "",
        featured: false,
      },
    },
    {
      title: "PURITO",
      handle: "purito",
      metadata: {
        origin: "South Korea",
        description:
          "Transparent, clean formulas with centella and kombucha. Known for reef-safe sunscreens.",
        logo_url: "",
        featured: false,
      },
    },
    {
      title: "Eqqualberry",
      handle: "eqqualberry",
      metadata: {
        origin: "South Korea",
        description:
          "Berry and antioxidant-rich skincare. Brightening and protective formulas using superfruit extracts.",
        logo_url: "",
        featured: false,
      },
    },
  ]

  for (const brand of brands) {
    try {
      const existing = await productService.listCollections({
        handle: [brand.handle],
      })

      if (existing.length > 0) {
        console.log(`  Skipped (exists): ${brand.handle}`)
        continue
      }

      await productService.createCollections([
        {
          title: brand.title,
          handle: brand.handle,
          metadata: brand.metadata,
        },
      ])

      console.log(`  Created brand: ${brand.title}`)
    } catch (err) {
      console.error(`  Error creating brand ${brand.handle}:`, err)
    }
  }

  console.log("Brand seeding complete.")
}
