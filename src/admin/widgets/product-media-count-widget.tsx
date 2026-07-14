import { defineWidgetConfig } from '@medusajs/admin-sdk'
import { Badge, Heading, Text } from '@medusajs/ui'
import { useEffect, useState } from 'react'

type MediaCount = {
  productId: string
  title: string
  nativeCount: number   // Medusa product images (thumbnail + gallery)
  customCount: number   // Custom media module uploads
}

const ProductMediaCountWidget = () => {
  const [rows, setRows] = useState<MediaCount[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'has' | 'missing'>('all')

  useEffect(() => {
    Promise.all([
      // Native Medusa images — thumbnail + images array
      fetch('/admin/products?limit=200&fields=id,title,thumbnail,*images', { credentials: 'include' })
        .then((r) => r.json()),
      // Custom media module uploads
      fetch('/admin/media?entityType=product&limit=500', { credentials: 'include' })
        .then((r) => r.json()),
    ])
      .then(([productsRes, mediaRes]) => {
        const products: { id: string; title: string; thumbnail?: string; images?: { url: string }[] }[] =
          productsRes.products ?? []

        const customCountMap: Record<string, number> = {}
        for (const f of (mediaRes.data ?? []) as { entityId?: string }[]) {
          if (f.entityId) customCountMap[f.entityId] = (customCountMap[f.entityId] ?? 0) + 1
        }

        setRows(
          products.map((p) => ({
            productId: p.id,
            title: p.title,
            nativeCount: (p.images?.length ?? 0) + (p.thumbnail ? 1 : 0),
            customCount: customCountMap[p.id] ?? 0,
          }))
        )
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return null

  const total = (r: MediaCount) => r.nativeCount + r.customCount
  const filtered = rows.filter((r) =>
    filter === 'has' ? total(r) > 0 : filter === 'missing' ? total(r) === 0 : true
  )
  const hasCount = rows.filter((r) => total(r) > 0).length
  const missingCount = rows.filter((r) => total(r) === 0).length

  return (
    <div className="bg-white border border-ui-border-base rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <Heading level="h2" className="text-ui-fg-base">Product Media Status</Heading>
        <div className="flex items-center gap-2">
          <Badge color="green" size="xsmall">{hasCount} have media</Badge>
          <Badge color="red" size="xsmall">{missingCount} missing</Badge>
        </div>
      </div>

      <div className="flex gap-1 text-xs border border-ui-border-base rounded-lg overflow-hidden w-fit">
        {(['all', 'has', 'missing'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 transition-colors ${
              filter === f
                ? 'bg-ui-bg-interactive text-white font-medium'
                : 'bg-ui-bg-base text-ui-fg-muted hover:bg-ui-bg-subtle'
            }`}
          >
            {f === 'all' ? 'All' : f === 'has' ? 'Has Media' : 'Missing'}
          </button>
        ))}
      </div>

      <div className="divide-y divide-ui-border-base text-sm max-h-96 overflow-y-auto">
        {filtered.length === 0 ? (
          <Text className="text-ui-fg-muted py-4 text-center text-sm">No products found.</Text>
        ) : (
          filtered.map((row) => (
            <div key={row.productId} className="flex items-center justify-between py-2 gap-4">
              <a
                href={`/app/products/${row.productId}`}
                className="text-ui-fg-base hover:text-ui-fg-interactive transition-colors line-clamp-1 flex-1"
              >
                {row.title}
              </a>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                {row.nativeCount > 0 && (
                  <Badge color="blue" size="xsmall">{row.nativeCount} image{row.nativeCount !== 1 ? 's' : ''}</Badge>
                )}
                {row.customCount > 0 && (
                  <Badge color="green" size="xsmall">{row.customCount} custom</Badge>
                )}
                {total(row) === 0 && (
                  <Badge color="red" size="xsmall">No media</Badge>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export const config = defineWidgetConfig({
  zone: 'product.list.after',
})

export default ProductMediaCountWidget
