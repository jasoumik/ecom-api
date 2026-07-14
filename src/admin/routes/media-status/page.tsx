import { defineRouteConfig } from '@medusajs/admin-sdk'
import { Photo } from '@medusajs/icons'
import { Badge, Heading, Input, Table, Text } from '@medusajs/ui'
import { useEffect, useState } from 'react'

type ProductRow = {
  id: string
  title: string
  handle: string
  status: string
  thumbnail: string | null
  nativeImages: number
  customMedia: number
  priceBdt: number | null
  salePriceBdt: number | null
  variantCount: number
  categoryName: string | null
  collectionTitle: string | null
  updatedAt: string | null
}

const PAGE_SIZE = 50

const fmt = (n: number) => `৳${n.toLocaleString('en-BD')}`

const MediaStatusPage = () => {
  const [rows, setRows] = useState<ProductRow[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'has' | 'missing'>('all')
  const [page, setPage] = useState(1)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      fetch(
        '/admin/products?limit=500&fields=id,title,handle,status,thumbnail,updated_at,*images,*variants,*variants.metadata,*categories,*collection',
        { credentials: 'include' }
      ).then((r) => r.json()),
      fetch('/admin/media?entityType=product&limit=1000', { credentials: 'include' }).then((r) => r.json()),
    ])
      .then(([productsRes, mediaRes]) => {
        const products: {
          id: string
          title: string
          handle: string
          status: string
          thumbnail?: string | null
          updated_at?: string | null
          images?: { url: string }[]
          variants?: { metadata?: Record<string, unknown> }[]
          categories?: { name: string }[]
          collection?: { title: string } | null
        }[] = productsRes.products ?? []

        const customCountMap: Record<string, number> = {}
        for (const f of (mediaRes.data ?? []) as { entityId?: string }[]) {
          if (f.entityId) customCountMap[f.entityId] = (customCountMap[f.entityId] ?? 0) + 1
        }

        setRows(
          products.map((p) => {
            const firstVariant = p.variants?.[0]
            const meta = (firstVariant?.metadata ?? {}) as Record<string, unknown>
            return {
              id: p.id,
              title: p.title,
              handle: p.handle ?? '',
              status: p.status ?? 'draft',
              thumbnail: p.thumbnail ?? null,
              nativeImages: p.images?.length ?? 0,
              customMedia: customCountMap[p.id] ?? 0,
              priceBdt: meta.price_bdt ? Number(meta.price_bdt) : null,
              salePriceBdt: meta.sale_price_bdt ? Number(meta.sale_price_bdt) : null,
              variantCount: p.variants?.length ?? 0,
              categoryName: p.categories?.[0]?.name ?? null,
              collectionTitle: p.collection?.title ?? null,
              updatedAt: p.updated_at ?? null,
            }
          })
        )
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const totalMedia = (r: ProductRow) => r.nativeImages + r.customMedia

  const filtered = rows
    .filter((r) => {
      if (filter === 'has') return totalMedia(r) > 0
      if (filter === 'missing') return totalMedia(r) === 0
      return true
    })
    .filter((r) =>
      search.trim() === '' ||
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.handle.toLowerCase().includes(search.toLowerCase())
    )

  // Reset to page 1 when filter/search changes
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  const hasCount = rows.filter((r) => totalMedia(r) > 0).length
  const missingCount = rows.filter((r) => totalMedia(r) === 0).length

  const handleSearchChange = (val: string) => { setSearch(val); setPage(1) }
  const handleFilterChange = (val: typeof filter) => { setFilter(val); setPage(1) }

  return (
    <div className="flex flex-col gap-y-4 p-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <Heading>Product Media Status</Heading>
          <Text className="text-ui-fg-muted text-sm mt-0.5">
            {rows.length} products · {hasCount} have media · {missingCount} missing
          </Text>
        </div>
        <div className="flex items-center gap-2">
          <Badge color="green" size="xsmall">{hasCount} have media</Badge>
          <Badge color="red" size="xsmall">{missingCount} missing</Badge>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="flex items-center gap-3 flex-wrap">
        <Input
          placeholder="Search by name or handle…"
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="max-w-xs"
        />
        <div className="flex gap-1 text-xs border border-ui-border-base rounded-lg overflow-hidden">
          {(['all', 'has', 'missing'] as const).map((f) => (
            <button
              key={f}
              onClick={() => handleFilterChange(f)}
              className={`px-3 py-1.5 transition-colors ${
                filter === f
                  ? 'bg-ui-bg-interactive text-white font-medium'
                  : 'bg-ui-bg-base text-ui-fg-muted hover:bg-ui-bg-subtle'
              }`}
            >
              {f === 'all' ? `All (${rows.length})` : f === 'has' ? `Has Media (${hasCount})` : `Missing (${missingCount})`}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <Text className="text-ui-fg-muted">Loading products…</Text>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Text className="text-ui-fg-muted">No products match your search or filter.</Text>
        </div>
      ) : (
        <>
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Thumbnail</Table.HeaderCell>
                <Table.HeaderCell>Product</Table.HeaderCell>
                <Table.HeaderCell>Status</Table.HeaderCell>
                <Table.HeaderCell>Price (BDT)</Table.HeaderCell>
                <Table.HeaderCell>Variants</Table.HeaderCell>
                <Table.HeaderCell>Category</Table.HeaderCell>
                <Table.HeaderCell>Collection</Table.HeaderCell>
                <Table.HeaderCell>Images</Table.HeaderCell>
                <Table.HeaderCell>Custom Media</Table.HeaderCell>
                <Table.HeaderCell>Media</Table.HeaderCell>
                <Table.HeaderCell>Updated</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {paginated.map((row) => (
                <Table.Row
                  key={row.id}
                  className="cursor-pointer hover:bg-ui-bg-subtle transition-colors"
                  onClick={() => { window.location.href = `/app/products/${row.id}` }}
                >
                  {/* Thumbnail */}
                  <Table.Cell>
                    {row.thumbnail ? (
                      <img
                        src={row.thumbnail}
                        alt={row.title}
                        className="w-10 h-10 rounded-lg object-cover border border-ui-border-base"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-ui-bg-subtle border border-ui-border-base flex items-center justify-center">
                        <Photo className="text-ui-fg-muted" />
                      </div>
                    )}
                  </Table.Cell>

                  {/* Product */}
                  <Table.Cell>
                    <div>
                      <p className="font-medium text-ui-fg-base line-clamp-1 max-w-[180px]">{row.title}</p>
                      <p className="text-xs text-ui-fg-muted">{row.handle}</p>
                    </div>
                  </Table.Cell>

                  {/* Status */}
                  <Table.Cell>
                    <Badge color={row.status === 'published' ? 'green' : 'grey'} size="xsmall">
                      {row.status}
                    </Badge>
                  </Table.Cell>

                  {/* Price */}
                  <Table.Cell>
                    {row.salePriceBdt ? (
                      <div>
                        <p className="text-xs font-semibold text-green-600">{fmt(row.salePriceBdt)}</p>
                        <p className="text-xs text-ui-fg-muted line-through">{row.priceBdt ? fmt(row.priceBdt) : '—'}</p>
                      </div>
                    ) : row.priceBdt ? (
                      <p className="text-xs font-medium">{fmt(row.priceBdt)}</p>
                    ) : (
                      <Text className="text-ui-fg-muted text-xs">—</Text>
                    )}
                  </Table.Cell>

                  {/* Variants */}
                  <Table.Cell>
                    <Badge color="grey" size="xsmall">{row.variantCount}</Badge>
                  </Table.Cell>

                  {/* Category */}
                  <Table.Cell>
                    {row.categoryName ? (
                      <Text className="text-xs text-ui-fg-base">{row.categoryName}</Text>
                    ) : (
                      <Text className="text-ui-fg-muted text-xs">—</Text>
                    )}
                  </Table.Cell>

                  {/* Collection */}
                  <Table.Cell>
                    {row.collectionTitle ? (
                      <Badge color="blue" size="xsmall">{row.collectionTitle}</Badge>
                    ) : (
                      <Text className="text-ui-fg-muted text-xs">—</Text>
                    )}
                  </Table.Cell>

                  {/* Native images */}
                  <Table.Cell>
                    {row.nativeImages > 0 ? (
                      <Badge color="blue" size="xsmall">{row.nativeImages}</Badge>
                    ) : (
                      <Text className="text-ui-fg-muted text-xs">0</Text>
                    )}
                  </Table.Cell>

                  {/* Custom media */}
                  <Table.Cell>
                    {row.customMedia > 0 ? (
                      <Badge color="green" size="xsmall">{row.customMedia}</Badge>
                    ) : (
                      <Text className="text-ui-fg-muted text-xs">0</Text>
                    )}
                  </Table.Cell>

                  {/* Media status */}
                  <Table.Cell>
                    {totalMedia(row) > 0 ? (
                      <Badge color="green" size="xsmall">✓</Badge>
                    ) : (
                      <Badge color="red" size="xsmall">✗</Badge>
                    )}
                  </Table.Cell>

                  {/* Updated at */}
                  <Table.Cell>
                    <Text className="text-xs text-ui-fg-muted">
                      {row.updatedAt ? new Date(row.updatedAt).toLocaleDateString('en-GB') : '—'}
                    </Text>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between text-sm text-ui-fg-muted pt-2">
              <Text className="text-xs">
                Showing {(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, filtered.length)} of {filtered.length}
              </Text>
              <div className="flex items-center gap-1">
                <button
                  disabled={safePage === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-3 py-1.5 rounded border border-ui-border-base text-xs disabled:opacity-40 hover:bg-ui-bg-subtle transition-colors"
                >
                  ← Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === totalPages || Math.abs(p - safePage) <= 1)
                  .reduce<(number | '...')[]>((acc, p, i, arr) => {
                    if (i > 0 && (p as number) - (arr[i - 1] as number) > 1) acc.push('...')
                    acc.push(p)
                    return acc
                  }, [])
                  .map((p, i) =>
                    p === '...' ? (
                      <span key={`ellipsis-${i}`} className="px-2 text-xs">…</span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => setPage(p as number)}
                        className={`px-3 py-1.5 rounded border text-xs transition-colors ${
                          safePage === p
                            ? 'bg-ui-bg-interactive text-white border-ui-bg-interactive font-medium'
                            : 'border-ui-border-base hover:bg-ui-bg-subtle'
                        }`}
                      >
                        {p}
                      </button>
                    )
                  )}
                <button
                  disabled={safePage === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-3 py-1.5 rounded border border-ui-border-base text-xs disabled:opacity-40 hover:bg-ui-bg-subtle transition-colors"
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export const config = defineRouteConfig({
  label: 'Media Status',
  icon: Photo,
})

export default MediaStatusPage
