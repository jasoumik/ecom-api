/**
 * Seed script: creates K-beauty products based on ksecretbeautybd.com inventory.
 * Prices are in BDT (Bangladeshi Taka).
 *
 * Prerequisites:
 *   - seed-brands.ts must have been run first (collections must exist)
 *   - A region with currency_code "bdt" must exist, OR update REGION_ID below
 *
 * Run with:
 *   npx medusa exec src/scripts/seed-products.ts
 */
import { ExecArgs } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { IProductModuleService, IPricingModuleService } from "@medusajs/framework/types"

type ProductSeedData = {
  title: string
  handle: string
  subtitle?: string
  description?: string
  brand_handle: string
  category_handle: string
  origin_country: string
  price_bdt: number
  sale_price_bdt?: number
  weight_g?: number
  tags?: string[]
  images?: string[]
}

const PRODUCTS: ProductSeedData[] = [
  // ── COSRX ────────────────────────────────────────────────────────────────
  {
    title: "Advanced Snail Mucin Gel Cleanser",
    handle: "cosrx-snail-mucin-gel-cleanser",
    subtitle: "150ml",
    description:
      "A gentle, pH-balanced cleanser enriched with 95.8% snail secretion filtrate. Removes impurities while reinforcing the skin barrier. Suitable for sensitive and acne-prone skin.",
    brand_handle: "cosrx",
    category_handle: "foam-cleanser",
    origin_country: "KR",
    price_bdt: 1400,
    weight_g: 170,
    tags: ["snail", "cleanser", "gentle", "sensitive-skin"],
  },
  {
    title: "Advanced Snail 96 Mucin Power Essence",
    handle: "cosrx-snail-96-mucin-essence",
    subtitle: "100ml",
    description:
      "Iconic snail essence with 96% snail secretion filtrate. Deeply hydrates, repairs damaged skin, and fades blemish marks overnight.",
    brand_handle: "cosrx",
    category_handle: "skincare-face-serum",
    origin_country: "KR",
    price_bdt: 1700,
    weight_g: 120,
    tags: ["snail", "serum", "hydrating", "repair"],
  },
  {
    title: "Advanced Snail 92 All In One Cream",
    handle: "cosrx-snail-92-all-in-one-cream",
    subtitle: "100g",
    description:
      "Multi-purpose gel-cream with 92% snail secretion filtrate. Moisturises, soothes, and helps with post-acne marks and daily repair.",
    brand_handle: "cosrx",
    category_handle: "cream-moisturiser",
    origin_country: "KR",
    price_bdt: 1800,
    sale_price_bdt: 1700,
    weight_g: 115,
    tags: ["snail", "moisturiser", "all-in-one", "repair"],
  },
  {
    title: "The Niacinamide 15 Serum",
    handle: "cosrx-niacinamide-15-serum",
    subtitle: "20ml",
    description:
      "High-strength 15% niacinamide serum for brightening, minimising pores, and controlling sebum. Lightweight, fast-absorbing formula.",
    brand_handle: "cosrx",
    category_handle: "niacinamide-serum",
    origin_country: "KR",
    price_bdt: 1600,
    weight_g: 35,
    tags: ["niacinamide", "serum", "brightening", "pores"],
  },

  // ── BEAUTY OF JOSEON ──────────────────────────────────────────────────────
  {
    title: "Ginseng Essence Water",
    handle: "boj-ginseng-essence-water",
    subtitle: "150ml",
    description:
      "A lightweight essence-toner fusion infused with niacinamide and ginseng root extract. Brightens and firms while delivering deep hydration.",
    brand_handle: "beauty-of-joseon",
    category_handle: "hydrating-toner",
    origin_country: "KR",
    price_bdt: 1700,
    weight_g: 170,
    tags: ["ginseng", "toner", "brightening", "hanbang"],
  },
  {
    title: "Calming Serum: Green Tea + Panthenol",
    handle: "boj-calming-serum-green-tea",
    subtitle: "30ml",
    description:
      "A soothing serum with 71% Camellia sinensis leaf water and panthenol. Calms redness, repairs barrier, and keeps skin consistently comfortable.",
    brand_handle: "beauty-of-joseon",
    category_handle: "skincare-face-serum",
    origin_country: "KR",
    price_bdt: 1700,
    sale_price_bdt: 1500,
    weight_g: 45,
    tags: ["green-tea", "serum", "calming", "sensitive"],
  },
  {
    title: "Revive Serum: Ginseng + Snail Mucin",
    handle: "boj-revive-serum-ginseng-snail",
    subtitle: "30ml",
    description:
      "A revitalising serum combining niacinamide, ginseng, and snail mucin. Improves skin texture, boosts radiance, and fades dark spots.",
    brand_handle: "beauty-of-joseon",
    category_handle: "skincare-face-serum",
    origin_country: "KR",
    price_bdt: 1700,
    sale_price_bdt: 1500,
    weight_g: 45,
    tags: ["ginseng", "snail", "serum", "brightening"],
  },
  {
    title: "Red Bean Water Gel",
    handle: "boj-red-bean-water-gel",
    subtitle: "100ml",
    description:
      "A light, water-gel moisturiser with 63% red bean water. Provides deep hydration without heaviness — perfect for combination to oily skin.",
    brand_handle: "beauty-of-joseon",
    category_handle: "gel-moisturiser",
    origin_country: "KR",
    price_bdt: 1800,
    weight_g: 115,
    tags: ["red-bean", "gel", "moisturiser", "lightweight"],
  },
  {
    title: "Ginseng Cleansing Oil",
    handle: "boj-ginseng-cleansing-oil",
    subtitle: "210ml",
    description:
      "First-step cleanser for the double-cleanse method. Dissolves sunscreen and makeup while nourishing with ginseng and squalane.",
    brand_handle: "beauty-of-joseon",
    category_handle: "oil-cleanser",
    origin_country: "KR",
    price_bdt: 1800,
    weight_g: 230,
    tags: ["cleansing-oil", "double-cleanse", "ginseng"],
  },
  {
    title: "Revive Eye Serum",
    handle: "boj-revive-eye-serum",
    subtitle: "30ml",
    description:
      "Targeted eye serum with adenosine and niacinamide for fine lines, dark circles, and puffiness. Gentle enough for the delicate eye area.",
    brand_handle: "beauty-of-joseon",
    category_handle: "eye-serum",
    origin_country: "KR",
    price_bdt: 1700,
    weight_g: 40,
    tags: ["eye-serum", "anti-aging", "dark-circles"],
  },
  {
    title: "Green Plum Refreshing Toner AHA+BHA",
    handle: "boj-green-plum-toner-aha-bha",
    subtitle: "100ml",
    description:
      "Exfoliating toner with green plum extract, AHA, and BHA. Gently resurfaces, unclogs pores, and refines texture for a clearer complexion.",
    brand_handle: "beauty-of-joseon",
    category_handle: "exfoliating-toner",
    origin_country: "KR",
    price_bdt: 1700,
    weight_g: 115,
    tags: ["aha", "bha", "exfoliating-toner", "pores"],
  },
  {
    title: "Radiance Cleansing Balm",
    handle: "boj-radiance-cleansing-balm",
    subtitle: "100ml",
    description:
      "A luxurious cleansing balm with rice bran oil and ginseng. Melts away makeup and impurities while leaving skin soft and luminous.",
    brand_handle: "beauty-of-joseon",
    category_handle: "oil-cleanser",
    origin_country: "KR",
    price_bdt: 1800,
    weight_g: 120,
    tags: ["cleansing-balm", "double-cleanse", "radiance"],
  },
  {
    title: "Centella Asiatica Calming Sheet Mask",
    handle: "boj-centella-sheet-mask",
    subtitle: "Single sheet",
    description:
      "Single-use sheet mask drenched in centella asiatica essence. Intensely soothes irritated skin in 20 minutes.",
    brand_handle: "beauty-of-joseon",
    category_handle: "sheet-masks",
    origin_country: "KR",
    price_bdt: 250,
    weight_g: 30,
    tags: ["sheet-mask", "centella", "soothing"],
  },

  // ── ANUA ──────────────────────────────────────────────────────────────────
  {
    title: "Heartleaf 77% Soothing Toner",
    handle: "anua-heartleaf-77-soothing-toner",
    subtitle: "250ml",
    description:
      "77% heartleaf extract toner that instantly calms redness and irritation. Non-sticky, refreshing formula ideal for reactive skin.",
    brand_handle: "anua",
    category_handle: "hydrating-toner",
    origin_country: "KR",
    price_bdt: 2000,
    weight_g: 270,
    tags: ["heartleaf", "toner", "soothing", "sensitive"],
  },
  {
    title: "Heartleaf 70% Intense Calming Cream",
    handle: "anua-heartleaf-70-calming-cream",
    subtitle: "50ml",
    description:
      "Rich calming cream with 70% heartleaf extract and ceramides. Rebuilds the skin barrier, reduces redness, and hydrates for 72 hours.",
    brand_handle: "anua",
    category_handle: "cream-moisturiser",
    origin_country: "KR",
    price_bdt: 2200,
    weight_g: 65,
    tags: ["heartleaf", "cream", "barrier-repair", "ceramide"],
  },
  {
    title: "Niacinamide 10% + TXA 4% Serum",
    handle: "anua-niacinamide-10-txa-4-serum",
    subtitle: "30ml",
    description:
      "High-potency brightening serum combining 10% niacinamide and 4% tranexamic acid. Fades dark spots and evens complexion in 4 weeks.",
    brand_handle: "anua",
    category_handle: "niacinamide-serum",
    origin_country: "KR",
    price_bdt: 2100,
    weight_g: 40,
    tags: ["niacinamide", "txa", "brightening", "dark-spots"],
  },
  {
    title: "Peach 77 Niacin Enriched Cream",
    handle: "anua-peach-77-niacin-cream",
    subtitle: "50ml",
    description:
      "Creamy moisturiser with 77% peach extract and niacinamide. Brightens, deeply nourishes, and imparts a natural peachy glow.",
    brand_handle: "anua",
    category_handle: "cream-moisturiser",
    origin_country: "KR",
    price_bdt: 2300,
    weight_g: 65,
    tags: ["peach", "niacinamide", "brightening", "cream"],
  },
  {
    title: "Heartleaf 77 Clear Pad",
    handle: "anua-heartleaf-77-clear-pad",
    subtitle: "70 sheets",
    description:
      "Dual-sided exfoliating pads soaked in 77% heartleaf toner. Removes dead skin and excess sebum while calming breakouts.",
    brand_handle: "anua",
    category_handle: "exfoliants-peels",
    origin_country: "KR",
    price_bdt: 2000,
    weight_g: 200,
    tags: ["heartleaf", "pads", "exfoliating", "acne"],
  },
  {
    title: "BHA 2% Gentle Exfoliating Toner",
    handle: "anua-bha-2-exfoliating-toner",
    subtitle: "250ml",
    description:
      "Gentle BHA toner that unclogs pores, smooths texture, and controls sebum without over-drying. Ideal for oily and combination skin.",
    brand_handle: "anua",
    category_handle: "exfoliating-toner",
    origin_country: "KR",
    price_bdt: 2000,
    weight_g: 270,
    tags: ["bha", "toner", "pores", "exfoliating"],
  },
  {
    title: "Rice Enzyme Brightening Cleansing Powder",
    handle: "anua-rice-enzyme-cleansing-powder",
    subtitle: "40g",
    description:
      "Enzyme-powered cleansing powder with rice and papaya extract. Lathers gently to dissolve dead cells and leave skin radiant.",
    brand_handle: "anua",
    category_handle: "foam-cleanser",
    origin_country: "KR",
    price_bdt: 2100,
    weight_g: 55,
    tags: ["enzyme", "cleanser", "brightening", "rice"],
  },
  {
    title: "Heartleaf Pore Control Cleansing Oil",
    handle: "anua-heartleaf-cleansing-oil",
    subtitle: "200ml",
    description:
      "Deep pore-cleansing oil with 77% heartleaf extract. Dissolves sunscreen and makeup while controlling excess sebum.",
    brand_handle: "anua",
    category_handle: "oil-cleanser",
    origin_country: "KR",
    price_bdt: 2000,
    weight_g: 220,
    tags: ["heartleaf", "oil-cleanser", "pores", "double-cleanse"],
  },
  {
    title: "Peach 70% Niacinamide Serum",
    handle: "anua-peach-70-niacinamide-serum",
    subtitle: "30ml",
    description:
      "Brightening serum with 70% peach extract and niacinamide. Visibly evens skin tone and boosts luminosity.",
    brand_handle: "anua",
    category_handle: "niacinamide-serum",
    origin_country: "KR",
    price_bdt: 2000,
    weight_g: 40,
    tags: ["peach", "niacinamide", "brightening", "serum"],
  },
  {
    title: "PDRN Hyaluronic Acid Capsule 100 Serum",
    handle: "anua-pdrn-ha-capsule-serum",
    subtitle: "30ml",
    description:
      "Advanced repair serum with PDRN, 100% hyaluronic acid, and capsule delivery technology for deep hydration and skin renewal.",
    brand_handle: "anua",
    category_handle: "skincare-face-serum",
    origin_country: "KR",
    price_bdt: 2100,
    weight_g: 40,
    tags: ["pdrn", "hyaluronic-acid", "repair", "serum"],
  },

  // ── SKIN1004 ──────────────────────────────────────────────────────────────
  {
    title: "Madagascar Centella Ampoule",
    handle: "skin1004-centella-ampoule",
    subtitle: "100ml",
    description:
      "100% pure Madagascar centella asiatica extract in a lightweight watery ampoule. Rapidly calms irritation and strengthens the skin barrier.",
    brand_handle: "skin1004",
    category_handle: "skincare-face-serum",
    origin_country: "KR",
    price_bdt: 1800,
    weight_g: 115,
    tags: ["centella", "ampoule", "soothing", "barrier"],
  },
  {
    title: "Madagascar Centella Tone Brightening Capsule Ampoule",
    handle: "skin1004-centella-tone-brightening-ampoule",
    subtitle: "55ml",
    description:
      "Dual-phase brightening ampoule with centella and niacinamide capsules. Shake to activate and apply for visible brightening.",
    brand_handle: "skin1004",
    category_handle: "skincare-face-serum",
    origin_country: "KR",
    price_bdt: 2000,
    weight_g: 70,
    tags: ["centella", "brightening", "capsule", "niacinamide"],
  },
  {
    title: "Madagascar Centella Hyalu-Cica Water-Fit Sun Serum SPF 50+",
    handle: "skin1004-centella-sun-serum-spf50",
    subtitle: "50ml",
    description:
      "Lightweight sun serum with centella, hyaluronic acid, and SPF 50+ PA++++. Protects and hydrates without white cast.",
    brand_handle: "skin1004",
    category_handle: "sunscreen-spf-50-plus",
    origin_country: "KR",
    price_bdt: 2000,
    weight_g: 65,
    tags: ["sunscreen", "spf50", "centella", "serum"],
  },
  {
    title: "Madagascar Centella Air-Fit Sun Cream Plus SPF 50+",
    handle: "skin1004-centella-sun-cream-spf50",
    subtitle: "35g",
    description:
      "Airy, non-greasy sun cream with centella asiatica. SPF 50+ PA++++ protection with a soft-matte, comfortable finish.",
    brand_handle: "skin1004",
    category_handle: "sunscreen-spf-50-plus",
    origin_country: "KR",
    price_bdt: 1900,
    weight_g: 50,
    tags: ["sunscreen", "spf50", "centella", "matte"],
  },

  // ── I'M FROM ──────────────────────────────────────────────────────────────
  {
    title: "Rice Toner",
    handle: "im-from-rice-toner",
    subtitle: "150ml",
    description:
      "Brightening toner with 77.78% rice extract and niacinamide. Smooths uneven texture, evens skin tone, and delivers intense hydration.",
    brand_handle: "im-from",
    category_handle: "hydrating-toner",
    origin_country: "KR",
    price_bdt: 2200,
    weight_g: 170,
    tags: ["rice", "toner", "brightening", "niacinamide"],
  },
  {
    title: "Mugwort Essence",
    handle: "im-from-mugwort-essence",
    subtitle: "30ml",
    description:
      "100% mugwort essence for calming acne-prone and sensitive skin. Reduces redness and controls excess oil production.",
    brand_handle: "im-from",
    category_handle: "skincare-face-serum",
    origin_country: "KR",
    price_bdt: 2000,
    weight_g: 45,
    tags: ["mugwort", "essence", "acne", "soothing"],
  },
  {
    title: "Honey Serum",
    handle: "im-from-honey-serum",
    subtitle: "30ml",
    description:
      "Rich serum with 38.7% honey for intense nourishment and repair. Deeply moisturises dry and dehydrated skin overnight.",
    brand_handle: "im-from",
    category_handle: "skincare-face-serum",
    origin_country: "KR",
    price_bdt: 2200,
    weight_g: 45,
    tags: ["honey", "serum", "nourishing", "dry-skin"],
  },
  {
    title: "Vitamin Tree Water-Gel",
    handle: "im-from-vitamin-tree-water-gel",
    subtitle: "75ml",
    description:
      "Refreshing water-gel moisturiser powered by vitamin tree (sea buckthorn) extract. Brightens, hydrates, and provides antioxidant protection.",
    brand_handle: "im-from",
    category_handle: "gel-moisturiser",
    origin_country: "KR",
    price_bdt: 2300,
    weight_g: 90,
    tags: ["vitamin-tree", "gel", "brightening", "antioxidant"],
  },

  // ── MEDICUBE ──────────────────────────────────────────────────────────────
  {
    title: "Kojic Acid Turmeric Niacinamide Serum",
    handle: "medicube-kojic-acid-turmeric-serum",
    subtitle: "30ml",
    description:
      "Triple-brightening serum with kojic acid, turmeric, and 10% niacinamide. Targets stubborn hyperpigmentation and uneven skin tone.",
    brand_handle: "medicube",
    category_handle: "niacinamide-serum",
    origin_country: "KR",
    price_bdt: 2000,
    weight_g: 40,
    tags: ["kojic-acid", "turmeric", "niacinamide", "brightening"],
  },
  {
    title: "PDRN Pink Collagen Capsule Cream",
    handle: "medicube-pdrn-pink-collagen-cream",
    subtitle: "55g",
    description:
      "Capsule cream with PDRN, collagen, and niacinamide. Firms skin, improves elasticity, and brightens with a luxurious pink hue.",
    brand_handle: "medicube",
    category_handle: "cream-moisturiser",
    origin_country: "KR",
    price_bdt: 2200,
    sale_price_bdt: 2100,
    weight_g: 70,
    tags: ["pdrn", "collagen", "anti-aging", "cream"],
  },
  {
    title: "TXA Niacinamide Capsule Cream",
    handle: "medicube-txa-niacinamide-capsule-cream",
    subtitle: "55g",
    description:
      "Brightening capsule cream with tranexamic acid and niacinamide. Delivers active ingredients directly to dark spots for targeted brightening.",
    brand_handle: "medicube",
    category_handle: "cream-moisturiser",
    origin_country: "KR",
    price_bdt: 2500,
    sale_price_bdt: 2400,
    weight_g: 70,
    tags: ["txa", "niacinamide", "brightening", "capsule"],
  },
  {
    title: "Deep Vita C Capsule Cream",
    handle: "medicube-deep-vita-c-capsule-cream",
    subtitle: "55g",
    description:
      "Vitamin C capsule cream with 10% ascorbic acid. Brightens, protects from free radicals, and improves skin radiance.",
    brand_handle: "medicube",
    category_handle: "cream-moisturiser",
    origin_country: "KR",
    price_bdt: 2500,
    weight_g: 70,
    tags: ["vitamin-c", "brightening", "capsule", "antioxidant"],
  },

  // ── COS DE BAHA ───────────────────────────────────────────────────────────
  {
    title: "Tranexamic Acid + Niacinamide Serum (TN)",
    handle: "cosde-tn-tranexamic-niacinamide-serum",
    subtitle: "30ml",
    description:
      "Budget-friendly brightening serum with tranexamic acid and niacinamide. Fades dark spots, reduces hyperpigmentation, and evens tone.",
    brand_handle: "cos-de-baha",
    category_handle: "niacinamide-serum",
    origin_country: "KR",
    price_bdt: 1200,
    sale_price_bdt: 1100,
    weight_g: 35,
    tags: ["tranexamic-acid", "niacinamide", "brightening"],
  },
  {
    title: "Salicylic Acid BHA 4% Serum (S4)",
    handle: "cosde-s4-salicylic-acid-bha-serum",
    subtitle: "30ml",
    description:
      "4% salicylic acid serum that deeply unclogs pores, controls sebum, and prevents breakouts. Ideal for oily and acne-prone skin.",
    brand_handle: "cos-de-baha",
    category_handle: "skincare-face-serum",
    origin_country: "KR",
    price_bdt: 1200,
    weight_g: 35,
    tags: ["salicylic-acid", "bha", "acne", "pores"],
  },
  {
    title: "Vitamin C 15% Serum (VC)",
    handle: "cosde-vc-vitamin-c-15-serum",
    subtitle: "30ml",
    description:
      "15% L-ascorbic acid vitamin C serum for brightening, antioxidant protection, and collagen stimulation. Fragrance-free.",
    brand_handle: "cos-de-baha",
    category_handle: "vitamin-c-serum",
    origin_country: "KR",
    price_bdt: 1200,
    sale_price_bdt: 1100,
    weight_g: 35,
    tags: ["vitamin-c", "brightening", "antioxidant"],
  },
  {
    title: "Niacinamide 10% + Zinc 1% Serum",
    handle: "cosde-niacinamide-10-zinc-serum",
    subtitle: "30ml",
    description:
      "Classic niacinamide and zinc serum for pore minimising, oil control, and brightening. An essential in any routine.",
    brand_handle: "cos-de-baha",
    category_handle: "niacinamide-serum",
    origin_country: "KR",
    price_bdt: 1200,
    weight_g: 35,
    tags: ["niacinamide", "zinc", "pores", "oil-control"],
  },
  {
    title: "Retinol 2.5% Serum (RS)",
    handle: "cosde-rs-retinol-2-5-serum",
    subtitle: "30ml",
    description:
      "2.5% retinol serum for anti-ageing, texture improvement, and stimulating cell turnover. For night-time use.",
    brand_handle: "cos-de-baha",
    category_handle: "skincare-face-serum",
    origin_country: "KR",
    price_bdt: 1200,
    weight_g: 35,
    tags: ["retinol", "anti-aging", "night", "actives"],
  },

  // ── ROUND LAB ─────────────────────────────────────────────────────────────
  {
    title: "1025 Dokdo Toner",
    handle: "roundlab-1025-dokdo-toner",
    subtitle: "200ml",
    description:
      "Hydrating toner with Dokdo deep-sea water and 14 natural minerals. Plumps, soothes, and strengthens the skin barrier.",
    brand_handle: "round-lab",
    category_handle: "hydrating-toner",
    origin_country: "KR",
    price_bdt: 1700,
    weight_g: 220,
    tags: ["dokdo", "toner", "hydrating", "minerals"],
  },
  {
    title: "Birch Moisturizing Sunscreen SPF 50+ PA++++",
    handle: "roundlab-birch-sunscreen-spf50",
    subtitle: "50ml",
    description:
      "Moisturising mineral sunscreen with birch sap extract. SPF 50+ PA++++, lightweight texture, no white cast.",
    brand_handle: "round-lab",
    category_handle: "sunscreen-spf-50-plus",
    origin_country: "KR",
    price_bdt: 1700,
    weight_g: 65,
    tags: ["sunscreen", "spf50", "birch", "mineral"],
  },
  {
    title: "1025 Dokdo Cleanser",
    handle: "roundlab-1025-dokdo-cleanser",
    subtitle: "150ml",
    description:
      "Gentle foam cleanser with Dokdo sea water. Removes impurities while maintaining the skin's natural moisture balance.",
    brand_handle: "round-lab",
    category_handle: "foam-cleanser",
    origin_country: "KR",
    price_bdt: 1700,
    sale_price_bdt: 1500,
    weight_g: 170,
    tags: ["dokdo", "cleanser", "gentle", "hydrating"],
  },

  // ── KLAIRS ────────────────────────────────────────────────────────────────
  {
    title: "Supple Preparation Unscented Toner",
    handle: "klairs-supple-prep-unscented-toner",
    subtitle: "180ml",
    description:
      "The original fragrance-free hydrating toner. 6 types of hyaluronic acid deliver plumping hydration for all skin types.",
    brand_handle: "klairs",
    category_handle: "hydrating-toner",
    origin_country: "KR",
    price_bdt: 1800,
    weight_g: 200,
    tags: ["toner", "fragrance-free", "hyaluronic-acid", "sensitive"],
  },
  {
    title: "Midnight Blue Calming Cream",
    handle: "klairs-midnight-blue-calming-cream-60",
    subtitle: "60ml",
    description:
      "Iconic blue calming cream with guaiazulene and centella. Soothes stressed, sensitive skin and reduces redness overnight.",
    brand_handle: "klairs",
    category_handle: "cream-moisturiser",
    origin_country: "KR",
    price_bdt: 2500,
    weight_g: 75,
    tags: ["calming", "cream", "guaiazulene", "sensitive"],
  },
  {
    title: "Gentle Black Deep Cleansing Oil",
    handle: "klairs-gentle-black-deep-cleansing-oil",
    subtitle: "150ml",
    description:
      "Deep-cleansing black oil with charcoal and black rice extracts. Dissolves makeup, sunscreen, and impurities without leaving residue.",
    brand_handle: "klairs",
    category_handle: "oil-cleanser",
    origin_country: "KR",
    price_bdt: 2000,
    weight_g: 170,
    tags: ["cleansing-oil", "charcoal", "deep-cleanse"],
  },

  // ── BY WISHTREND ──────────────────────────────────────────────────────────
  {
    title: "Mandelic Acid 5% Skin Prep Water",
    handle: "byw-mandelic-acid-5-skin-prep",
    subtitle: "120ml",
    description:
      "Gentle AHA exfoliating toner with 5% mandelic acid. Smooths texture, minimises pores, and brightens with minimal irritation.",
    brand_handle: "by-wishtrend",
    category_handle: "exfoliating-toner",
    origin_country: "KR",
    price_bdt: 1800,
    weight_g: 135,
    tags: ["mandelic-acid", "aha", "exfoliating", "toner"],
  },
  {
    title: "Vitamin 75 Maximizing Cream",
    handle: "byw-vitamin-75-maximizing-cream",
    subtitle: "50g",
    description:
      "Brightening moisturiser with 75% Ascorbyl Glucoside vitamin C complex. Maximises radiance and protects against oxidative stress.",
    brand_handle: "by-wishtrend",
    category_handle: "cream-moisturiser",
    origin_country: "KR",
    price_bdt: 2400,
    sale_price_bdt: 2200,
    weight_g: 65,
    tags: ["vitamin-c", "brightening", "cream", "antioxidant"],
  },
  {
    title: "Vitamin A-mazing Bakuchiol Night Cream",
    handle: "byw-bakuchiol-night-cream",
    subtitle: "30g",
    description:
      "Retinol alternative night cream with plant-based bakuchiol and vitamin A. Reduces fine lines and improves skin renewal gently.",
    brand_handle: "by-wishtrend",
    category_handle: "night-cream",
    origin_country: "KR",
    price_bdt: 3200,
    sale_price_bdt: 3000,
    weight_g: 45,
    tags: ["bakuchiol", "retinol-alternative", "night-cream", "anti-aging"],
  },

  // ── BANILA CO ─────────────────────────────────────────────────────────────
  {
    title: "Clean It Zero Cleansing Balm Original",
    handle: "banilaco-clean-it-zero-original",
    subtitle: "100ml",
    description:
      "The iconic pink cleansing balm. Melts away all makeup including waterproof formulas. Leaves skin clean and soft.",
    brand_handle: "banila-co",
    category_handle: "oil-cleanser",
    origin_country: "KR",
    price_bdt: 1900,
    weight_g: 115,
    tags: ["cleansing-balm", "makeup-remover", "double-cleanse"],
  },
  {
    title: "Clean It Zero Cleansing Balm Purifying",
    handle: "banilaco-clean-it-zero-purifying",
    subtitle: "100ml",
    description:
      "Purifying version of the cult cleansing balm with kaolin clay. Deeply cleanses pores while removing makeup and sunscreen.",
    brand_handle: "banila-co",
    category_handle: "oil-cleanser",
    origin_country: "KR",
    price_bdt: 1900,
    weight_g: 115,
    tags: ["cleansing-balm", "purifying", "pores", "kaolin"],
  },

  // ── SKINFOOD ──────────────────────────────────────────────────────────────
  {
    title: "Black Sugar Perfect Essential Scrub 2X",
    handle: "skinfood-black-sugar-scrub-2x",
    subtitle: "210g",
    description:
      "Bestselling exfoliating scrub with real black sugar crystals and caramel. Sloughs away dead skin for smooth, luminous skin.",
    brand_handle: "skinfood",
    category_handle: "exfoliants-peels",
    origin_country: "KR",
    price_bdt: 1700,
    weight_g: 230,
    tags: ["black-sugar", "scrub", "exfoliating", "brightening"],
  },
  {
    title: "Rice Mask Wash Off",
    handle: "skinfood-rice-mask-wash-off",
    subtitle: "120g",
    description:
      "Clay mask enriched with rice water and glutinous rice extract. Purifies pores and brightens for a smooth, refined complexion.",
    brand_handle: "skinfood",
    category_handle: "clay-masks",
    origin_country: "KR",
    price_bdt: 1200,
    weight_g: 135,
    tags: ["rice", "mask", "clay", "brightening"],
  },

  // ── ISNTREE ───────────────────────────────────────────────────────────────
  {
    title: "Hyaluronic Acid Watery Sun Gel SPF 50+ PA++++",
    handle: "isntree-ha-watery-sun-gel-spf50",
    subtitle: "50ml",
    description:
      "Ultra-lightweight water-gel sunscreen with hyaluronic acid. SPF 50+ PA++++, hydrating, zero white cast — daily must-have.",
    brand_handle: "isntree",
    category_handle: "sunscreen-spf-50-plus",
    origin_country: "KR",
    price_bdt: 1700,
    weight_g: 65,
    tags: ["sunscreen", "spf50", "hyaluronic-acid", "gel"],
  },
  {
    title: "Aloe Soothing Sun Cream SPF 50+ PA++++",
    handle: "isntree-aloe-sun-cream-spf50",
    subtitle: "50ml",
    description:
      "Soothing sunscreen with 70% aloe vera juice. Calms sensitive and sun-exposed skin while providing broad-spectrum SPF 50+ protection.",
    brand_handle: "isntree",
    category_handle: "sunscreen-spf-50-plus",
    origin_country: "KR",
    price_bdt: 1700,
    weight_g: 65,
    tags: ["sunscreen", "spf50", "aloe", "soothing"],
  },

  // ── AROMATICA ─────────────────────────────────────────────────────────────
  {
    title: "Quinoa Protein Shampoo",
    handle: "aromatica-quinoa-protein-shampoo",
    subtitle: "400ml",
    description:
      "Sulphate-free protein shampoo with quinoa and argan oil. Strengthens weak, damaged hair and adds shine without weighing it down.",
    brand_handle: "aromatica",
    category_handle: "sulphate-free-shampoo",
    origin_country: "KR",
    price_bdt: 2200,
    weight_g: 430,
    tags: ["shampoo", "quinoa", "protein", "sulphate-free"],
  },
  {
    title: "Rosemary Scalp Scaling Shampoo",
    handle: "aromatica-rosemary-scalp-shampoo",
    subtitle: "400ml",
    description:
      "Gentle scalp-clarifying shampoo with rosemary, salicylic acid, and AHA. Removes buildup and stimulates a healthy scalp environment.",
    brand_handle: "aromatica",
    category_handle: "sulphate-free-shampoo",
    origin_country: "KR",
    price_bdt: 2200,
    weight_g: 430,
    tags: ["shampoo", "rosemary", "scalp", "clarifying"],
  },

  // ── PURITO ────────────────────────────────────────────────────────────────
  {
    title: "Centella Green Level Safe Sun SPF 50+ PA++++",
    handle: "purito-centella-safe-sun-spf50",
    subtitle: "60ml",
    description:
      "Reef-safe, vegan sunscreen with centella asiatica. Broad-spectrum SPF 50+ PA++++ — gentle enough for sensitive and post-procedure skin.",
    brand_handle: "purito",
    category_handle: "sunscreen-spf-50-plus",
    origin_country: "KR",
    price_bdt: 1800,
    weight_g: 75,
    tags: ["sunscreen", "spf50", "reef-safe", "centella", "vegan"],
  },
  {
    title: "From Green Buffet Serum",
    handle: "purito-from-green-buffet-serum",
    subtitle: "60ml",
    description:
      "Multi-peptide and green ingredient serum with centella, hyaluronic acid, and ceramides. Plumps, hydrates, and improves skin resilience.",
    brand_handle: "purito",
    category_handle: "skincare-face-serum",
    origin_country: "KR",
    price_bdt: 2000,
    weight_g: 75,
    tags: ["peptide", "serum", "centella", "ceramide"],
  },
]

export default async function seedProducts({ container }: ExecArgs) {
  const productService: IProductModuleService = container.resolve(
    Modules.PRODUCT
  )
  const pricingService: IPricingModuleService = container.resolve(
    Modules.PRICING
  )

  console.log("Seeding products…")

  // ── Load collections (brands) keyed by handle ──────────────────────────
  const allCollections = await productService.listProductCollections({})
  const collectionByHandle: Record<string, string> = {}
  for (const col of allCollections) {
    collectionByHandle[col.handle] = col.id
  }

  // ── Load product categories keyed by handle ────────────────────────────
  const allCategories = await productService.listProductCategories({})
  const categoryByHandle: Record<string, string> = {}
  for (const cat of allCategories) {
    if (cat.handle) {
      categoryByHandle[cat.handle] = cat.id
    }
  }

  let created = 0
  let skipped = 0
  let errors = 0

  for (const p of PRODUCTS) {
    try {
      // Check if product already exists
      const existing = await productService.listProducts({ handle: [p.handle] })
      if (existing.length > 0) {
        console.log(`  Skipped (exists): ${p.handle}`)
        skipped++
        continue
      }

      const collectionId = collectionByHandle[p.brand_handle]
      const categoryId = categoryByHandle[p.category_handle]

      if (!collectionId) {
        console.warn(
          `  Warning: brand collection '${p.brand_handle}' not found — run seed-brands.ts first`
        )
      }

      // Build tags array
      const tagValues = [
        ...(p.tags ?? []),
        `brand:${p.brand_handle}`,
        `origin:${p.origin_country.toLowerCase()}`,
      ]

      // Create the product
      const product = await productService.createProducts([
        {
          title: p.title,
          handle: p.handle,
          subtitle: p.subtitle,
          description: p.description,
          status: "published",
          collection_id: collectionId ?? undefined,
          category_ids: categoryId ? [categoryId] : undefined,
          origin_country: p.origin_country,
          weight: p.weight_g,
          images: p.images?.map((url) => ({ url })) ?? [],
          options: [
            {
              title: "Size",
              values: [p.subtitle ?? "Standard"],
            },
          ],
          variants: [
            {
              title: p.subtitle ?? "Standard",
              sku: p.handle.toUpperCase().replace(/-/g, "_"),
              manage_inventory: false,
              options: { Size: p.subtitle ?? "Standard" },
            },
          ],
          metadata: {
            brand: p.brand_handle,
            origin_country: p.origin_country,
            has_discount: !!p.sale_price_bdt,
            tags: tagValues,
          },
        },
      ])

      console.log(`  Created product: ${p.title} (id: ${product[0].id})`)

      // ── Create price set for this variant ───────────────────────────────
      const variantId = product[0].variants?.[0]?.id
      if (variantId) {
        const prices = [
          {
            currency_code: "bdt",
            amount: p.price_bdt,
          },
        ]

        if (p.sale_price_bdt) {
          // Add a sale price at lower amount — in Medusa v2 the lowest applicable price wins
          prices.push({
            currency_code: "bdt",
            amount: p.sale_price_bdt,
          })
        }

        try {
          const priceSet = await pricingService.createPriceSets([
            { prices },
          ])

          // Link variant to price set via remote link (best-effort)
          // Full linking requires the remoteLink service; here we store price_set_id in metadata
          await productService.updateProductVariants(variantId, {
            metadata: {
              price_set_id: priceSet[0].id,
              price_bdt: p.price_bdt,
              sale_price_bdt: p.sale_price_bdt ?? null,
            },
          })

          console.log(`    Prices set: ৳${p.price_bdt}${p.sale_price_bdt ? ` → ৳${p.sale_price_bdt}` : ""}`)
        } catch (priceErr) {
          console.warn(`    Warning: could not create prices for ${p.handle}:`, priceErr)
        }
      }

      created++
    } catch (err) {
      console.error(`  Error creating product ${p.handle}:`, err)
      errors++
    }
  }

  console.log(
    `\nProduct seeding complete. Created: ${created}, Skipped: ${skipped}, Errors: ${errors}`
  )
}
