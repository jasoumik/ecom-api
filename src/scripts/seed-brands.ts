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
      title: "AROMATICA",
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
      title: "ARENCIA",
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
      title: "BANILA CO",
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
      title: "BEAUTY OF JOSEON",
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
      title: "BY WISHTREND",
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
      title: "CARE:NEL",
      handle: "carenel",
      metadata: {
        origin: "South Korea",
        description:
          "High-potency actives — AHA, BHA, niacinamide, ceramides — at accessible price points for all skin types.",
        logo_url: "",
        featured: false,
      },
    },
    {
      title: "CELIMAX",
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
      title: "CETAPHIL",
      handle: "cetaphil",
      metadata: {
        origin: "USA",
        description:
          "Dermatologist-recommended gentle cleansers and moisturisers for dry and sensitive skin.",
        logo_url: "",
        featured: false,
      },
    },
    {
      title: "COS DE BAHA",
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
      title: "DR. ALTHEA",
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
      title: "EQUALBERRY",
      handle: "equalberry",
      metadata: {
        origin: "South Korea",
        description:
          "Berry and antioxidant-rich skincare. Brightening and protective formulas using superfruit extracts.",
        logo_url: "",
        featured: false,
      },
    },
    {
      title: "GOODAL",
      handle: "goodal",
      metadata: {
        origin: "South Korea",
        description:
          "Green tangerine vitamin C specialist. Bright, fruity actives for dark spot correction and glow.",
        logo_url: "",
        featured: false,
      },
    },
    {
      title: "HARUHARU WONDER",
      handle: "haruharu-wonder",
      metadata: {
        origin: "South Korea",
        description:
          "Black rice hyaluronic formulas for deep hydration and sensitive skin repair.",
        logo_url: "",
        featured: false,
      },
    },
    {
      title: "HEIMISH",
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
      title: "I'M FROM",
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
      title: "INNISFREE",
      handle: "innisfree",
      metadata: {
        origin: "South Korea",
        description:
          "Jeju island natural ingredients — green tea, volcanic ash, orchid — in clean, eco-conscious formulas.",
        logo_url: "",
        featured: false,
      },
    },
    {
      title: "ISNTREE",
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
      title: "IUNIK",
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
      title: "JNH",
      handle: "jnh",
      metadata: {
        origin: "South Korea",
        description:
          "Gentle, effective K-beauty formulas for daily cleansing and skincare routines.",
        logo_url: "",
        featured: false,
      },
    },
    {
      title: "JUMISO",
      handle: "jumiso",
      metadata: {
        origin: "South Korea",
        description:
          "Playful K-beauty with effective actives — niacinamide, vitamin C — in cheerful, accessible packaging.",
        logo_url: "",
        featured: false,
      },
    },
    {
      title: "K-SECRET",
      handle: "k-secret",
      metadata: {
        origin: "South Korea",
        description:
          "Seoul 1988-inspired K-beauty brand combining classic hanbang traditions with modern actives.",
        logo_url: "",
        featured: false,
      },
    },
    {
      title: "KLAIRS",
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
      title: "MARY & MAY",
      handle: "mary-and-may",
      metadata: {
        origin: "South Korea",
        description:
          "Glutathione, tranexamic acid, and peptide formulas for brightening and anti-ageing.",
        logo_url: "",
        featured: false,
      },
    },
    {
      title: "MEDICUBE",
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
      title: "MISSHA",
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
      title: "NUMBUZIN",
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
      title: "PURITO SEOUL",
      handle: "purito-seoul",
      metadata: {
        origin: "South Korea",
        description:
          "Transparent, clean formulas with centella and kombucha. Known for reef-safe sunscreens.",
        logo_url: "",
        featured: false,
      },
    },
    {
      title: "ROUND LAB",
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
      title: "SOME BY MI",
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
      title: "THE ORDINARY",
      handle: "the-ordinary",
      metadata: {
        origin: "Canada",
        description:
          "Clinical formulations with integrity. Single-ingredient actives — acids, niacinamide, peptides — at honest prices.",
        logo_url: "",
        featured: false,
      },
    },
    {
      title: "THE FACE SHOP",
      handle: "the-face-shop",
      metadata: {
        origin: "South Korea",
        description:
          "Nature-derived K-beauty staple. Rice water brightening and ceramide moisture lines for everyday skincare.",
        logo_url: "",
        featured: false,
      },
    },
    {
      title: "DR. CEURACLE",
      handle: "dr-ceuracle",
      metadata: {
        origin: "South Korea",
        description:
          "Vegan derma-cosmetics with kombucha, propolis, and centella. Barrier care and scalp health specialists.",
        logo_url: "",
        featured: false,
      },
    },
    {
      title: "LANEIGE",
      handle: "laneige",
      metadata: {
        origin: "South Korea",
        description:
          "Water science pioneers from Amorepacific. Famous for Lip Sleeping Mask and Water Sleeping Mask hydration.",
        logo_url: "",
        featured: false,
      },
    },
    {
      title: "MIZON",
      handle: "mizon",
      metadata: {
        origin: "South Korea",
        description:
          "Snail mucin and collagen specialists. All-in-one repair creams for hydration and skin recovery.",
        logo_url: "",
        featured: false,
      },
    },
    {
      title: "NATURE REPUBLIC",
      handle: "nature-republic",
      metadata: {
        origin: "South Korea",
        description:
          "Nature-inspired K-beauty. Argan and aloe-based hair and skin care from real botanical ingredients.",
        logo_url: "",
        featured: false,
      },
    },
    {
      title: "TOCOBO",
      handle: "tocobo",
      metadata: {
        origin: "South Korea",
        description:
          "Clean, vegan skincare focused on sun protection and glass-skin glow. Cotton-soft sunsticks and collagen care.",
        logo_url: "",
        featured: false,
      },
    },
    {
      title: "TIAM",
      handle: "tiam",
      metadata: {
        origin: "South Korea",
        description:
          "Vitamin C and niacinamide specialists. Brightening serums and My Signature actives for even-toned skin.",
        logo_url: "",
        featured: false,
      },
    },
    {
      title: "ACWELL",
      handle: "acwell",
      metadata: {
        origin: "South Korea",
        description:
          "Licorice-water and pH-balancing formulas. Gentle, brightening toners for sensitive, blemish-prone skin.",
        logo_url: "",
        featured: false,
      },
    },
    {
      title: "DR. JART+",
      handle: "dr-jart",
      metadata: {
        origin: "South Korea",
        description:
          "Derma-science K-beauty. Cicapair and Ceramidin lines for barrier repair, soothing, and deep moisture.",
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
          "Gentle, mild-formula skincare. Heartleaf, mugwort, and collagen lines including popular sunsticks and pads.",
        logo_url: "",
        featured: false,
      },
    },
    {
      title: "DABO",
      handle: "dabo",
      metadata: {
        origin: "South Korea",
        description:
          "Korean daily-care brand known for affordable rice-ferment cleansers, snail repair creams, and sun care.",
        logo_url: "",
        featured: false,
      },
    },
    {
      title: "Kodomo",
      handle: "kodomo",
      metadata: {
        origin: "Thailand",
        description:
          "Gentle baby care from Thailand — hypoallergenic head-to-toe washes, shampoos, lotions, and baby soaps.",
        logo_url: "",
        featured: false,
      },
    },
    {
      title: "Johnson's",
      handle: "johnsons",
      metadata: {
        origin: "United States",
        description:
          "Trusted global baby care. Mild, tear-free baths, shampoos, and lotions for delicate baby skin.",
        logo_url: "",
        featured: false,
      },
    },
    {
      title: "Cathy Doll",
      handle: "cathy-doll",
      metadata: {
        origin: "Thailand",
        description:
          "Playful Thai beauty brand. Serum foam cleansers, whitening, and acne-solution skincare.",
        logo_url: "",
        featured: false,
      },
    },
    {
      title: "Dr. Alvin",
      handle: "dr-alvin",
      metadata: {
        origin: "Philippines",
        description:
          "Filipino skin-lightening specialist. Kojic acid soaps and brightening treatments.",
        logo_url: "",
        featured: false,
      },
    },
    {
      title: "Dot & Key",
      handle: "dot-key",
      metadata: {
        origin: "India",
        description:
          "Indian skincare brand with targeted cica, vitamin C, and acne-clearing formulas.",
        logo_url: "",
        featured: false,
      },
    },
    {
      title: "3W Clinic",
      handle: "3w-clinic",
      metadata: {
        origin: "South Korea",
        description:
          "Korean value skincare. UV sunblocks, snail and collagen creams, and essence toners.",
        logo_url: "",
        featured: false,
      },
    },
    {
      title: "Christian Dean",
      handle: "christian-dean",
      metadata: {
        origin: "South Korea",
        description:
          "Tone-up sun care and daily protection formulas.",
        logo_url: "",
        featured: false,
      },
    },
    {
      title: "K.Brothers",
      handle: "k-brothers",
      metadata: {
        origin: "Thailand",
        description:
          "Thai herbal beauty brand best known for black spot and whitening soaps.",
        logo_url: "",
        featured: false,
      },
    },
    {
      title: "Fiorae",
      handle: "fiorae",
      metadata: {
        origin: "Thailand",
        description:
          "Papaya, gluta, and kojic whitening soaps and brightening care.",
        logo_url: "",
        featured: false,
      },
    },
    {
      title: "Argeville",
      handle: "argeville",
      metadata: {
        origin: "Thailand",
        description:
          "Beauty-care soaps and brightening treatments for blemish-prone skin.",
        logo_url: "",
        featured: false,
      },
    },
    {
      title: "Kojie San",
      handle: "kojie-san",
      metadata: {
        origin: "Philippines",
        description:
          "Iconic Filipino kojic acid skin-lightening soaps and brightening range.",
        logo_url: "",
        featured: false,
      },
    },
    {
      title: "Mothercare",
      handle: "mothercare",
      metadata: {
        origin: "United Kingdom",
        description:
          "British parenting brand offering gentle baby creams, lotions, and washes.",
        logo_url: "",
        featured: false,
      },
    },
    {
      title: "Simple",
      handle: "simple",
      metadata: {
        origin: "United Kingdom",
        description:
          "Sensitive-skin skincare with no harsh chemicals — gentle facial washes and moisturisers.",
        logo_url: "",
        featured: false,
      },
    },
    {
      title: "Aveeno",
      handle: "aveeno",
      metadata: {
        origin: "France",
        description:
          "Oat-based dermatological skincare. Soothing baby creams and daily moisturising lotions.",
        logo_url: "",
        featured: false,
      },
    },
    {
      title: "Thanaka",
      handle: "thanaka",
      metadata: {
        origin: "Thailand",
        description:
          "Traditional thanaka-bark face packs for brightening and cooling.",
        logo_url: "",
        featured: false,
      },
    },
    {
      title: "Alike",
      handle: "alike",
      metadata: {
        origin: "Thailand",
        description:
          "Whitening night creams and brightening skincare.",
        logo_url: "",
        featured: false,
      },
    },
    {
      title: "White Aura",
      handle: "white-aura",
      metadata: {
        origin: "Thailand",
        description:
          "Carrot and herbal whitening soaps and brightening care.",
        logo_url: "",
        featured: false,
      },
    },
    {
      title: "Fairy",
      handle: "fairy",
      metadata: {
        origin: "United Kingdom",
        description:
          "Coffee, green tea, and gluta brightening scrub soaps.",
        logo_url: "",
        featured: false,
      },
    },
  ]

  for (const brand of brands) {
    try {
      const existing = await productService.listProductCollections({
        handle: [brand.handle],
      })

      if (existing.length > 0) {
        console.log(`  Skipped (exists): ${brand.handle}`)
        continue
      }

      await productService.createProductCollections([
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
