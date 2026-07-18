import { defineWidgetConfig } from '@medusajs/admin-sdk'
import { Heading, Text, Button, Input, toast } from '@medusajs/ui'
import { useEffect, useRef, useState } from 'react'
import { Trash, ArrowUpMini, ArrowDownMini, MagnifyingGlass } from '@medusajs/icons'

type Product = {
  id: string
  title: string
  handle?: string
  thumbnail?: string | null
}

type CollectionData = {
  id: string
  metadata?: Record<string, unknown> | null
}

function parseIds(metadata: Record<string, unknown> | null | undefined): string[] {
  const raw = metadata?.product_ids
  if (typeof raw !== 'string') return []
  return raw.split(',').map((id) => id.trim()).filter(Boolean)
}

const ComboProductsWidget = ({ data }: { data: CollectionData }) => {
  const [selected, setSelected] = useState<Product[]>([])
  const [term, setTerm] = useState('')
  const [results, setResults] = useState<Product[]>([])
  const [searching, setSearching] = useState(false)
  const [saving, setSaving] = useState(false)
  const debounce = useRef<ReturnType<typeof setTimeout>>()

  const isCombo = data.metadata?.is_combo === 'true' || data.metadata?.is_combo === true

  // Load the currently-selected member products (order preserved by metadata.product_ids).
  useEffect(() => {
    if (!isCombo) return
    const ids = parseIds(data.metadata)
    if (ids.length === 0) {
      setSelected([])
      return
    }
    const qs = new URLSearchParams({ limit: String(ids.length), fields: 'id,title,handle,thumbnail' })
    ids.forEach((id) => qs.append('id[]', id))
    fetch(`/admin/products?${qs.toString()}`, { credentials: 'include' })
      .then((r) => r.json())
      .then((json) => {
        const byId = new Map<string, Product>((json.products ?? []).map((p: Product) => [p.id, p]))
        setSelected(ids.map((id) => byId.get(id)).filter((p): p is Product => Boolean(p)))
      })
      .catch(() => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.id])

  // Debounced product search.
  useEffect(() => {
    if (!isCombo) return
    if (debounce.current) clearTimeout(debounce.current)
    if (term.trim().length < 2) {
      setResults([])
      return
    }
    setSearching(true)
    debounce.current = setTimeout(() => {
      const qs = new URLSearchParams({ q: term.trim(), limit: '10', fields: 'id,title,handle,thumbnail' })
      fetch(`/admin/products?${qs.toString()}`, { credentials: 'include' })
        .then((r) => r.json())
        .then((json) => setResults(json.products ?? []))
        .catch(() => setResults([]))
        .finally(() => setSearching(false))
    }, 300)
    return () => {
      if (debounce.current) clearTimeout(debounce.current)
    }
  }, [term, isCombo])

  async function persist(next: Product[]) {
    setSaving(true)
    try {
      const metadata: Record<string, unknown> = {
        ...(data.metadata ?? {}),
        product_ids: next.map((p) => p.id).join(','),
      }
      const res = await fetch(`/admin/collections/${data.id}`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ metadata }),
      })
      if (!res.ok) throw new Error(String(res.status))
      setSelected(next)
      toast.success('Combo products updated')
    } catch {
      toast.error('Failed to update combo products')
    } finally {
      setSaving(false)
    }
  }

  function add(product: Product) {
    if (selected.some((p) => p.id === product.id)) {
      toast.info('Already in this combo')
      return
    }
    persist([...selected, product])
    setTerm('')
    setResults([])
  }

  function remove(id: string) {
    persist(selected.filter((p) => p.id !== id))
  }

  function move(index: number, dir: -1 | 1) {
    const target = index + dir
    if (target < 0 || target >= selected.length) return
    const next = [...selected]
    ;[next[index], next[target]] = [next[target], next[index]]
    persist(next)
  }

  if (!isCombo) return null

  return (
    <div className="bg-ui-bg-base border border-ui-border-base rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <Heading level="h2" className="text-ui-fg-base">Combo Products</Heading>
        <Text className="text-ui-fg-muted text-sm">{selected.length} selected</Text>
      </div>

      <Text className="text-ui-fg-subtle text-xs">
        Members are referenced by id — they keep their own brand collection and still appear under
        brand filters.
      </Text>

      {/* Search */}
      <div className="relative">
        <div className="relative">
          <MagnifyingGlass className="absolute left-2 top-1/2 -translate-y-1/2 text-ui-fg-muted" />
          <Input
            className="pl-8"
            placeholder="Search products to add…"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            disabled={saving}
          />
        </div>
        {results.length > 0 && (
          <div className="absolute z-10 mt-1 w-full rounded-lg border border-ui-border-base bg-ui-bg-base shadow-elevation-flyout max-h-72 overflow-auto">
            {results.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => add(p)}
                className="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-ui-bg-base-hover"
              >
                <div className="h-8 w-8 flex-shrink-0 overflow-hidden rounded bg-ui-bg-subtle">
                  {p.thumbnail && (
                    <img src={p.thumbnail} alt={p.title} className="h-full w-full object-cover" />
                  )}
                </div>
                <Text className="text-ui-fg-base text-sm line-clamp-1">{p.title}</Text>
              </button>
            ))}
          </div>
        )}
        {searching && term.trim().length >= 2 && results.length === 0 && (
          <Text className="text-ui-fg-muted text-xs mt-1">Searching…</Text>
        )}
      </div>

      {/* Selected list */}
      {selected.length === 0 ? (
        <Text className="text-ui-fg-muted text-sm">No products added to this combo yet.</Text>
      ) : (
        <div className="space-y-2">
          {selected.map((p, i) => (
            <div
              key={p.id}
              className="flex items-center gap-3 rounded-lg border border-ui-border-base p-2"
            >
              <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded bg-ui-bg-subtle">
                {p.thumbnail && (
                  <img src={p.thumbnail} alt={p.title} className="h-full w-full object-cover" />
                )}
              </div>
              <Text className="flex-1 text-ui-fg-base text-sm line-clamp-1">{p.title}</Text>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => move(i, -1)}
                  disabled={i === 0 || saving}
                  className="p-1 text-ui-fg-muted hover:text-ui-fg-base disabled:opacity-30"
                >
                  <ArrowUpMini />
                </button>
                <button
                  type="button"
                  onClick={() => move(i, 1)}
                  disabled={i === selected.length - 1 || saving}
                  className="p-1 text-ui-fg-muted hover:text-ui-fg-base disabled:opacity-30"
                >
                  <ArrowDownMini />
                </button>
                <button
                  type="button"
                  onClick={() => remove(p.id)}
                  disabled={saving}
                  className="p-1 text-ui-fg-error hover:opacity-80 disabled:opacity-30"
                >
                  <Trash />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export const config = defineWidgetConfig({
  zone: 'product_collection.details.before',
})

export default ComboProductsWidget
