// Shared types and mapper for combo-collections routes

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RawCollection = {
  id: string
  handle: string
  title: string
  metadata?: Record<string, unknown> | null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  products?: any[]
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function buildComboFromCollection(col: RawCollection): any {
  const meta = col.metadata ?? {}

  // Prices stored as whole taka in metadata; multiply ×100 for paisa
  const originalPrice = Number(meta.original_price ?? 0) * 100
  const comboPrice = Number(meta.combo_price ?? 0) * 100

  const items = (col.products ?? []).map((p: any, i: number) => ({
    id: `${col.id}-item-${i}`,
    product: {
      id: p.id,
      title: p.title ?? '',
      thumbnail: p.thumbnail ?? undefined,
      handle: p.handle ?? '',
      variants: p.variants ?? [],
    },
    variant_id: p.variants?.[0]?.id,
    quantity: 1,
    sort_order: i,
  }))

  return {
    id: col.id,
    handle: col.handle,
    promo_code: (meta.promo_code as string) ?? undefined,
    name_en: col.title,
    description_en: (meta.description as string) ?? undefined,
    image_url: (meta.image as string) ?? undefined,
    images: typeof meta.images === 'string'
      ? meta.images.split(',').map((u: string) => u.trim()).filter(Boolean)
      : undefined,
    original_price: originalPrice,
    combo_price: comboPrice,
    discount_pct:
      originalPrice > 0 && comboPrice > 0
        ? Math.round(((originalPrice - comboPrice) / originalPrice) * 100)
        : 0,
    currency: 'BDT',
    target_market: 'bd',
    is_active: true,
    items,
  }
}
