import { defineWidgetConfig } from '@medusajs/admin-sdk'
import { Badge, Heading, Text } from '@medusajs/ui'
import { useEffect, useState } from 'react'

type MediaCount = {
  productId: string
  title: string
  handle: string
  count: number
}

const ProductMediaCountWidget = () => {
  const [rows, setRows] = useState<MediaCount[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'has' | 'missing'>('all')

  useEffect(() => {
    Promise.all([
      fetch('/admin/products?limit=200&fields=id,title,handle', { credentials: 'include' }).then((r) => r.json()),
      fetch('/admin/media?entityType=product&limit=500', { credentials: 'include' }).then((r) => r.json()),
    ])
      .then(([productsRes, mediaRes]) => {
        const products: { id: string; title: string; handle: string }[] = productsRes.products ?? []
        const mediaFiles: { entityId?: string }[] = mediaRes.data ?? []

        const countMap: Record<string, number> = {}
        for (const f of mediaFiles) {
          if (f.entityId) countMap[f.entityId] = (countMap[f.entityId] ?? 0) + 1
        }

        setRows(
          products.map((p) => ({
            productId: p.id,
            title: p.title,
            handle: p.handle,
            count: countMap[p.id] ?? 0,
          }))
        )
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return null

  const filtered = rows.filter((r) =>
    filter === 'has' ? r.count > 0 : filter === 'missing' ? r.count === 0 : true
  )

  const hasCount = rows.filter((r) => r.count > 0).length
  const missingCount = rows.filter((r) => r.count === 0).length

  return (
    <div className="bg-white border border-ui-border-base rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <Heading level="h2" className="text-ui-fg-base">Product Media</Heading>
        <div className="flex items-center gap-2">
          <Badge color="green" size="xsmall">{hasCount} have media</Badge>
          <Badge color="red" size="xsmall">{missingCount} missing</Badge>
        </div>
      </div>

      {/* Filter tabs */}
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

      {/* Table */}
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
              {row.count > 0 ? (
                <Badge color="green" size="xsmall">{row.count} file{row.count !== 1 ? 's' : ''}</Badge>
              ) : (
                <Badge color="red" size="xsmall">No media</Badge>
              )}
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
