import { defineWidgetConfig } from '@medusajs/admin-sdk'
import { Heading, Text, Badge } from '@medusajs/ui'
import { useEffect, useState } from 'react'

type Variant = {
  id: string
  title: string
  metadata?: Record<string, unknown> | null
}

type Product = {
  id: string
  title: string
  thumbnail?: string | null
  variants?: Variant[]
}

type CollectionData = {
  id: string
  metadata?: Record<string, unknown> | null
}

function getProductPrice(product: Product): { price: number; label: string } {
  const variant = product.variants?.[0]
  const meta = (variant?.metadata ?? {}) as Record<string, unknown>
  const saleTaka = Number(meta.sale_price_bdt ?? 0)
  const mrpTaka = Number(meta.price_bdt ?? 0)
  if (saleTaka > 0) return { price: saleTaka, label: `৳${saleTaka} (sale)` }
  if (mrpTaka > 0) return { price: mrpTaka, label: `৳${mrpTaka}` }
  return { price: 0, label: '—' }
}

const ComboPricingWidget = ({ data }: { data: CollectionData }) => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/admin/collections/${data.id}?fields=*products.variants,*products.variants.metadata`, {
      credentials: 'include',
    })
      .then((r) => r.json())
      .then((json) => {
        setProducts(json.collection?.products ?? [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [data.id])

  const meta = (data.metadata ?? {}) as Record<string, unknown>
  const comboPriceTaka = Number(meta.combo_price ?? 0)
  const originalPriceTaka = Number(meta.original_price ?? 0)

  const calculatedTotal = products.reduce((sum, p) => sum + getProductPrice(p).price, 0)
  const discount = (originalPriceTaka || calculatedTotal) - comboPriceTaka
  const discountPct = (originalPriceTaka || calculatedTotal) > 0
    ? Math.round((discount / (originalPriceTaka || calculatedTotal)) * 100)
    : 0

  if (loading) return null

  return (
    <div className="bg-white border border-ui-border-base rounded-lg p-4 space-y-4">
      <Heading level="h2" className="text-ui-fg-base">Combo Pricing</Heading>

      {products.length === 0 ? (
        <Text className="text-ui-fg-muted text-sm">No products in this collection yet.</Text>
      ) : (
        <>
          {/* Per-product prices */}
          <div className="space-y-2">
            {products.map((p) => {
              const { label } = getProductPrice(p)
              const { price } = getProductPrice(p)
              return (
                <div key={p.id} className="flex items-center justify-between text-sm">
                  <Text className="text-ui-fg-base line-clamp-1 flex-1 mr-4">{p.title}</Text>
                  <Text className={`font-medium ${price === 0 ? 'text-ui-fg-muted' : 'text-ui-fg-base'}`}>
                    {label}
                  </Text>
                </div>
              )
            })}
          </div>

          {/* Totals */}
          <div className="border-t border-ui-border-base pt-3 space-y-1.5 text-sm">
            <div className="flex justify-between">
              <Text className="text-ui-fg-muted">Calculated original total</Text>
              <Text className="font-semibold text-ui-fg-base">
                ৳{calculatedTotal.toLocaleString('en-BD')}
              </Text>
            </div>

            {originalPriceTaka > 0 && originalPriceTaka !== calculatedTotal && (
              <div className="flex justify-between">
                <Text className="text-ui-fg-muted">metadata original_price</Text>
                <Text className="font-medium text-ui-fg-subtle">
                  ৳{originalPriceTaka.toLocaleString('en-BD')}
                  {originalPriceTaka !== calculatedTotal && (
                    <span className="ml-1 text-ui-fg-error text-xs">(differs from calculated)</span>
                  )}
                </Text>
              </div>
            )}

            {comboPriceTaka > 0 && (
              <>
                <div className="flex justify-between">
                  <Text className="text-ui-fg-muted">Combo price (metadata)</Text>
                  <Text className="font-semibold text-green-600">
                    ৳{comboPriceTaka.toLocaleString('en-BD')}
                  </Text>
                </div>
                <div className="flex justify-between items-center">
                  <Text className="text-ui-fg-muted">Savings</Text>
                  <Badge color="green" size="xsmall">
                    ৳{discount.toLocaleString('en-BD')} ({discountPct}% off)
                  </Badge>
                </div>
              </>
            )}

            {comboPriceTaka === 0 && (
              <Text className="text-ui-fg-muted text-xs">
                Set <code>combo_price</code> in metadata to see savings.
              </Text>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export const config = defineWidgetConfig({
  zone: 'product_collection.details.after',
})

export default ComboPricingWidget
