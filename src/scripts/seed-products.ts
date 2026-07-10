/**
 * Seed script: creates K-beauty products based on ksecretbeautybd.com inventory.
 * Prices are in BDT (Bangladeshi Taka).
 *
 * Prerequisites:
 *   - seed-brands.ts must have been run first (collections must exist)
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
  origin_country: string
  price_bdt: number
  sale_price_bdt?: number
}

function inferCategoryHandles(title: string): string[] {
  const t = title.toLowerCase()
  const cats: string[] = ['skincare']

  if (t.includes('shampoo') || (t.includes('hair') && !t.includes('skin'))) return ['hair-care', 'shampoo']
  if (t.includes('body lotion') || t.includes('body cream') || t.includes('body wash')) return ['body-care']

  if (t.includes('sun stick')) { cats.push('sun-stick', 'sunscreen'); return [...new Set(cats)] }
  if (t.includes('sunscreen') || t.includes('sun cream') || t.includes('spf') || /\buv\b/.test(t)) cats.push('sunscreen')
  if (t.includes('sheet mask')) { cats.push('sheet-mask', 'face-mask'); return [...new Set(cats)] }
  if ((t.includes('mask') || t.includes(' pad ') || t.endsWith('pad') || /\bpads?\b/.test(t)) && !t.includes('eye pad')) cats.push('face-mask')
  if (t.includes('eye')) cats.push('eye-care')
  if (t.includes('cleansing oil') || t.includes('oil cleanser') || (t.includes('cleansing') && t.includes('oil'))) { cats.push('oil-cleanser', 'cleanser'); return [...new Set(cats)] }
  if (t.includes('cleansing balm') || t.includes('balm cleanser')) { cats.push('cleansing-balm', 'cleanser'); return [...new Set(cats)] }
  if (t.includes('foam') || t.includes('cleanser') || t.includes('face wash') || (t.includes('cleansing') && !cats.includes('oil-cleanser'))) cats.push('cleanser')
  if (t.includes('toner') || t.includes('softener') || (t.includes('essence') && !t.includes('serum'))) cats.push('toner')
  if (t.includes('ampoule') || t.includes('ampule')) cats.push('ampule')
  else if (t.includes('serum')) cats.push('serum')
  if (t.includes('gel') && (t.includes('cream') || t.includes('moisturizer') || t.includes('moisture'))) { cats.push('gel-moisturizer', 'moisturizer'); return [...new Set(cats)] }
  if (t.includes('cream') || t.includes('moisturizer') || t.includes('lotion') || t.includes('emulsion') || t.includes('barrier')) cats.push('moisturizer')

  return [...new Set(cats)]
}

const PRODUCTS: ProductSeedData[] = [
  // ── ANUA ──────────────────────────────────────────────────────────────────
  {
    title: "ANUA Heartleaf 77 Clear Pad 70 Sheets",
    handle: "anua-heartleaf-77-clear-pad-70-sheets",
    subtitle: "70 Sheets",
    brand_handle: "anua",
    origin_country: "KR",
    price_bdt: 2000,
  },
  {
    title: "ANUA Niacinamide 10% + TXA 4% Serum 30ml",
    handle: "anua-niacinamide-10-txa-4-serum-30ml",
    subtitle: "30ml",
    brand_handle: "anua",
    origin_country: "KR",
    price_bdt: 2300,
    sale_price_bdt: 2100,
  },
  {
    title: "ANUA Heartleaf 70% Intense Calming Cream 50ml",
    handle: "anua-heartleaf-70-intense-calming-cream-50ml",
    subtitle: "50ml",
    brand_handle: "anua",
    origin_country: "KR",
    price_bdt: 2200,
  },
  {
    title: "ANUA Peach 77 Niacin Enriched Cream 50ml",
    handle: "anua-peach-77-niacin-enriched-cream-50ml",
    subtitle: "50ml",
    brand_handle: "anua",
    origin_country: "KR",
    price_bdt: 2300,
  },
  {
    title: "ANUA Heartleaf Quercetinol Pore Deep Cleansing Foam 150ml",
    handle: "anua-heartleaf-quercetinol-pore-deep-cleansing-foam-150ml",
    subtitle: "150ml",
    brand_handle: "anua",
    origin_country: "KR",
    price_bdt: 1500,
  },
  {
    title: "ANUA Heartleaf 77% Soothing Toner 250ml",
    handle: "anua-heartleaf-77-soothing-toner-250ml",
    subtitle: "250ml",
    brand_handle: "anua",
    origin_country: "KR",
    price_bdt: 2000,
  },
  {
    title: "ANUA Heartleaf Pore Control Cleansing Oil 200ml",
    handle: "anua-heartleaf-pore-control-cleansing-oil-200ml",
    subtitle: "200ml",
    brand_handle: "anua",
    origin_country: "KR",
    price_bdt: 2000,
  },
  {
    title: "ANUA Heartleaf 80% Moisture Soothing Ampoule",
    handle: "anua-heartleaf-80-moisture-soothing-ampoule",
    brand_handle: "anua",
    origin_country: "KR",
    price_bdt: 2000,
    sale_price_bdt: 1750,
  },
  {
    title: "ANUA 8 Hyaluronic Acid Moisturizing Gentle Gel Cleanser",
    handle: "anua-8-hyaluronic-acid-moisturizing-gentle-gel-cleanser",
    brand_handle: "anua",
    origin_country: "KR",
    price_bdt: 1500,
  },
  {
    title: "ANUA Peach 70% Niacinamide Serum 30ml",
    handle: "anua-peach-70-niacinamide-serum-30ml",
    subtitle: "30ml",
    brand_handle: "anua",
    origin_country: "KR",
    price_bdt: 2000,
  },
  {
    title: "ANUA PDRN Hyaluronic Acid Capsule 100 Serum 30ml",
    handle: "anua-pdrn-hyaluronic-acid-capsule-100-serum-30ml",
    subtitle: "30ml",
    brand_handle: "anua",
    origin_country: "KR",
    price_bdt: 2100,
  },
  {
    title: "ANUA Azelaic Acid 10 Hyaluron Redness Soothing Serum 30ml",
    handle: "anua-azelaic-acid-10-hyaluron-redness-soothing-serum-30ml",
    subtitle: "30ml",
    brand_handle: "anua",
    origin_country: "KR",
    price_bdt: 2100,
  },
  {
    title: "ANUA Rice 70 Glow Milky Toner 250ml",
    handle: "anua-rice-70-glow-milky-toner-250ml",
    subtitle: "250ml",
    brand_handle: "anua",
    origin_country: "KR",
    price_bdt: 2200,
  },

  // ── AROMATICA ─────────────────────────────────────────────────────────────
  {
    title: "AROMATICA Quinoa Protein Shampoo 400ml",
    handle: "aromatica-quinoa-protein-shampoo-400ml",
    subtitle: "400ml",
    brand_handle: "aromatica",
    origin_country: "KR",
    price_bdt: 2500,
  },
  {
    title: "AROMATICA Rosemary Root Enhancer 100ml",
    handle: "aromatica-rosemary-root-enhancer-100ml",
    subtitle: "100ml",
    brand_handle: "aromatica",
    origin_country: "KR",
    price_bdt: 1800,
  },
  {
    title: "AROMATICA Rosemary Scalp Scrub 165g",
    handle: "aromatica-rosemary-scalp-scrub-165g",
    subtitle: "165g",
    brand_handle: "aromatica",
    origin_country: "KR",
    price_bdt: 1700,
  },

  // ── ARENCIA ───────────────────────────────────────────────────────────────
  {
    title: "Arencia Rice Mucin Cleanser 120g",
    handle: "arencia-rice-mucin-cleanser-120g",
    subtitle: "120g",
    brand_handle: "arencia",
    origin_country: "KR",
    price_bdt: 2000,
  },
  {
    title: "Arencia Red Smoothie Serum 30 50g",
    handle: "arencia-red-smoothie-serum-30-50g",
    subtitle: "50g",
    brand_handle: "arencia",
    origin_country: "KR",
    price_bdt: 2500,
  },
  {
    title: "Arencia Red Smoothie Serum 8 30ml",
    handle: "arencia-red-smoothie-serum-8-30ml",
    subtitle: "30ml",
    brand_handle: "arencia",
    origin_country: "KR",
    price_bdt: 2500,
  },
  {
    title: "Arencia Fresh Rosehip Mochi Cleanser",
    handle: "arencia-fresh-rosehip-mochi-cleanser",
    brand_handle: "arencia",
    origin_country: "KR",
    price_bdt: 1900,
  },
  {
    title: "Arencia Overnight Red Smoothie Face Mask Serum",
    handle: "arencia-overnight-red-smoothie-face-mask-serum",
    brand_handle: "arencia",
    origin_country: "KR",
    price_bdt: 2100,
  },
  {
    title: "Arencia Fresh Green Rice Mochi Cleanser",
    handle: "arencia-fresh-green-rice-mochi-cleanser",
    brand_handle: "arencia",
    origin_country: "KR",
    price_bdt: 1900,
  },

  // ── AXIS-Y ────────────────────────────────────────────────────────────────
  {
    title: "AXIS-Y TXA 2.5% Intensive Brightening Cream",
    handle: "axis-y-txa-2-5-intensive-brightening-cream",
    brand_handle: "axis-y",
    origin_country: "KR",
    price_bdt: 1800,
    sale_price_bdt: 1700,
  },
  {
    title: "AXIS-Y Dark Spot Correcting Glow Toner 125ml",
    handle: "axis-y-dark-spot-correcting-glow-toner-125ml",
    subtitle: "125ml",
    brand_handle: "axis-y",
    origin_country: "KR",
    price_bdt: 1700,
    sale_price_bdt: 1500,
  },
  {
    title: "AXIS-Y Complete No-Stress Physical Sunscreen V.3 50ml",
    handle: "axis-y-complete-no-stress-physical-sunscreen-v3-50ml",
    subtitle: "50ml",
    brand_handle: "axis-y",
    origin_country: "KR",
    price_bdt: 1700,
    sale_price_bdt: 1500,
  },
  {
    title: "AXIS-Y Vegan Collagen Eye Serum 10ml",
    handle: "axis-y-vegan-collagen-eye-serum-10ml",
    subtitle: "10ml",
    brand_handle: "axis-y",
    origin_country: "KR",
    price_bdt: 1700,
    sale_price_bdt: 1500,
  },
  {
    title: "AXIS-Y New Skin Resolution Gel Mask 100ml",
    handle: "axis-y-new-skin-resolution-gel-mask-100ml",
    subtitle: "100ml",
    brand_handle: "axis-y",
    origin_country: "KR",
    price_bdt: 1700,
    sale_price_bdt: 1600,
  },
  {
    title: "AXIS-Y Dark Spot Correcting Glow Cream 50ml",
    handle: "axis-y-dark-spot-correcting-glow-cream-50ml",
    subtitle: "50ml",
    brand_handle: "axis-y",
    origin_country: "KR",
    price_bdt: 1900,
    sale_price_bdt: 1700,
  },
  {
    title: "AXIS-Y Quinoa One Step Balanced Gel Cleanser 180ml",
    handle: "axis-y-quinoa-one-step-balanced-gel-cleanser-180ml",
    subtitle: "180ml",
    brand_handle: "axis-y",
    origin_country: "KR",
    price_bdt: 1700,
  },
  {
    title: "AXIS-Y Daily Purifying Treatment Toner 200ml",
    handle: "axis-y-daily-purifying-treatment-toner-200ml",
    subtitle: "200ml",
    brand_handle: "axis-y",
    origin_country: "KR",
    price_bdt: 1700,
  },
  {
    title: "AXIS-Y Sunday Morning Refreshing Cleansing Foam 120ml",
    handle: "axis-y-sunday-morning-refreshing-cleansing-foam-120ml",
    subtitle: "120ml",
    brand_handle: "axis-y",
    origin_country: "KR",
    price_bdt: 1700,
  },
  {
    title: "AXIS-Y Biome Ultimate Indulging Cream 55ml",
    handle: "axis-y-biome-ultimate-indulging-cream-55ml",
    subtitle: "55ml",
    brand_handle: "axis-y",
    origin_country: "KR",
    price_bdt: 2100,
    sale_price_bdt: 1800,
  },

  // ── BANILA CO ─────────────────────────────────────────────────────────────
  {
    title: "Banila Co Clean It Zero Nourishing Cleansing Balm 100ml",
    handle: "banila-co-clean-it-zero-nourishing-cleansing-balm-100ml",
    subtitle: "100ml",
    brand_handle: "banila-co",
    origin_country: "KR",
    price_bdt: 1900,
  },
  {
    title: "BANILA CO Clean It Zero Cleansing Balm Purifying 100ml",
    handle: "banila-co-clean-it-zero-cleansing-balm-purifying-100ml",
    subtitle: "100ml",
    brand_handle: "banila-co",
    origin_country: "KR",
    price_bdt: 1900,
  },
  {
    title: "Banila Co Clean It Zero Cleansing Balm Original 100ml",
    handle: "banila-co-clean-it-zero-cleansing-balm-original-100ml",
    subtitle: "100ml",
    brand_handle: "banila-co",
    origin_country: "KR",
    price_bdt: 1900,
  },

  // ── BEAUTY OF JOSEON ──────────────────────────────────────────────────────
  {
    title: "Beauty of Joseon Ginseng Essence Water 150ml",
    handle: "beauty-of-joseon-ginseng-essence-water-150ml",
    subtitle: "150ml",
    brand_handle: "beauty-of-joseon",
    origin_country: "KR",
    price_bdt: 1700,
  },
  {
    title: "Beauty of Joseon Green Plum Refreshing Toner AHA+BHA 100ml",
    handle: "beauty-of-joseon-green-plum-refreshing-toner-aha-bha-100ml",
    subtitle: "100ml",
    brand_handle: "beauty-of-joseon",
    origin_country: "KR",
    price_bdt: 1700,
  },
  {
    title: "Beauty of Joseon Red Bean Water Gel 100ml",
    handle: "beauty-of-joseon-red-bean-water-gel-100ml",
    subtitle: "100ml",
    brand_handle: "beauty-of-joseon",
    origin_country: "KR",
    price_bdt: 1800,
  },
  {
    title: "Beauty of Joseon Calming Serum Green Tea + Panthenol",
    handle: "beauty-of-joseon-calming-serum-green-tea-panthenol",
    brand_handle: "beauty-of-joseon",
    origin_country: "KR",
    price_bdt: 1700,
    sale_price_bdt: 1500,
  },
  {
    title: "Beauty of Joseon Revive Serum Ginseng + Snail Mucin",
    handle: "beauty-of-joseon-revive-serum-ginseng-snail-mucin",
    brand_handle: "beauty-of-joseon",
    origin_country: "KR",
    price_bdt: 1700,
    sale_price_bdt: 1500,
  },
  {
    title: "Beauty of Joseon Ginseng Cleansing Oil 210ml",
    handle: "beauty-of-joseon-ginseng-cleansing-oil-210ml",
    subtitle: "210ml",
    brand_handle: "beauty-of-joseon",
    origin_country: "KR",
    price_bdt: 1800,
  },
  {
    title: "Beauty of Joseon Revive Eye Serum 30ml",
    handle: "beauty-of-joseon-revive-eye-serum-30ml",
    subtitle: "30ml",
    brand_handle: "beauty-of-joseon",
    origin_country: "KR",
    price_bdt: 1700,
  },
  {
    title: "Beauty of Joseon Radiance Cleansing Balm 100ml",
    handle: "beauty-of-joseon-radiance-cleansing-balm-100ml",
    subtitle: "100ml",
    brand_handle: "beauty-of-joseon",
    origin_country: "KR",
    price_bdt: 1800,
  },
  {
    title: "Beauty of Joseon Centella Asiatica Calming Sheet Mask",
    handle: "beauty-of-joseon-centella-asiatica-calming-sheet-mask",
    brand_handle: "beauty-of-joseon",
    origin_country: "KR",
    price_bdt: 250,
  },
  {
    title: "Beauty of Joseon Green Plum Refreshing Cleanser",
    handle: "beauty-of-joseon-green-plum-refreshing-cleanser",
    brand_handle: "beauty-of-joseon",
    origin_country: "KR",
    price_bdt: 1500,
  },
  {
    title: "Beauty of Joseon Red Bean Refreshing Pore Mask",
    handle: "beauty-of-joseon-red-bean-refreshing-pore-mask",
    brand_handle: "beauty-of-joseon",
    origin_country: "KR",
    price_bdt: 2000,
  },
  {
    title: "Beauty of Joseon Dynasty Cream",
    handle: "beauty-of-joseon-dynasty-cream",
    brand_handle: "beauty-of-joseon",
    origin_country: "KR",
    price_bdt: 2000,
  },
  {
    title: "Beauty of Joseon Matte Sun Stick",
    handle: "beauty-of-joseon-matte-sun-stick",
    brand_handle: "beauty-of-joseon",
    origin_country: "KR",
    price_bdt: 1700,
  },
  {
    title: "Beauty of Joseon Glow Serum Rice + Alpha-Arbutin",
    handle: "beauty-of-joseon-glow-serum-rice-alpha-arbutin",
    brand_handle: "beauty-of-joseon",
    origin_country: "KR",
    price_bdt: 1700,
    sale_price_bdt: 1500,
  },
  {
    title: "Beauty of Joseon Glow Replenishing Rice Milk",
    handle: "beauty-of-joseon-glow-replenishing-rice-milk",
    brand_handle: "beauty-of-joseon",
    origin_country: "KR",
    price_bdt: 1800,
  },
  {
    title: "Beauty of Joseon Relief Sun Rice + Probiotics 50ml",
    handle: "beauty-of-joseon-relief-sun-rice-probiotics-50ml",
    subtitle: "50ml",
    brand_handle: "beauty-of-joseon",
    origin_country: "KR",
    price_bdt: 1700,
    sale_price_bdt: 1500,
  },
  {
    title: "Beauty of Joseon Relief Sun Aqua-fresh 50ml",
    handle: "beauty-of-joseon-relief-sun-aqua-fresh-50ml",
    subtitle: "50ml",
    brand_handle: "beauty-of-joseon",
    origin_country: "KR",
    price_bdt: 1700,
    sale_price_bdt: 1500,
  },
  {
    title: "Beauty of Joseon Ground Rice and Honey Glow Mask",
    handle: "beauty-of-joseon-ground-rice-and-honey-glow-mask",
    brand_handle: "beauty-of-joseon",
    origin_country: "KR",
    price_bdt: 1800,
  },

  // ── BY WISHTREND ──────────────────────────────────────────────────────────
  {
    title: "BY WISHTREND Mandelic Acid 5% Skin Prep Water 120ml",
    handle: "by-wishtrend-mandelic-acid-5-skin-prep-water-120ml",
    subtitle: "120ml",
    brand_handle: "by-wishtrend",
    origin_country: "KR",
    price_bdt: 1800,
  },
  {
    title: "By Wishtrend Vitamin 75 Maximizing Cream 50g",
    handle: "by-wishtrend-vitamin-75-maximizing-cream-50g",
    subtitle: "50g",
    brand_handle: "by-wishtrend",
    origin_country: "KR",
    price_bdt: 2400,
    sale_price_bdt: 2200,
  },
  {
    title: "By Wishtrend Vitamin A-mazing Bakuchiol Night Cream 30g",
    handle: "by-wishtrend-vitamin-a-mazing-bakuchiol-night-cream-30g",
    subtitle: "30g",
    brand_handle: "by-wishtrend",
    origin_country: "KR",
    price_bdt: 3200,
    sale_price_bdt: 3000,
  },

  // ── CARE:NEL ──────────────────────────────────────────────────────────────
  {
    title: "CARE:NEL AHA BHA Peeling Serum 30ml",
    handle: "carenel-aha-bha-peeling-serum-30ml",
    subtitle: "30ml",
    brand_handle: "carenel",
    origin_country: "KR",
    price_bdt: 1200,
    sale_price_bdt: 1100,
  },
  {
    title: "CARE:NEL TXA 5 Niacinamide 10 Dark Spot Glow Serum 30ml",
    handle: "carenel-txa-5-niacinamide-10-dark-spot-glow-serum-30ml",
    subtitle: "30ml",
    brand_handle: "carenel",
    origin_country: "KR",
    price_bdt: 1700,
  },
  {
    title: "CARE:NEL Niacinamide Zinc Serum 30ml",
    handle: "carenel-niacinamide-zinc-serum-30ml",
    subtitle: "30ml",
    brand_handle: "carenel",
    origin_country: "KR",
    price_bdt: 1200,
  },
  {
    title: "CARE:NEL Ceramide Vita B5 Double Barrier Cream 50ml",
    handle: "carenel-ceramide-vita-b5-double-barrier-cream-50ml",
    subtitle: "50ml",
    brand_handle: "carenel",
    origin_country: "KR",
    price_bdt: 1500,
  },
  {
    title: "CARE:NEL Cicavita B5 Salicylic Acid Gentle Cleanser",
    handle: "carenel-cicavita-b5-salicylic-acid-gentle-cleanser",
    brand_handle: "carenel",
    origin_country: "KR",
    price_bdt: 1200,
  },
  {
    title: "CARE:NEL Derma Alpha Arbutin Glutathione Whitening Cream",
    handle: "carenel-derma-alpha-arbutin-glutathione-whitening-cream",
    brand_handle: "carenel",
    origin_country: "KR",
    price_bdt: 1500,
    sale_price_bdt: 1300,
  },
  {
    title: "CARE:NEL Anti-Melasma Cica Cream 40ml",
    handle: "carenel-anti-melasma-cica-cream-40ml",
    subtitle: "40ml",
    brand_handle: "carenel",
    origin_country: "KR",
    price_bdt: 1300,
  },

  // ── CELIMAX ───────────────────────────────────────────────────────────────
  {
    title: "Celimax The Vita-A Retinol Shot Tightening Booster 15ml",
    handle: "celimax-vita-a-retinol-shot-tightening-booster-15ml",
    subtitle: "15ml",
    brand_handle: "celimax",
    origin_country: "KR",
    price_bdt: 1600,
  },
  {
    title: "Celimax The Vita-A Retinol Shot Tightening Serum 30ml",
    handle: "celimax-vita-a-retinol-shot-tightening-serum-30ml",
    subtitle: "30ml",
    brand_handle: "celimax",
    origin_country: "KR",
    price_bdt: 1600,
  },

  // ── CETAPHIL ──────────────────────────────────────────────────────────────
  {
    title: "Cetaphil Gentle Skin Cleanser Dry & Sensitive Skin 236ml",
    handle: "cetaphil-gentle-skin-cleanser-dry-sensitive-skin-236ml",
    subtitle: "236ml",
    brand_handle: "cetaphil",
    origin_country: "US",
    price_bdt: 2500,
  },

  // ── COS DE BAHA ───────────────────────────────────────────────────────────
  {
    title: "COS DE BAHA Vitamin C 15 Serum (VA) 30ml",
    handle: "cos-de-baha-vitamin-c-15-serum-va-30ml",
    subtitle: "30ml",
    brand_handle: "cos-de-baha",
    origin_country: "KR",
    price_bdt: 1200,
    sale_price_bdt: 1100,
  },
  {
    title: "COS DE BAHA Arbutin Niacinamide Serum (AN) 30ml",
    handle: "cos-de-baha-arbutin-niacinamide-serum-an-30ml",
    subtitle: "30ml",
    brand_handle: "cos-de-baha",
    origin_country: "KR",
    price_bdt: 1200,
    sale_price_bdt: 1100,
  },
  {
    title: "COS DE BAHA Retinol 2.5% Serum (RS) 30ml",
    handle: "cos-de-baha-retinol-2-5-serum-rs-30ml",
    subtitle: "30ml",
    brand_handle: "cos-de-baha",
    origin_country: "KR",
    price_bdt: 1200,
  },
  {
    title: "COS DE BAHA Niacinamide 10% + Zinc 1% Serum 30ml",
    handle: "cos-de-baha-niacinamide-10-zinc-1-serum-30ml",
    subtitle: "30ml",
    brand_handle: "cos-de-baha",
    origin_country: "KR",
    price_bdt: 1200,
  },
  {
    title: "COS DE BAHA Azelaic Acid 10% Facial Serum (AZ) 30ml",
    handle: "cos-de-baha-azelaic-acid-10-facial-serum-az-30ml",
    subtitle: "30ml",
    brand_handle: "cos-de-baha",
    origin_country: "KR",
    price_bdt: 1200,
  },
  {
    title: "COS DE BAHA Salicylic Acid BHA 4% Serum (S4) 30ml",
    handle: "cos-de-baha-salicylic-acid-bha-4-serum-s4-30ml",
    subtitle: "30ml",
    brand_handle: "cos-de-baha",
    origin_country: "KR",
    price_bdt: 1200,
  },
  {
    title: "COS DE BAHA Tranexamic Acid + Niacinamide Serum (TN) 30ml",
    handle: "cos-de-baha-tranexamic-acid-niacinamide-serum-tn-30ml",
    subtitle: "30ml",
    brand_handle: "cos-de-baha",
    origin_country: "KR",
    price_bdt: 1200,
    sale_price_bdt: 1100,
  },

  // ── COSRX ─────────────────────────────────────────────────────────────────
  {
    title: "COSRX Advanced Snail Mucin Gel Cleanser",
    handle: "cosrx-advanced-snail-mucin-gel-cleanser",
    brand_handle: "cosrx",
    origin_country: "KR",
    price_bdt: 1400,
  },
  {
    title: "COSRX Advanced Snail 96 Mucin Power Essence 100ml",
    handle: "cosrx-advanced-snail-96-mucin-power-essence-100ml",
    subtitle: "100ml",
    brand_handle: "cosrx",
    origin_country: "KR",
    price_bdt: 1700,
  },
  {
    title: "COSRX Advanced Snail 92 All In One Cream 100g",
    handle: "cosrx-advanced-snail-92-all-in-one-cream-100g",
    subtitle: "100g",
    brand_handle: "cosrx",
    origin_country: "KR",
    price_bdt: 1800,
    sale_price_bdt: 1700,
  },
  {
    title: "COSRX The Niacinamide 15 Serum 20ml",
    handle: "cosrx-the-niacinamide-15-serum-20ml",
    subtitle: "20ml",
    brand_handle: "cosrx",
    origin_country: "KR",
    price_bdt: 1800,
  },
  {
    title: "COSRX Hyaluronic Hydra Intensive Cream 100ml",
    handle: "cosrx-hyaluronic-hydra-intensive-cream-100ml",
    subtitle: "100ml",
    brand_handle: "cosrx",
    origin_country: "KR",
    price_bdt: 1700,
  },
  {
    title: "COSRX The Retinol 0.5 Oil 20ml",
    handle: "cosrx-the-retinol-0-5-oil-20ml",
    subtitle: "20ml",
    brand_handle: "cosrx",
    origin_country: "KR",
    price_bdt: 1700,
  },
  {
    title: "COSRX ALL ABOUT SNAIL KIT 4-step",
    handle: "cosrx-all-about-snail-kit-4-step",
    brand_handle: "cosrx",
    origin_country: "KR",
    price_bdt: 2000,
  },
  {
    title: "COSRX Acne Pimple Master Patch 24 Patches",
    handle: "cosrx-acne-pimple-master-patch-24-patches",
    subtitle: "24 Patches",
    brand_handle: "cosrx",
    origin_country: "KR",
    price_bdt: 400,
    sale_price_bdt: 350,
  },
  {
    title: "COSRX AC Collection Calming Foam Cleanser 150ml",
    handle: "cosrx-ac-collection-calming-foam-cleanser-150ml",
    subtitle: "150ml",
    brand_handle: "cosrx",
    origin_country: "KR",
    price_bdt: 1300,
  },
  {
    title: "COSRX The 6 Peptide Skin Booster Serum 150ml",
    handle: "cosrx-the-6-peptide-skin-booster-serum-150ml",
    subtitle: "150ml",
    brand_handle: "cosrx",
    origin_country: "KR",
    price_bdt: 2000,
  },
  {
    title: "COSRX Salicylic Acid Daily Gentle Cleanser 150ml",
    handle: "cosrx-salicylic-acid-daily-gentle-cleanser-150ml",
    subtitle: "150ml",
    brand_handle: "cosrx",
    origin_country: "KR",
    price_bdt: 1200,
  },
  {
    title: "COSRX Low pH Good Morning Gel Cleanser",
    handle: "cosrx-low-ph-good-morning-gel-cleanser",
    brand_handle: "cosrx",
    origin_country: "KR",
    price_bdt: 1300,
  },
  {
    title: "COSRX BHA Blackhead Power Liquid 100ml",
    handle: "cosrx-bha-blackhead-power-liquid-100ml",
    subtitle: "100ml",
    brand_handle: "cosrx",
    origin_country: "KR",
    price_bdt: 1500,
  },
  {
    title: "COSRX Aloe Soothing Sun Cream SPF50",
    handle: "cosrx-aloe-soothing-sun-cream-spf50",
    brand_handle: "cosrx",
    origin_country: "KR",
    price_bdt: 1500,
  },
  {
    title: "COSRX AHA/BHA Clarifying Treatment Toner 150ml",
    handle: "cosrx-aha-bha-clarifying-treatment-toner-150ml",
    subtitle: "150ml",
    brand_handle: "cosrx",
    origin_country: "KR",
    price_bdt: 1700,
  },
  {
    title: "COSRX AHA 7 Whitehead Power Liquid",
    handle: "cosrx-aha-7-whitehead-power-liquid",
    brand_handle: "cosrx",
    origin_country: "KR",
    price_bdt: 1700,
  },
  {
    title: "COSRX Advanced Snail Radiance Dual Essence 80ml",
    handle: "cosrx-advanced-snail-radiance-dual-essence-80ml",
    subtitle: "80ml",
    brand_handle: "cosrx",
    origin_country: "KR",
    price_bdt: 2200,
  },
  {
    title: "COSRX Advanced Snail Peptide Eye Cream 25ml",
    handle: "cosrx-advanced-snail-peptide-eye-cream-25ml",
    subtitle: "25ml",
    brand_handle: "cosrx",
    origin_country: "KR",
    price_bdt: 1900,
  },

  // ── COXIR ─────────────────────────────────────────────────────────────────
  {
    title: "Coxir Intensive EGF Peptide Serum 50ml",
    handle: "coxir-intensive-egf-peptide-serum-50ml",
    subtitle: "50ml",
    brand_handle: "coxir",
    origin_country: "KR",
    price_bdt: 1700,
  },
  {
    title: "Coxir Black Snail Collagen Eye Cream 30ml",
    handle: "coxir-black-snail-collagen-eye-cream-30ml",
    subtitle: "30ml",
    brand_handle: "coxir",
    origin_country: "KR",
    price_bdt: 1700,
  },
  {
    title: "Coxir Vita C Bright Serum 50ml",
    handle: "coxir-vita-c-bright-serum-50ml",
    subtitle: "50ml",
    brand_handle: "coxir",
    origin_country: "KR",
    price_bdt: 1700,
  },
  {
    title: "Coxir Ultra Hyaluronic Cleansing Oil 150ml",
    handle: "coxir-ultra-hyaluronic-cleansing-oil-150ml",
    subtitle: "150ml",
    brand_handle: "coxir",
    origin_country: "KR",
    price_bdt: 1700,
    sale_price_bdt: 1600,
  },
  {
    title: "Coxir Brown Rice Ceramide Sunscreen SPF50+ 50ml",
    handle: "coxir-brown-rice-ceramide-sunscreen-spf50-50ml",
    subtitle: "50ml",
    brand_handle: "coxir",
    origin_country: "KR",
    price_bdt: 1600,
    sale_price_bdt: 1500,
  },
  {
    title: "Coxir Moisture Light Daily UV Sunscreen SPF50+ 50ml",
    handle: "coxir-moisture-light-daily-uv-sunscreen-spf50-50ml",
    subtitle: "50ml",
    brand_handle: "coxir",
    origin_country: "KR",
    price_bdt: 1500,
  },
  {
    title: "Coxir Black Snail Collagen Cream 50ml",
    handle: "coxir-black-snail-collagen-cream-50ml",
    subtitle: "50ml",
    brand_handle: "coxir",
    origin_country: "KR",
    price_bdt: 1700,
    sale_price_bdt: 1500,
  },

  // ── DR. ALTHEA ────────────────────────────────────────────────────────────
  {
    title: "Dr. Althea 15% Niacinamide Purity Serum 30ml",
    handle: "dr-althea-15-niacinamide-purity-serum-30ml",
    subtitle: "30ml",
    brand_handle: "dr-althea",
    origin_country: "KR",
    price_bdt: 2300,
    sale_price_bdt: 2100,
  },
  {
    title: "Dr. Althea Aqua Marine Jelly Mist 100ml",
    handle: "dr-althea-aqua-marine-jelly-mist-100ml",
    subtitle: "100ml",
    brand_handle: "dr-althea",
    origin_country: "KR",
    price_bdt: 1900,
  },
  {
    title: "Dr. Althea 0.1% Gentle Retinol Serum 30ml",
    handle: "dr-althea-0-1-gentle-retinol-serum-30ml",
    subtitle: "30ml",
    brand_handle: "dr-althea",
    origin_country: "KR",
    price_bdt: 2500,
    sale_price_bdt: 2300,
  },
  {
    title: "Dr. Althea Gentle Vitamin C Serum 30ml",
    handle: "dr-althea-gentle-vitamin-c-serum-30ml",
    subtitle: "30ml",
    brand_handle: "dr-althea",
    origin_country: "KR",
    price_bdt: 1800,
  },
  {
    title: "Dr. Althea 345 Relief Cream Mist 60ml",
    handle: "dr-althea-345-relief-cream-mist-60ml",
    subtitle: "60ml",
    brand_handle: "dr-althea",
    origin_country: "KR",
    price_bdt: 2500,
  },
  {
    title: "Dr. Althea Vitamin C Boosting Serum 30ml",
    handle: "dr-althea-vitamin-c-boosting-serum-30ml",
    subtitle: "30ml",
    brand_handle: "dr-althea",
    origin_country: "KR",
    price_bdt: 1800,
  },
  {
    title: "Dr. Althea Aqua Marine Watery Cream 50ml",
    handle: "dr-althea-aqua-marine-watery-cream-50ml",
    subtitle: "50ml",
    brand_handle: "dr-althea",
    origin_country: "KR",
    price_bdt: 2200,
    sale_price_bdt: 2000,
  },
  {
    title: "Dr. Althea 147 Barrier Cream 50ml",
    handle: "dr-althea-147-barrier-cream-50ml",
    subtitle: "50ml",
    brand_handle: "dr-althea",
    origin_country: "KR",
    price_bdt: 2200,
    sale_price_bdt: 2000,
  },
  {
    title: "Dr. Althea 345 Relief Cream 50ml",
    handle: "dr-althea-345-relief-cream-50ml",
    subtitle: "50ml",
    brand_handle: "dr-althea",
    origin_country: "KR",
    price_bdt: 2200,
    sale_price_bdt: 2000,
  },

  // ── EQUALBERRY ────────────────────────────────────────────────────────────
  {
    title: "Equalberry Swimming Pool Toner Pad",
    handle: "equalberry-swimming-pool-toner-pad",
    brand_handle: "equalberry",
    origin_country: "KR",
    price_bdt: 2500,
  },
  {
    title: "Equalberry Swimming Pool Ampoule",
    handle: "equalberry-swimming-pool-ampoule",
    brand_handle: "equalberry",
    origin_country: "KR",
    price_bdt: 2500,
  },
  {
    title: "Equalberry Swimming Pool Toner 155ml",
    handle: "equalberry-swimming-pool-toner-155ml",
    subtitle: "155ml",
    brand_handle: "equalberry",
    origin_country: "KR",
    price_bdt: 1800,
  },
  {
    title: "Equalberry Bakuchiol Plumping Capsule Cream 50ml",
    handle: "equalberry-bakuchiol-plumping-capsule-cream-50ml",
    subtitle: "50ml",
    brand_handle: "equalberry",
    origin_country: "KR",
    price_bdt: 2500,
    sale_price_bdt: 2300,
  },
  {
    title: "Equalberry Vitamin Illuminating Serum 30ml",
    handle: "equalberry-vitamin-illuminating-serum-30ml",
    subtitle: "30ml",
    brand_handle: "equalberry",
    origin_country: "KR",
    price_bdt: 2200,
    sale_price_bdt: 2000,
  },
  {
    title: "Equalberry Aloe PDRN Calming Serum 30ml",
    handle: "equalberry-aloe-pdrn-calming-serum-30ml",
    subtitle: "30ml",
    brand_handle: "equalberry",
    origin_country: "KR",
    price_bdt: 2100,
  },
  {
    title: "Equalberry Hyaltoin Flooding Serum 30ml",
    handle: "equalberry-hyaltoin-flooding-serum-30ml",
    subtitle: "30ml",
    brand_handle: "equalberry",
    origin_country: "KR",
    price_bdt: 2200,
  },
  {
    title: "Equalberry Bakuchiol Plumping Serum 30ml",
    handle: "equalberry-bakuchiol-plumping-serum-30ml",
    subtitle: "30ml",
    brand_handle: "equalberry",
    origin_country: "KR",
    price_bdt: 2200,
  },
  {
    title: "Equalberry NAD+ Peptide Boosting Serum 30ml",
    handle: "equalberry-nad-peptide-boosting-serum-30ml",
    subtitle: "30ml",
    brand_handle: "equalberry",
    origin_country: "KR",
    price_bdt: 2200,
  },
  {
    title: "Equalberry Purple Rice Pore Smoothing Cleansing Oil 200ml",
    handle: "equalberry-purple-rice-pore-smoothing-cleansing-oil-200ml",
    subtitle: "200ml",
    brand_handle: "equalberry",
    origin_country: "KR",
    price_bdt: 2000,
  },

  // ── GOODAL ────────────────────────────────────────────────────────────────
  {
    title: "Goodal Vegan Rice Milk Moisturizing Cream 70ml",
    handle: "goodal-vegan-rice-milk-moisturizing-cream-70ml",
    subtitle: "70ml",
    brand_handle: "goodal",
    origin_country: "KR",
    price_bdt: 1500,
  },
  {
    title: "Goodal Green Tangerine Vita-C Dark Spot Care Cream 50ml",
    handle: "goodal-green-tangerine-vita-c-dark-spot-care-cream-50ml",
    subtitle: "50ml",
    brand_handle: "goodal",
    origin_country: "KR",
    price_bdt: 2200,
  },
  {
    title: "Goodal Green Tangerine Vita-C Cleansing Foam 150ml",
    handle: "goodal-green-tangerine-vita-c-cleansing-foam-150ml",
    subtitle: "150ml",
    brand_handle: "goodal",
    origin_country: "KR",
    price_bdt: 1200,
  },
  {
    title: "Goodal Green Tangerine Vita-C Dark Spot Care Serum 40ml",
    handle: "goodal-green-tangerine-vita-c-dark-spot-care-serum-40ml",
    subtitle: "40ml",
    brand_handle: "goodal",
    origin_country: "KR",
    price_bdt: 2300,
    sale_price_bdt: 2200,
  },
  {
    title: "Goodal Vegan Rice Milk Moisturizing Toner 150ml",
    handle: "goodal-vegan-rice-milk-moisturizing-toner-150ml",
    subtitle: "150ml",
    brand_handle: "goodal",
    origin_country: "KR",
    price_bdt: 1700,
  },

  // ── HARUHARU WONDER ───────────────────────────────────────────────────────
  {
    title: "Haruharu Wonder Rose PDRN Firming Serum 30ml",
    handle: "haruharu-wonder-rose-pdrn-firming-serum-30ml",
    subtitle: "30ml",
    brand_handle: "haruharu-wonder",
    origin_country: "KR",
    price_bdt: 2100,
  },
  {
    title: "HARUHARU WONDER Black Rice Hyaluronic Cream Unscented 50ml",
    handle: "haruharu-wonder-black-rice-hyaluronic-cream-unscented-50ml",
    subtitle: "50ml",
    brand_handle: "haruharu-wonder",
    origin_country: "KR",
    price_bdt: 1800,
  },
  {
    title: "Haruharu Wonder Black Rice Moisture 5.5 Soft Cleansing Gel 100ml",
    handle: "haruharu-wonder-black-rice-moisture-5-5-soft-cleansing-gel-100ml",
    subtitle: "100ml",
    brand_handle: "haruharu-wonder",
    origin_country: "KR",
    price_bdt: 1500,
  },
  {
    title: "Haruharu Wonder Black Rice Hyaluronic Toner for Sensitive Skin 150ml",
    handle: "haruharu-wonder-black-rice-hyaluronic-toner-sensitive-skin-150ml",
    subtitle: "150ml",
    brand_handle: "haruharu-wonder",
    origin_country: "KR",
    price_bdt: 1800,
  },
  {
    title: "Haruharu Wonder Black Rice Hyaluronic Toner 150ml",
    handle: "haruharu-wonder-black-rice-hyaluronic-toner-150ml",
    subtitle: "150ml",
    brand_handle: "haruharu-wonder",
    origin_country: "KR",
    price_bdt: 1800,
  },

  // ── HEIMISH ───────────────────────────────────────────────────────────────
  {
    title: "HEIMISH Artless Glow Base SPF 50+ PA+++ 40ml",
    handle: "heimish-artless-glow-base-spf50-pa-40ml",
    subtitle: "40ml",
    brand_handle: "heimish",
    origin_country: "KR",
    price_bdt: 1500,
  },
  {
    title: "HEIMISH Marine Care Retinol for Face Serum",
    handle: "heimish-marine-care-retinol-for-face-serum",
    brand_handle: "heimish",
    origin_country: "KR",
    price_bdt: 2100,
  },
  {
    title: "HEIMISH Artless Glow Tinted Sunscreen",
    handle: "heimish-artless-glow-tinted-sunscreen",
    brand_handle: "heimish",
    origin_country: "KR",
    price_bdt: 1700,
  },
  {
    title: "Heimish Matcha Biome Hydrogel Eye Patch x60",
    handle: "heimish-matcha-biome-hydrogel-eye-patch-x60",
    subtitle: "60 patches",
    brand_handle: "heimish",
    origin_country: "KR",
    price_bdt: 1900,
  },
  {
    title: "HEIMISH Bulgarian Rose Water Hydrogel Eye Patch 60pcs",
    handle: "heimish-bulgarian-rose-water-hydrogel-eye-patch-60pcs",
    subtitle: "60pcs",
    brand_handle: "heimish",
    origin_country: "KR",
    price_bdt: 1700,
  },
  {
    title: "HEIMISH All Clean Balm Mandarin",
    handle: "heimish-all-clean-balm-mandarin",
    brand_handle: "heimish",
    origin_country: "KR",
    price_bdt: 1800,
  },
  {
    title: "Heimish All Clean Balm 120ml",
    handle: "heimish-all-clean-balm-120ml",
    subtitle: "120ml",
    brand_handle: "heimish",
    origin_country: "KR",
    price_bdt: 1800,
  },
  {
    title: "HEIMISH All Clean Green Foam 150g",
    handle: "heimish-all-clean-green-foam-150g",
    subtitle: "150g",
    brand_handle: "heimish",
    origin_country: "KR",
    price_bdt: 1500,
  },

  // ── I'M FROM ──────────────────────────────────────────────────────────────
  {
    title: "I'm From Vitamin Tree Water-Gel 75g",
    handle: "im-from-vitamin-tree-water-gel-75g",
    subtitle: "75g",
    brand_handle: "im-from",
    origin_country: "KR",
    price_bdt: 2300,
  },
  {
    title: "I'm From Ginseng Mask 120g",
    handle: "im-from-ginseng-mask-120g",
    subtitle: "120g",
    brand_handle: "im-from",
    origin_country: "KR",
    price_bdt: 2500,
  },
  {
    title: "I'm From Ginseng Serum 30ml",
    handle: "im-from-ginseng-serum-30ml",
    subtitle: "30ml",
    brand_handle: "im-from",
    origin_country: "KR",
    price_bdt: 2500,
  },
  {
    title: "I'm From Rice Serum 30ml",
    handle: "im-from-rice-serum-30ml",
    subtitle: "30ml",
    brand_handle: "im-from",
    origin_country: "KR",
    price_bdt: 2500,
    sale_price_bdt: 2300,
  },
  {
    title: "I'm From Rice Cream 50g",
    handle: "im-from-rice-cream-50g",
    subtitle: "50g",
    brand_handle: "im-from",
    origin_country: "KR",
    price_bdt: 2500,
  },
  {
    title: "I'm From Rice Sunscreen SPF50+ 50ml",
    handle: "im-from-rice-sunscreen-spf50-50ml",
    subtitle: "50ml",
    brand_handle: "im-from",
    origin_country: "KR",
    price_bdt: 1700,
    sale_price_bdt: 1500,
  },
  {
    title: "I'm From Mugwort Mask 110g",
    handle: "im-from-mugwort-mask-110g",
    subtitle: "110g",
    brand_handle: "im-from",
    origin_country: "KR",
    price_bdt: 2500,
  },
  {
    title: "I'm From Mugwort Essence 160ml",
    handle: "im-from-mugwort-essence-160ml",
    subtitle: "160ml",
    brand_handle: "im-from",
    origin_country: "KR",
    price_bdt: 3200,
    sale_price_bdt: 3000,
  },
  {
    title: "I'm From Honey Glow Cream 50g",
    handle: "im-from-honey-glow-cream-50g",
    subtitle: "50g",
    brand_handle: "im-from",
    origin_country: "KR",
    price_bdt: 2500,
    sale_price_bdt: 2300,
  },
  {
    title: "I'm From Black Rice Toner 150ml",
    handle: "im-from-black-rice-toner-150ml",
    subtitle: "150ml",
    brand_handle: "im-from",
    origin_country: "KR",
    price_bdt: 2500,
    sale_price_bdt: 2300,
  },
  {
    title: "I'm From Honey Serum 30ml",
    handle: "im-from-honey-serum-30ml",
    subtitle: "30ml",
    brand_handle: "im-from",
    origin_country: "KR",
    price_bdt: 2500,
    sale_price_bdt: 2300,
  },
  {
    title: "I'm From Mugwort Gel Cleanser 150g",
    handle: "im-from-mugwort-gel-cleanser-150g",
    subtitle: "150g",
    brand_handle: "im-from",
    origin_country: "KR",
    price_bdt: 1800,
  },
  {
    title: "I'm From Honey Mask 120g",
    handle: "im-from-honey-mask-120g",
    subtitle: "120g",
    brand_handle: "im-from",
    origin_country: "KR",
    price_bdt: 2500,
  },
  {
    title: "I'm From Rice Toner 150ml",
    handle: "im-from-rice-toner-150ml",
    subtitle: "150ml",
    brand_handle: "im-from",
    origin_country: "KR",
    price_bdt: 2500,
    sale_price_bdt: 2300,
  },

  // ── INNISFREE ─────────────────────────────────────────────────────────────
  {
    title: "INNISFREE Bija Trouble Cleansing Foam 150g",
    handle: "innisfree-bija-trouble-cleansing-foam-150g",
    subtitle: "150g",
    brand_handle: "innisfree",
    origin_country: "KR",
    price_bdt: 1300,
  },
  {
    title: "INNISFREE Jeju Orchid Enriched Cream 50g",
    handle: "innisfree-jeju-orchid-enriched-cream-50g",
    subtitle: "50g",
    brand_handle: "innisfree",
    origin_country: "KR",
    price_bdt: 3100,
  },
  {
    title: "INNISFREE Volcanic BHA Pore Cleansing Foam 150g",
    handle: "innisfree-volcanic-bha-pore-cleansing-foam-150g",
    subtitle: "150g",
    brand_handle: "innisfree",
    origin_country: "KR",
    price_bdt: 1300,
  },
  {
    title: "INNISFREE Green Tea Amino Hydrating Cleansing Foam 150g",
    handle: "innisfree-green-tea-amino-hydrating-cleansing-foam-150g",
    subtitle: "150g",
    brand_handle: "innisfree",
    origin_country: "KR",
    price_bdt: 1300,
  },
  {
    title: "INNISFREE Cherry Blossom Glow Tone-Up Cream 50g",
    handle: "innisfree-cherry-blossom-glow-tone-up-cream-50g",
    subtitle: "50g",
    brand_handle: "innisfree",
    origin_country: "KR",
    price_bdt: 2100,
  },
  {
    title: "INNISFREE Cherry Blossom Glow Jelly Cream 50g",
    handle: "innisfree-cherry-blossom-glow-jelly-cream-50g",
    subtitle: "50g",
    brand_handle: "innisfree",
    origin_country: "KR",
    price_bdt: 2000,
  },
  {
    title: "INNISFREE Super Volcanic Pore Clay Mask 100g",
    handle: "innisfree-super-volcanic-pore-clay-mask-100g",
    subtitle: "100g",
    brand_handle: "innisfree",
    origin_country: "KR",
    price_bdt: 1700,
    sale_price_bdt: 1600,
  },
  {
    title: "INNISFREE No-Sebum Mineral Powder",
    handle: "innisfree-no-sebum-mineral-powder",
    brand_handle: "innisfree",
    origin_country: "KR",
    price_bdt: 1000,
  },

  // ── ISNTREE ───────────────────────────────────────────────────────────────
  {
    title: "ISNTREE Hyaluronic Acid Watery Sun Gel SPF50+ PA++++ 50ml",
    handle: "isntree-hyaluronic-acid-watery-sun-gel-spf50-50ml",
    subtitle: "50ml",
    brand_handle: "isntree",
    origin_country: "KR",
    price_bdt: 1700,
  },
  {
    title: "ISNTREE Green Tea Fresh Toner 200ml",
    handle: "isntree-green-tea-fresh-toner-200ml",
    subtitle: "200ml",
    brand_handle: "isntree",
    origin_country: "KR",
    price_bdt: 1700,
  },
  {
    title: "Isntree Hyaluronic Acid Toner 200ml",
    handle: "isntree-hyaluronic-acid-toner-200ml",
    subtitle: "200ml",
    brand_handle: "isntree",
    origin_country: "KR",
    price_bdt: 1700,
  },
  {
    title: "Isntree Green Tea Fresh Serum 50ml",
    handle: "isntree-green-tea-fresh-serum-50ml",
    subtitle: "50ml",
    brand_handle: "isntree",
    origin_country: "KR",
    price_bdt: 1800,
  },
  {
    title: "Isntree Hyaluronic Acid Airy Sun Stick SPF50+ 22g",
    handle: "isntree-hyaluronic-acid-airy-sun-stick-spf50-22g",
    subtitle: "22g",
    brand_handle: "isntree",
    origin_country: "KR",
    price_bdt: 1700,
  },
  {
    title: "Isntree Hyaluronic Acid Aqua Gel-Cream 100ml",
    handle: "isntree-hyaluronic-acid-aqua-gel-cream-100ml",
    subtitle: "100ml",
    brand_handle: "isntree",
    origin_country: "KR",
    price_bdt: 1800,
  },

  // ── IUNIK ─────────────────────────────────────────────────────────────────
  {
    title: "iUNIK Centella Green Fresh Cleansing Oil 200ml",
    handle: "iunik-centella-green-fresh-cleansing-oil-200ml",
    subtitle: "200ml",
    brand_handle: "iunik",
    origin_country: "KR",
    price_bdt: 2100,
  },
  {
    title: "IUNIK Beta-Glucan Daily Moisture Cream 60ml",
    handle: "iunik-beta-glucan-daily-moisture-cream-60ml",
    subtitle: "60ml",
    brand_handle: "iunik",
    origin_country: "KR",
    price_bdt: 1600,
  },
  {
    title: "IUNIK Calendula Complete Cleansing Oil 200ml",
    handle: "iunik-calendula-complete-cleansing-oil-200ml",
    subtitle: "200ml",
    brand_handle: "iunik",
    origin_country: "KR",
    price_bdt: 2000,
  },
  {
    title: "IUNIK Beta-Glucan Power Moisture Serum 50ml",
    handle: "iunik-beta-glucan-power-moisture-serum-50ml",
    subtitle: "50ml",
    brand_handle: "iunik",
    origin_country: "KR",
    price_bdt: 2100,
  },
  {
    title: "IUNIK Propolis Vitamin Synergy Serum 50ml",
    handle: "iunik-propolis-vitamin-synergy-serum-50ml",
    subtitle: "50ml",
    brand_handle: "iunik",
    origin_country: "KR",
    price_bdt: 1800,
  },
  {
    title: "IUNIK Tea Tree Relief Serum 50ml",
    handle: "iunik-tea-tree-relief-serum-50ml",
    subtitle: "50ml",
    brand_handle: "iunik",
    origin_country: "KR",
    price_bdt: 1800,
  },
  {
    title: "IUNIK Centella Calming Gel Cream 60ml",
    handle: "iunik-centella-calming-gel-cream-60ml",
    subtitle: "60ml",
    brand_handle: "iunik",
    origin_country: "KR",
    price_bdt: 1600,
    sale_price_bdt: 1500,
  },
  {
    title: "IUNIK Centella Bubble Cleansing Foam 150ml",
    handle: "iunik-centella-bubble-cleansing-foam-150ml",
    subtitle: "150ml",
    brand_handle: "iunik",
    origin_country: "KR",
    price_bdt: 1900,
  },
  {
    title: "IUNIK Centella Calming Daily Sunscreen SPF50+ 60ml",
    handle: "iunik-centella-calming-daily-sunscreen-spf50-60ml",
    subtitle: "60ml",
    brand_handle: "iunik",
    origin_country: "KR",
    price_bdt: 1500,
    sale_price_bdt: 1300,
  },

  // ── JNH ───────────────────────────────────────────────────────────────────
  {
    title: "JNH Sseng Eol Whipping Cleansing Foam 150ml",
    handle: "jnh-sseng-eol-whipping-cleansing-foam-150ml",
    subtitle: "150ml",
    brand_handle: "jnh",
    origin_country: "KR",
    price_bdt: 1300,
  },

  // ── JUMISO ────────────────────────────────────────────────────────────────
  {
    title: "JUMISO All Day Vitamin Brightening & Balancing Facial Serum 30ml",
    handle: "jumiso-all-day-vitamin-brightening-balancing-facial-serum-30ml",
    subtitle: "30ml",
    brand_handle: "jumiso",
    origin_country: "KR",
    price_bdt: 1700,
  },
  {
    title: "JUMISO Niacinamide 20 Serum 40ml",
    handle: "jumiso-niacinamide-20-serum-40ml",
    subtitle: "40ml",
    brand_handle: "jumiso",
    origin_country: "KR",
    price_bdt: 1800,
  },
  {
    title: "JUMISO Niacinamide 10 Serum 40ml",
    handle: "jumiso-niacinamide-10-serum-40ml",
    subtitle: "40ml",
    brand_handle: "jumiso",
    origin_country: "KR",
    price_bdt: 2100,
  },
  {
    title: "JUMISO Niacinamide 5+ Overnight Cream 50g",
    handle: "jumiso-niacinamide-5-overnight-cream-50g",
    subtitle: "50g",
    brand_handle: "jumiso",
    origin_country: "KR",
    price_bdt: 2500,
  },

  // ── K-SECRET ──────────────────────────────────────────────────────────────
  {
    title: "K-SECRET Collagen Boosting Secret Sun Lotion 60ml",
    handle: "k-secret-collagen-boosting-secret-sun-lotion-60ml",
    subtitle: "60ml",
    brand_handle: "k-secret",
    origin_country: "KR",
    price_bdt: 1800,
  },
  {
    title: "K-SECRET SEOUL 1988 Essence Snail Mucin 97% + Rice 100ml",
    handle: "k-secret-seoul-1988-essence-snail-mucin-97-rice-100ml",
    subtitle: "100ml",
    brand_handle: "k-secret",
    origin_country: "KR",
    price_bdt: 1900,
  },
  {
    title: "K-SECRET SEOUL 1988 Sun Pine Tree + Ceramide 50ml",
    handle: "k-secret-seoul-1988-sun-pine-tree-ceramide-50ml",
    subtitle: "50ml",
    brand_handle: "k-secret",
    origin_country: "KR",
    price_bdt: 1700,
  },
  {
    title: "K-SECRET SEOUL 1988 Serum Retinal Liposome 2% + Black Ginseng 30ml",
    handle: "k-secret-seoul-1988-serum-retinal-liposome-2-black-ginseng-30ml",
    subtitle: "30ml",
    brand_handle: "k-secret",
    origin_country: "KR",
    price_bdt: 1900,
  },
  {
    title: "K-SECRET SEOUL 1988 Eye Cream Retinal Liposome 4% + Fermented Bean 30ml",
    handle: "k-secret-seoul-1988-eye-cream-retinal-liposome-4-fermented-bean-30ml",
    subtitle: "30ml",
    brand_handle: "k-secret",
    origin_country: "KR",
    price_bdt: 1800,
  },

  // ── KLAIRS ────────────────────────────────────────────────────────────────
  {
    title: "KLAIRS Supple Preparation Unscented Toner 180ml",
    handle: "klairs-supple-preparation-unscented-toner-180ml",
    subtitle: "180ml",
    brand_handle: "klairs",
    origin_country: "KR",
    price_bdt: 1800,
  },
  {
    title: "KLAIRS Gentle Black Fresh Cleansing Oil 150ml",
    handle: "klairs-gentle-black-fresh-cleansing-oil-150ml",
    subtitle: "150ml",
    brand_handle: "klairs",
    origin_country: "KR",
    price_bdt: 2000,
  },
  {
    title: "KLAIRS Gentle Black Deep Cleansing Oil 150ml",
    handle: "klairs-gentle-black-deep-cleansing-oil-150ml",
    subtitle: "150ml",
    brand_handle: "klairs",
    origin_country: "KR",
    price_bdt: 2000,
  },
  {
    title: "KLAIRS Midnight Blue Calming Cream 30ml",
    handle: "klairs-midnight-blue-calming-cream-30ml",
    subtitle: "30ml",
    brand_handle: "klairs",
    origin_country: "KR",
    price_bdt: 2000,
  },
  {
    title: "KLAIRS Midnight Blue Calming Cream 60ml",
    handle: "klairs-midnight-blue-calming-cream-60ml",
    subtitle: "60ml",
    brand_handle: "klairs",
    origin_country: "KR",
    price_bdt: 2500,
  },

  // ── MARY & MAY ────────────────────────────────────────────────────────────
  {
    title: "MARY & MAY Tranexamic + Glutathione Eye Cream 12g",
    handle: "mary-and-may-tranexamic-glutathione-eye-cream-12g",
    subtitle: "12g",
    brand_handle: "mary-and-may",
    origin_country: "KR",
    price_bdt: 500,
  },
  {
    title: "Mary & May Vegan Peptide Bakuchiol Sun Stick SPF50+ 18g",
    handle: "mary-and-may-vegan-peptide-bakuchiol-sun-stick-spf50-18g",
    subtitle: "18g",
    brand_handle: "mary-and-may",
    origin_country: "KR",
    price_bdt: 1700,
    sale_price_bdt: 1500,
  },

  // ── MEDICUBE ──────────────────────────────────────────────────────────────
  {
    title: "Medicube Collagen Jelly Cream 110ml",
    handle: "medicube-collagen-jelly-cream-110ml",
    subtitle: "110ml",
    brand_handle: "medicube",
    origin_country: "KR",
    price_bdt: 2400,
  },
  {
    title: "MEDICUBE Kojic Acid Turmeric Night Wrapping Mask 75ml",
    handle: "medicube-kojic-acid-turmeric-night-wrapping-mask-75ml",
    subtitle: "75ml",
    brand_handle: "medicube",
    origin_country: "KR",
    price_bdt: 2100,
    sale_price_bdt: 2000,
  },
  {
    title: "Medicube TXA Niacinamide 15% Serum 30ml",
    handle: "medicube-txa-niacinamide-15-serum-30ml",
    subtitle: "30ml",
    brand_handle: "medicube",
    origin_country: "KR",
    price_bdt: 1900,
  },
  {
    title: "Medicube Kojic Acid Turmeric Niacinamide Serum 30ml",
    handle: "medicube-kojic-acid-turmeric-niacinamide-serum-30ml",
    subtitle: "30ml",
    brand_handle: "medicube",
    origin_country: "KR",
    price_bdt: 2000,
  },
  {
    title: "MEDICUBE Glutathione Glow Serum 30g",
    handle: "medicube-glutathione-glow-serum-30g",
    subtitle: "30g",
    brand_handle: "medicube",
    origin_country: "KR",
    price_bdt: 2000,
  },
  {
    title: "Medicube PDRN Pink Collagen Capsule Cream 55g",
    handle: "medicube-pdrn-pink-collagen-capsule-cream-55g",
    subtitle: "55g",
    brand_handle: "medicube",
    origin_country: "KR",
    price_bdt: 2200,
    sale_price_bdt: 2100,
  },
  {
    title: "Medicube Zero Pore Pad 2.0 155g",
    handle: "medicube-zero-pore-pad-2-0-155g",
    subtitle: "155g",
    brand_handle: "medicube",
    origin_country: "KR",
    price_bdt: 2200,
  },
  {
    title: "Medicube Zero Pore Blackhead Mud Mask 100g",
    handle: "medicube-zero-pore-blackhead-mud-mask-100g",
    subtitle: "100g",
    brand_handle: "medicube",
    origin_country: "KR",
    price_bdt: 1700,
  },
  {
    title: "Medicube TXA Niacinamide Capsule Cream 55g",
    handle: "medicube-txa-niacinamide-capsule-cream-55g",
    subtitle: "55g",
    brand_handle: "medicube",
    origin_country: "KR",
    price_bdt: 2400,
  },
  {
    title: "Medicube PDRN Pink Peptide Serum 30ml",
    handle: "medicube-pdrn-pink-peptide-serum-30ml",
    subtitle: "30ml",
    brand_handle: "medicube",
    origin_country: "KR",
    price_bdt: 1800,
  },
  {
    title: "Medicube Deep Vita C Capsule Cream 55g",
    handle: "medicube-deep-vita-c-capsule-cream-55g",
    subtitle: "55g",
    brand_handle: "medicube",
    origin_country: "KR",
    price_bdt: 2500,
  },
  {
    title: "Medicube Deep Vita C Ampoule 2.0",
    handle: "medicube-deep-vita-c-ampoule-2-0",
    brand_handle: "medicube",
    origin_country: "KR",
    price_bdt: 2500,
  },
  {
    title: "Medicube Collagen Night Wrapping Mask",
    handle: "medicube-collagen-night-wrapping-mask",
    brand_handle: "medicube",
    origin_country: "KR",
    price_bdt: 2300,
  },
  {
    title: "Medicube PDRN Pink Collagen Capsule Serum 30ml",
    handle: "medicube-pdrn-pink-collagen-capsule-serum-30ml",
    subtitle: "30ml",
    brand_handle: "medicube",
    origin_country: "KR",
    price_bdt: 2100,
  },

  // ── MISSHA ────────────────────────────────────────────────────────────────
  {
    title: "MISSHA Glow Skin Balm 50ml",
    handle: "missha-glow-skin-balm-50ml",
    subtitle: "50ml",
    brand_handle: "missha",
    origin_country: "KR",
    price_bdt: 1700,
  },
  {
    title: "Missha All Around Safe Block Aqua Sun Gel SPF50+ 50ml",
    handle: "missha-all-around-safe-block-aqua-sun-gel-spf50-50ml",
    subtitle: "50ml",
    brand_handle: "missha",
    origin_country: "KR",
    price_bdt: 1200,
    sale_price_bdt: 1100,
  },
  {
    title: "Missha Vita C Plus Spot Correcting & Firming Ampoule 30ml",
    handle: "missha-vita-c-plus-spot-correcting-firming-ampoule-30ml",
    subtitle: "30ml",
    brand_handle: "missha",
    origin_country: "KR",
    price_bdt: 1800,
  },
  {
    title: "Missha Airy Fit Sheet Mask Lemon 19g",
    handle: "missha-airy-fit-sheet-mask-lemon-19g",
    subtitle: "19g",
    brand_handle: "missha",
    origin_country: "KR",
    price_bdt: 150,
  },
  {
    title: "Missha Time Revolution Night Repair Ampoule Cream 5X 50ml",
    handle: "missha-time-revolution-night-repair-ampoule-cream-5x-50ml",
    subtitle: "50ml",
    brand_handle: "missha",
    origin_country: "KR",
    price_bdt: 3300,
  },
  {
    title: "Missha Time Revolution Night Repair Ampoule 5X 50ml",
    handle: "missha-time-revolution-night-repair-ampoule-5x-50ml",
    subtitle: "50ml",
    brand_handle: "missha",
    origin_country: "KR",
    price_bdt: 3200,
  },
  {
    title: "MISSHA All-Around Safe Block Essence Sun Milk EX SPF50+/PA+++ 70ml",
    handle: "missha-all-around-safe-block-essence-sun-milk-ex-spf50-70ml",
    subtitle: "70ml",
    brand_handle: "missha",
    origin_country: "KR",
    price_bdt: 1500,
  },
  {
    title: "Missha All Around Safe Block Soft Finish Sun Milk SPF50+ 70ml",
    handle: "missha-all-around-safe-block-soft-finish-sun-milk-spf50-70ml",
    subtitle: "70ml",
    brand_handle: "missha",
    origin_country: "KR",
    price_bdt: 1500,
  },
  {
    title: "Missha Airy Sunstick Smoothing Bar 23g",
    handle: "missha-airy-sunstick-smoothing-bar-23g",
    subtitle: "23g",
    brand_handle: "missha",
    origin_country: "KR",
    price_bdt: 1700,
  },

  // ── NUMBUZIN ──────────────────────────────────────────────────────────────
  {
    title: "NUMBUZIN No.9 NAD Bio Lifting Essence 50ml",
    handle: "numbuzin-no-9-nad-bio-lifting-essence-50ml",
    subtitle: "50ml",
    brand_handle: "numbuzin",
    origin_country: "KR",
    price_bdt: 2500,
  },
  {
    title: "NUMBUZIN No.5+ Vitamin Boosting Essence Toner 200ml",
    handle: "numbuzin-no-5-plus-vitamin-boosting-essence-toner-200ml",
    subtitle: "200ml",
    brand_handle: "numbuzin",
    origin_country: "KR",
    price_bdt: 2500,
  },
  {
    title: "NUMBUZIN No. 3 Skin Softening Serum 50ml",
    handle: "numbuzin-no-3-skin-softening-serum-50ml",
    subtitle: "50ml",
    brand_handle: "numbuzin",
    origin_country: "KR",
    price_bdt: 2000,
  },
  {
    title: "NUMBUZIN No. 3 Super Glowing Essence Toner 200ml",
    handle: "numbuzin-no-3-super-glowing-essence-toner-200ml",
    subtitle: "200ml",
    brand_handle: "numbuzin",
    origin_country: "KR",
    price_bdt: 2100,
  },
  {
    title: "NUMBUZIN No. 5 Goodbye Blemish Serum 50ml",
    handle: "numbuzin-no-5-goodbye-blemish-serum-50ml",
    subtitle: "50ml",
    brand_handle: "numbuzin",
    origin_country: "KR",
    price_bdt: 2100,
  },
  {
    title: "NUMBUZIN No.5+ Glutathione Vitamin Concentrated Toner Pads",
    handle: "numbuzin-no-5-plus-glutathione-vitamin-concentrated-toner-pads",
    brand_handle: "numbuzin",
    origin_country: "KR",
    price_bdt: 2500,
    sale_price_bdt: 2300,
  },
  {
    title: "NUMBUZIN No.5+ Vitamin Concentrated Serum 30ml",
    handle: "numbuzin-no-5-plus-vitamin-concentrated-serum-30ml",
    subtitle: "30ml",
    brand_handle: "numbuzin",
    origin_country: "KR",
    price_bdt: 2000,
  },

  // ── PURITO SEOUL ──────────────────────────────────────────────────────────
  {
    title: "PURITO Wonder Releaf Centella Asiatica Serum 60ml",
    handle: "purito-seoul-wonder-releaf-centella-asiatica-serum-60ml",
    subtitle: "60ml",
    brand_handle: "purito-seoul",
    origin_country: "KR",
    price_bdt: 1800,
  },
  {
    title: "Purito Seoul Pure Vitamin C Serum 60ml",
    handle: "purito-seoul-pure-vitamin-c-serum-60ml",
    subtitle: "60ml",
    brand_handle: "purito-seoul",
    origin_country: "KR",
    price_bdt: 1700,
  },
  {
    title: "Purito Seoul Mighty Bamboo Panthenol Cleanser 150ml",
    handle: "purito-seoul-mighty-bamboo-panthenol-cleanser-150ml",
    subtitle: "150ml",
    brand_handle: "purito-seoul",
    origin_country: "KR",
    price_bdt: 1500,
  },
  {
    title: "Purito Seoul Wonder Releaf Centella Unscented Toner 200ml",
    handle: "purito-seoul-wonder-releaf-centella-unscented-toner-200ml",
    subtitle: "200ml",
    brand_handle: "purito-seoul",
    origin_country: "KR",
    price_bdt: 2000,
  },
  {
    title: "Purito Seoul Wonder Releaf Centella Serum 60ml",
    handle: "purito-seoul-wonder-releaf-centella-serum-60ml",
    subtitle: "60ml",
    brand_handle: "purito-seoul",
    origin_country: "KR",
    price_bdt: 1900,
    sale_price_bdt: 1700,
  },
  {
    title: "Purito Seoul Wonder Releaf Centella Toner 200ml",
    handle: "purito-seoul-wonder-releaf-centella-toner-200ml",
    subtitle: "200ml",
    brand_handle: "purito-seoul",
    origin_country: "KR",
    price_bdt: 1800,
  },
  {
    title: "Purito Seoul Timeless Bloom Bakuchiol Serum 30ml",
    handle: "purito-seoul-timeless-bloom-bakuchiol-serum-30ml",
    subtitle: "30ml",
    brand_handle: "purito-seoul",
    origin_country: "KR",
    price_bdt: 2200,
  },
  {
    title: "Purito Seoul Green Avocado Cleansing Balm 100ml",
    handle: "purito-seoul-green-avocado-cleansing-balm-100ml",
    subtitle: "100ml",
    brand_handle: "purito-seoul",
    origin_country: "KR",
    price_bdt: 2000,
  },
  {
    title: "Purito Seoul Mighty Bamboo Panthenol Serum 30ml",
    handle: "purito-seoul-mighty-bamboo-panthenol-serum-30ml",
    subtitle: "30ml",
    brand_handle: "purito-seoul",
    origin_country: "KR",
    price_bdt: 2100,
  },
  {
    title: "PURITO Seoul Azelaic Acid 10 Kojic Azulene Serum 30ml",
    handle: "purito-seoul-azelaic-acid-10-kojic-azulene-serum-30ml",
    subtitle: "30ml",
    brand_handle: "purito-seoul",
    origin_country: "KR",
    price_bdt: 1800,
  },
  {
    title: "PURITO SEOUL TXA 6 Niacinamide 10 Retinal Serum 30ml",
    handle: "purito-seoul-txa-6-niacinamide-10-retinal-serum-30ml",
    subtitle: "30ml",
    brand_handle: "purito-seoul",
    origin_country: "KR",
    price_bdt: 1800,
  },
  {
    title: "Purito Seoul Mighty Bamboo Panthenol Cream 100ml",
    handle: "purito-seoul-mighty-bamboo-panthenol-cream-100ml",
    subtitle: "100ml",
    brand_handle: "purito-seoul",
    origin_country: "KR",
    price_bdt: 2000,
  },

  // ── ROUND LAB ─────────────────────────────────────────────────────────────
  {
    title: "ROUND LAB 1025 Dokdo Toner 200ml",
    handle: "round-lab-1025-dokdo-toner-200ml",
    subtitle: "200ml",
    brand_handle: "round-lab",
    origin_country: "KR",
    price_bdt: 1700,
  },
  {
    title: "ROUND LAB 1025 Dokdo Cleansing Oil 200ml",
    handle: "round-lab-1025-dokdo-cleansing-oil-200ml",
    subtitle: "200ml",
    brand_handle: "round-lab",
    origin_country: "KR",
    price_bdt: 2000,
  },
  {
    title: "ROUND LAB Birch Moisturizing Sunscreen SPF50+ PA+++ 50ml",
    handle: "round-lab-birch-moisturizing-sunscreen-spf50-50ml",
    subtitle: "50ml",
    brand_handle: "round-lab",
    origin_country: "KR",
    price_bdt: 1700,
  },
  {
    title: "ROUND LAB 1025 Dokdo Cleanser 150ml",
    handle: "round-lab-1025-dokdo-cleanser-150ml",
    subtitle: "150ml",
    brand_handle: "round-lab",
    origin_country: "KR",
    price_bdt: 1700,
    sale_price_bdt: 1500,
  },

  // ── SKIN1004 ──────────────────────────────────────────────────────────────
  {
    title: "SKIN1004 Madagascar Centella Ampoule 100ml",
    handle: "skin1004-madagascar-centella-ampoule-100ml",
    subtitle: "100ml",
    brand_handle: "skin1004",
    origin_country: "KR",
    price_bdt: 2300,
  },
  {
    title: "SKIN1004 Madagascar Centella Ampoule 55ml",
    handle: "skin1004-madagascar-centella-ampoule-55ml",
    subtitle: "55ml",
    brand_handle: "skin1004",
    origin_country: "KR",
    price_bdt: 1800,
  },
  {
    title: "SKIN1004 Madagascar Centella Tone Brightening Capsule Ampoule 100ml",
    handle: "skin1004-madagascar-centella-tone-brightening-capsule-ampoule-100ml",
    subtitle: "100ml",
    brand_handle: "skin1004",
    origin_country: "KR",
    price_bdt: 2300,
  },
  {
    title: "SKIN1004 Madagascar Centella Tone Brightening Capsule Ampoule 50ml",
    handle: "skin1004-madagascar-centella-tone-brightening-capsule-ampoule-50ml",
    subtitle: "50ml",
    brand_handle: "skin1004",
    origin_country: "KR",
    price_bdt: 1800,
  },
  {
    title: "SKIN1004 Madagascar Centella Light Cleansing Oil 200ml",
    handle: "skin1004-madagascar-centella-light-cleansing-oil-200ml",
    subtitle: "200ml",
    brand_handle: "skin1004",
    origin_country: "KR",
    price_bdt: 1800,
  },
  {
    title: "SKIN1004 Madagascar Centella Hyalu-Cica Water-Fit Sun Serum 50ml",
    handle: "skin1004-madagascar-centella-hyalu-cica-water-fit-sun-serum-50ml",
    subtitle: "50ml",
    brand_handle: "skin1004",
    origin_country: "KR",
    price_bdt: 1500,
  },
  {
    title: "SKIN1004 Madagascar Centella Probio-Cica Enrich Cream 50ml",
    handle: "skin1004-madagascar-centella-probio-cica-enrich-cream-50ml",
    subtitle: "50ml",
    brand_handle: "skin1004",
    origin_country: "KR",
    price_bdt: 2100,
  },
  {
    title: "SKIN1004 Madagascar Centella Cream 75ml",
    handle: "skin1004-madagascar-centella-cream-75ml",
    subtitle: "75ml",
    brand_handle: "skin1004",
    origin_country: "KR",
    price_bdt: 1800,
  },
  {
    title: "SKIN1004 Madagascar Centella Ampoule Foam",
    handle: "skin1004-madagascar-centella-ampoule-foam",
    brand_handle: "skin1004",
    origin_country: "KR",
    price_bdt: 1500,
  },
  {
    title: "SKIN1004 Madagascar Centella Hyalu Cica Silky Fit Sun Stick 20g",
    handle: "skin1004-madagascar-centella-hyalu-cica-silky-fit-sun-stick-20g",
    subtitle: "20g",
    brand_handle: "skin1004",
    origin_country: "KR",
    price_bdt: 1600,
  },
  {
    title: "SKIN1004 Madagascar Centella Probio-Cica Essence Toner 210ml",
    handle: "skin1004-madagascar-centella-probio-cica-essence-toner-210ml",
    subtitle: "210ml",
    brand_handle: "skin1004",
    origin_country: "KR",
    price_bdt: 1600,
  },
  {
    title: "SKIN1004 Probio-Cica Intensive Ampoule 50ml",
    handle: "skin1004-probio-cica-intensive-ampoule-50ml",
    subtitle: "50ml",
    brand_handle: "skin1004",
    origin_country: "KR",
    price_bdt: 2300,
  },
  {
    title: "SKIN1004 Tone Brightening Capsule Cream 75ml",
    handle: "skin1004-tone-brightening-capsule-cream-75ml",
    subtitle: "75ml",
    brand_handle: "skin1004",
    origin_country: "KR",
    price_bdt: 1800,
  },

  // ── SKINFOOD ──────────────────────────────────────────────────────────────
  {
    title: "SKINFOOD Rice Mask Wash Off 120g",
    handle: "skinfood-rice-mask-wash-off-120g",
    subtitle: "120g",
    brand_handle: "skinfood",
    origin_country: "KR",
    price_bdt: 1200,
  },
  {
    title: "SKINFOOD Rice Daily Brightening Cleansing Foam 150ml",
    handle: "skinfood-rice-daily-brightening-cleansing-foam-150ml",
    subtitle: "150ml",
    brand_handle: "skinfood",
    origin_country: "KR",
    price_bdt: 1200,
  },
  {
    title: "SKINFOOD Egg White Pore Mask 120g",
    handle: "skinfood-egg-white-pore-mask-120g",
    subtitle: "120g",
    brand_handle: "skinfood",
    origin_country: "KR",
    price_bdt: 1600,
  },
  {
    title: "SKINFOOD Black Sugar Perfect Essential Scrub 2X 210g",
    handle: "skinfood-black-sugar-perfect-essential-scrub-2x-210g",
    subtitle: "210g",
    brand_handle: "skinfood",
    origin_country: "KR",
    price_bdt: 1700,
  },
  {
    title: "SKINFOOD Black Sugar Mask Wash Off 120g",
    handle: "skinfood-black-sugar-mask-wash-off-120g",
    subtitle: "120g",
    brand_handle: "skinfood",
    origin_country: "KR",
    price_bdt: 1500,
  },
  {
    title: "SKINFOOD Black Sugar Perfect Scrub Foam 180ml",
    handle: "skinfood-black-sugar-perfect-scrub-foam-180ml",
    subtitle: "180ml",
    brand_handle: "skinfood",
    origin_country: "KR",
    price_bdt: 1200,
  },

  // ── SOME BY MI ────────────────────────────────────────────────────────────
  {
    title: "SOME BY MI AHA BHA PHA 30 Days Miracle Starter Kit",
    handle: "some-by-mi-aha-bha-pha-30-days-miracle-starter-kit",
    brand_handle: "some-by-mi",
    origin_country: "KR",
    price_bdt: 1800,
  },
  {
    title: "SOME BY MI AHA BHA PHA 30 Days Miracle Acne Clear Body Cleanser 300ml",
    handle: "some-by-mi-aha-bha-pha-30-days-miracle-acne-clear-body-cleanser-300ml",
    subtitle: "300ml",
    brand_handle: "some-by-mi",
    origin_country: "KR",
    price_bdt: 2200,
  },
  {
    title: "SOME BY MI AHA BHA PHA 30 Days Miracle AC SOS Kit",
    handle: "some-by-mi-aha-bha-pha-30-days-miracle-ac-sos-kit",
    brand_handle: "some-by-mi",
    origin_country: "KR",
    price_bdt: 1900,
    sale_price_bdt: 1800,
  },
  {
    title: "SOME BY MI Yuja Niacin Blemish Care Serum 50ml",
    handle: "some-by-mi-yuja-niacin-blemish-care-serum-50ml",
    subtitle: "50ml",
    brand_handle: "some-by-mi",
    origin_country: "KR",
    price_bdt: 1800,
  },
  {
    title: "SOME BY MI Galactomyces Pure Vitamin C Glow Serum 30ml",
    handle: "some-by-mi-galactomyces-pure-vitamin-c-glow-serum-30ml",
    subtitle: "30ml",
    brand_handle: "some-by-mi",
    origin_country: "KR",
    price_bdt: 1800,
  },
  {
    title: "SOME BY MI AHA BHA PHA 30 Days Miracle Acne Clear Foam 150g",
    handle: "some-by-mi-aha-bha-pha-30-days-miracle-acne-clear-foam-150g",
    subtitle: "150g",
    brand_handle: "some-by-mi",
    origin_country: "KR",
    price_bdt: 1500,
  },
  {
    title: "SOME BY MI AHA BHA PHA 30 Days Miracle Serum 30ml",
    handle: "some-by-mi-aha-bha-pha-30-days-miracle-serum-30ml",
    subtitle: "30ml",
    brand_handle: "some-by-mi",
    origin_country: "KR",
    price_bdt: 1700,
  },
  {
    title: "SOME BY MI Retinol Intense Advanced Triple Action Eye Cream",
    handle: "some-by-mi-retinol-intense-advanced-triple-action-eye-cream",
    brand_handle: "some-by-mi",
    origin_country: "KR",
    price_bdt: 1800,
    sale_price_bdt: 1700,
  },
  {
    title: "SOME BY MI AHA BHA PHA 30 Days Miracle Cream",
    handle: "some-by-mi-aha-bha-pha-30-days-miracle-cream",
    brand_handle: "some-by-mi",
    origin_country: "KR",
    price_bdt: 2000,
    sale_price_bdt: 1900,
  },
  {
    title: "SOME BY MI Retinol Intense Reactivating Serum 30ml",
    handle: "some-by-mi-retinol-intense-reactivating-serum-30ml",
    subtitle: "30ml",
    brand_handle: "some-by-mi",
    origin_country: "KR",
    price_bdt: 2000,
  },
  {
    title: "SOME BY MI AHA BHA PHA 30 Days Miracle Toner 150ml",
    handle: "some-by-mi-aha-bha-pha-30-days-miracle-toner-150ml",
    subtitle: "150ml",
    brand_handle: "some-by-mi",
    origin_country: "KR",
    price_bdt: 1700,
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

  // ── Load categories keyed by handle ────────────────────────────────────
  const svc = productService as unknown as {
    listProductCategories: (
      filters: Record<string, unknown>,
      options: Record<string, unknown>
    ) => Promise<Array<{ id: string; handle: string }>>
  }
  const allCategories = await svc.listProductCategories({}, { take: 500 })
  const categoryByHandle: Record<string, string> = {}
  for (const cat of allCategories) {
    categoryByHandle[cat.handle] = cat.id
  }

  let created = 0
  let skipped = 0
  let categorised = 0
  let errors = 0

  for (const p of PRODUCTS) {
    try {
      // Infer category IDs for this product
      const categoryHandles = inferCategoryHandles(p.title)
      const categoryIds = categoryHandles
        .map((h) => categoryByHandle[h])
        .filter(Boolean) as string[]

      // Check if product already exists
      const existing = await productService.listProducts(
        { handle: [p.handle] },
        { relations: ['categories'] }
      )

      if (existing.length > 0) {
        console.log(`  Skipped (exists): ${p.handle}`)
        skipped++

        // Idempotently assign missing categories to existing product
        const existingCatIds = new Set(
          ((existing[0] as unknown as { categories?: { id: string }[] }).categories ?? []).map((c) => c.id)
        )
        const missingCatIds = categoryIds.filter((id) => !existingCatIds.has(id))

        if (missingCatIds.length > 0) {
          await productService.updateProducts(existing[0].id, {
            category_ids: [...Array.from(existingCatIds), ...missingCatIds],
          })
          console.log(`    → Assigned ${missingCatIds.length} missing categories: ${categoryHandles.join(', ')}`)
          categorised++
        }
        continue
      }

      const collectionId = collectionByHandle[p.brand_handle]
      if (!collectionId) {
        console.warn(
          `  Warning: brand collection '${p.brand_handle}' not found — run seed-brands.ts first`
        )
      }

      // Create the product with categories
      const product = await productService.createProducts([
        {
          title: p.title,
          handle: p.handle,
          subtitle: p.subtitle,
          description: p.description,
          status: "published",
          collection_id: collectionId ?? undefined,
          origin_country: p.origin_country,
          category_ids: categoryIds,
          images: [],
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
            price_bdt: p.price_bdt,
            sale_price_bdt: p.sale_price_bdt ?? null,
          },
        },
      ])

      console.log(`  Created product: ${p.title} (id: ${product[0].id}) → [${categoryHandles.join(', ')}]`)

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
          prices.push({
            currency_code: "bdt",
            amount: p.sale_price_bdt,
          })
        }

        try {
          const priceSet = await pricingService.createPriceSets([{ prices }])

          await productService.updateProductVariants(variantId, {
            metadata: {
              price_set_id: priceSet[0].id,
              price_bdt: p.price_bdt,
              sale_price_bdt: p.sale_price_bdt ?? null,
            },
          })

          console.log(
            `    Prices set: ৳${p.price_bdt}${p.sale_price_bdt ? ` → ৳${p.sale_price_bdt}` : ""}`
          )
        } catch (priceErr) {
          console.warn(
            `    Warning: could not create prices for ${p.handle}:`,
            priceErr
          )
        }
      }

      created++
    } catch (err) {
      console.error(`  Error creating product ${p.handle}:`, err)
      errors++
    }
  }

  console.log(
    `\nProduct seeding complete. Created: ${created}, Skipped: ${skipped}, Categories updated: ${categorised}, Errors: ${errors}`
  )
}
