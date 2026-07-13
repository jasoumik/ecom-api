import { defineRouteConfig } from '@medusajs/admin-sdk'
import { Gift, Trash, PencilSquare, XMark, MagnifyingGlass } from '@medusajs/icons'
import { Badge, Button, Heading, Input, Label, Switch, Table, Text, toast } from '@medusajs/ui'
import { useEffect, useRef, useState } from 'react'

type ComboItem = {
  id?: string
  productId: string
  quantity: number
  productTitle?: string
  productThumb?: string
  productPrice?: number // whole taka BDT
}

type ComboOffer = {
  id: string
  name: string
  slug: string
  description: string | null
  image: string | null
  originalPrice: number
  comboPrice: number
  isActive: boolean
  items?: ComboItem[]
}

type ProductVariant = {
  id: string
  prices?: { amount: number; currency_code: string }[]
}

type Product = {
  id: string
  title: string
  thumbnail: string | null
  variants?: ProductVariant[]
}

const EMPTY_FORM = {
  name: '',
  slug: '',
  description: '',
  comboPrice: '',
  originalPrice: '',
  isActive: true,
}

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

const discountPct = (comboPrice: number, originalPrice: number) => {
  if (!originalPrice || originalPrice <= 0) return null
  const pct = Math.round((1 - comboPrice / originalPrice) * 100)
  return pct > 0 ? pct : null
}

// Extract BDT price from product variants (whole taka, decimal_digits=0)
const getBdtPrice = (product: Product): number => {
  const variant = product.variants?.[0]
  if (!variant) return 0
  const bdtPrice = variant.prices?.find((p) => p.currency_code === 'bdt')
  return bdtPrice?.amount ?? 0
}

const ComboOffersPage = () => {
  const [combos, setCombos] = useState<ComboOffer[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [items, setItems] = useState<ComboItem[]>([])
  const [productSearch, setProductSearch] = useState('')
  const [productResults, setProductResults] = useState<Product[]>([])
  const [searching, setSearching] = useState(false)
  const [originalPriceManual, setOriginalPriceManual] = useState(false)
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // ── Fetch all combos ──────────────────────────────────────────────────────
  const fetchCombos = async () => {
    setLoading(true)
    try {
      const res = await fetch('/admin/combos', { credentials: 'include' })
      const json = await res.json()
      setCombos(json.data ?? json.combos ?? [])
    } catch {
      toast.error('Failed to load combo offers')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCombos()
  }, [])

  // ── Auto-calculate original price from items ──────────────────────────────
  useEffect(() => {
    if (originalPriceManual) return
    const total = items.reduce((sum, it) => sum + (it.productPrice ?? 0) * it.quantity, 0)
    if (total > 0) {
      setForm((prev) => ({ ...prev, originalPrice: String(total) }))
    }
  }, [items, originalPriceManual])

  // ── Product search (debounced) ────────────────────────────────────────────
  useEffect(() => {
    if (!productSearch.trim()) {
      setProductResults([])
      return
    }
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current)
    searchTimerRef.current = setTimeout(async () => {
      setSearching(true)
      try {
        const res = await fetch(
          `/admin/products?q=${encodeURIComponent(productSearch)}&limit=10&fields=id,title,thumbnail,*variants,variants.*,variants.prices.*`,
          { credentials: 'include' },
        )
        const json = await res.json()
        setProductResults(json.products ?? [])
      } catch {
        // silently ignore search errors
      } finally {
        setSearching(false)
      }
    }, 350)
  }, [productSearch])

  // ── Form helpers ──────────────────────────────────────────────────────────
  const openCreate = () => {
    setEditId(null)
    setForm(EMPTY_FORM)
    setItems([])
    setOriginalPriceManual(false)
    setProductSearch('')
    setProductResults([])
    setShowForm(true)
  }

  const openEdit = async (combo: ComboOffer) => {
    setEditId(combo.id)
    setForm({
      name: combo.name,
      slug: combo.slug,
      description: combo.description ?? '',
      comboPrice: String(combo.comboPrice),
      originalPrice: String(combo.originalPrice),
      isActive: combo.isActive,
    })
    setOriginalPriceManual(true) // editing existing — don't overwrite
    try {
      const res = await fetch(`/admin/combos/${combo.id}`, { credentials: 'include' })
      const json = await res.json()
      const detail: ComboOffer = json.data ?? json.combo ?? combo
      setItems(
        (detail.items ?? []).map((it) => ({
          id: it.id,
          productId: it.productId,
          quantity: it.quantity,
          productTitle: it.productTitle,
          productThumb: it.productThumb,
          productPrice: it.productPrice,
        })),
      )
    } catch {
      setItems([])
    }
    setProductSearch('')
    setProductResults([])
    setShowForm(true)
  }

  const cancelForm = () => {
    setShowForm(false)
    setEditId(null)
    setForm(EMPTY_FORM)
    setItems([])
    setOriginalPriceManual(false)
    setProductSearch('')
    setProductResults([])
  }

  const handleNameChange = (value: string) => {
    setForm((prev) => ({
      ...prev,
      name: value,
      slug: prev.slug === slugify(prev.name) || prev.slug === '' ? slugify(value) : prev.slug,
    }))
  }

  const addProduct = (product: Product) => {
    if (items.find((it) => it.productId === product.id)) {
      toast.error('Product already added')
      return
    }
    const price = getBdtPrice(product)
    setItems((prev) => [
      ...prev,
      {
        productId: product.id,
        quantity: 1,
        productTitle: product.title,
        productThumb: product.thumbnail ?? undefined,
        productPrice: price,
      },
    ])
    setProductSearch('')
    setProductResults([])
  }

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((it) => it.productId !== productId))
  }

  const updateItemQty = (productId: string, quantity: number) => {
    setItems((prev) => prev.map((it) => (it.productId === productId ? { ...it, quantity } : it)))
  }

  // ── Save ──────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!form.name.trim()) { toast.error('Name is required'); return }
    if (!form.slug.trim()) { toast.error('Slug is required'); return }
    if (!form.comboPrice || Number(form.comboPrice) <= 0) { toast.error('Combo price must be greater than 0'); return }

    setSaving(true)
    try {
      const payload = {
        name: form.name.trim(),
        slug: form.slug.trim(),
        description: form.description.trim() || null,
        comboPrice: Number(form.comboPrice),
        originalPrice: Number(form.originalPrice) || 0,
        isActive: form.isActive,
      }

      let comboId = editId

      if (editId) {
        const res = await fetch(`/admin/combos/${editId}`, {
          method: 'PATCH',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error('Failed to update combo')
      } else {
        const res = await fetch('/admin/combos', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error('Failed to create combo')
        const json = await res.json()
        comboId = (json.data ?? json.combo)?.id
      }

      if (!comboId) throw new Error('No combo ID returned')

      if (items.length > 0) {
        const itemsRes = await fetch(`/admin/combos/${comboId}/items`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items: items.map((it) => ({ productId: it.productId, quantity: it.quantity })),
          }),
        })
        if (!itemsRes.ok) throw new Error('Failed to save combo items')
      }

      toast.success(editId ? 'Combo updated' : 'Combo created')
      cancelForm()
      fetchCombos()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to save combo')
    } finally {
      setSaving(false)
    }
  }

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete combo "${name}"? This cannot be undone.`)) return
    setDeleting(id)
    try {
      const res = await fetch(`/admin/combos/${id}`, { method: 'DELETE', credentials: 'include' })
      if (!res.ok) throw new Error('Failed to delete combo')
      toast.success('Combo deleted')
      fetchCombos()
    } catch {
      toast.error('Failed to delete combo')
    } finally {
      setDeleting(null)
    }
  }

  // ── Computed ──────────────────────────────────────────────────────────────
  const autoOriginalPrice = items.reduce((sum, it) => sum + (it.productPrice ?? 0) * it.quantity, 0)

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-y-6 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Heading level="h1">Combo Offers</Heading>
          <Text className="text-ui-fg-subtle mt-1">Manage bundled product combos with special pricing.</Text>
        </div>
        {!showForm && (
          <Button onClick={openCreate} size="small">+ New Combo</Button>
        )}
      </div>

      {/* Inline Form */}
      {showForm && (
        <div className="bg-ui-bg-base border border-ui-border-base rounded-lg p-6">
          <Heading level="h2" className="mb-5">
            {editId ? 'Edit Combo' : 'Create Combo'}
          </Heading>

          {/* Name + Slug */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mb-4">
            <div>
              <Label htmlFor="combo-name" className="mb-1.5 block">
                Name <span className="text-ui-fg-error">*</span>
              </Label>
              <Input
                id="combo-name"
                value={form.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Summer Bundle"
              />
            </div>
            <div>
              <Label htmlFor="combo-slug" className="mb-1.5 block">
                Slug <span className="text-ui-fg-error">*</span>
              </Label>
              <Input
                id="combo-slug"
                value={form.slug}
                onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
                placeholder="summer-bundle"
              />
            </div>
          </div>

          {/* Description */}
          <div className="mb-4">
            <Label htmlFor="combo-desc" className="mb-1.5 block">Description</Label>
            <textarea
              id="combo-desc"
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Optional description…"
              rows={2}
              className="w-full rounded-md border border-ui-border-base bg-ui-bg-field px-3 py-2 text-sm text-ui-fg-base placeholder:text-ui-fg-muted focus:border-ui-border-interactive focus:outline-none resize-none"
            />
          </div>

          {/* Active toggle */}
          <div className="mb-6 flex items-center gap-x-3">
            <Switch
              id="combo-active"
              checked={form.isActive}
              onCheckedChange={(checked) => setForm((prev) => ({ ...prev, isActive: checked }))}
            />
            <Label htmlFor="combo-active">Active</Label>
          </div>

          {/* ── Products (before prices) ─────────────────────────────────── */}
          <div className="mb-6">
            <Label className="mb-2 block text-base font-semibold">Products</Label>

            {/* Search */}
            <div className="relative mb-3">
              <div className="flex items-center gap-2 rounded-md border border-ui-border-base bg-ui-bg-field px-3 py-2">
                <MagnifyingGlass className="text-ui-fg-muted shrink-0" />
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Search products to add…"
                  className="flex-1 bg-transparent text-sm text-ui-fg-base placeholder:text-ui-fg-muted focus:outline-none"
                />
                {searching && <span className="text-xs text-ui-fg-muted">Searching…</span>}
              </div>

              {productResults.length > 0 && (
                <div className="absolute z-10 mt-1 w-full rounded-md border border-ui-border-base bg-ui-bg-base shadow-lg">
                  {productResults.map((product) => {
                    const price = getBdtPrice(product)
                    return (
                      <button
                        key={product.id}
                        type="button"
                        onClick={() => addProduct(product)}
                        className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm hover:bg-ui-bg-base-hover transition-colors"
                      >
                        {product.thumbnail ? (
                          <img
                            src={product.thumbnail}
                            alt={product.title}
                            className="h-8 w-8 rounded object-cover border border-ui-border-base shrink-0"
                          />
                        ) : (
                          <div className="h-8 w-8 rounded bg-ui-bg-subtle border border-ui-border-base shrink-0" />
                        )}
                        <span className="flex-1 text-ui-fg-base truncate">{product.title}</span>
                        {price > 0 && (
                          <span className="text-xs text-ui-fg-subtle shrink-0">৳{price.toLocaleString()}</span>
                        )}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Items list */}
            {items.length > 0 ? (
              <div className="space-y-2">
                {items.map((item) => (
                  <div
                    key={item.productId}
                    className="flex items-center gap-3 rounded-md border border-ui-border-base bg-ui-bg-subtle px-3 py-2"
                  >
                    {item.productThumb ? (
                      <img
                        src={item.productThumb}
                        alt={item.productTitle}
                        className="h-9 w-9 rounded object-cover border border-ui-border-base shrink-0"
                      />
                    ) : (
                      <div className="h-9 w-9 rounded bg-ui-bg-base border border-ui-border-base shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-ui-fg-base truncate">{item.productTitle ?? item.productId}</p>
                      {item.productPrice != null && item.productPrice > 0 && (
                        <p className="text-xs text-ui-fg-subtle">
                          ৳{item.productPrice.toLocaleString()} × {item.quantity} = ৳{(item.productPrice * item.quantity).toLocaleString()}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <Label className="text-xs text-ui-fg-subtle">Qty</Label>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItemQty(item.productId, Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-14 rounded border border-ui-border-base bg-ui-bg-field px-2 py-1 text-xs text-center focus:outline-none focus:border-ui-border-interactive"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.productId)}
                      className="text-ui-fg-muted hover:text-ui-fg-error transition-colors shrink-0"
                    >
                      <XMark />
                    </button>
                  </div>
                ))}

                {/* Items total */}
                {autoOriginalPrice > 0 && (
                  <div className="flex justify-end pt-1">
                    <span className="text-sm text-ui-fg-subtle">
                      Total (all items): <strong className="text-ui-fg-base">৳{autoOriginalPrice.toLocaleString()}</strong>
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <Text className="text-ui-fg-muted text-sm">No products added yet. Search above to add products.</Text>
            )}
          </div>

          {/* ── Pricing (after products) ─────────────────────────────────── */}
          <div className="border-t border-ui-border-base pt-5">
            <Label className="mb-3 block text-base font-semibold">Pricing</Label>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Original price — auto-filled from items, editable */}
              <div>
                <Label htmlFor="original-price" className="mb-1.5 block">
                  Original Price ৳
                  {autoOriginalPrice > 0 && !originalPriceManual && (
                    <span className="ml-2 text-xs text-ui-fg-subtle">(auto-calculated)</span>
                  )}
                </Label>
                <Input
                  id="original-price"
                  type="number"
                  min="0"
                  value={form.originalPrice}
                  onChange={(e) => {
                    setOriginalPriceManual(true)
                    setForm((prev) => ({ ...prev, originalPrice: e.target.value }))
                  }}
                  placeholder="0"
                />
                {originalPriceManual && autoOriginalPrice > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setOriginalPriceManual(false)
                      setForm((prev) => ({ ...prev, originalPrice: String(autoOriginalPrice) }))
                    }}
                    className="mt-1 text-xs text-ui-fg-interactive hover:underline"
                  >
                    Reset to auto (৳{autoOriginalPrice.toLocaleString()})
                  </button>
                )}
              </div>

              {/* Combo price */}
              <div>
                <Label htmlFor="combo-price" className="mb-1.5 block">
                  Combo Price ৳ <span className="text-ui-fg-error">*</span>
                  {form.comboPrice && form.originalPrice && Number(form.originalPrice) > 0 && Number(form.comboPrice) > 0 && (
                    <span className="ml-2 text-xs text-ui-fg-subtle">
                      ({discountPct(Number(form.comboPrice), Number(form.originalPrice)) ?? 0}% off)
                    </span>
                  )}
                </Label>
                <Input
                  id="combo-price"
                  type="number"
                  min="0"
                  value={form.comboPrice}
                  onChange={(e) => setForm((prev) => ({ ...prev, comboPrice: e.target.value }))}
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* Form actions */}
          <div className="mt-6 flex items-center gap-3 border-t border-ui-border-base pt-5">
            <Button onClick={handleSave} isLoading={saving} size="small">
              {editId ? 'Save Changes' : 'Create Combo'}
            </Button>
            <Button variant="secondary" size="small" onClick={cancelForm} disabled={saving}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* List */}
      {loading ? (
        <Text className="text-ui-fg-subtle">Loading…</Text>
      ) : combos.length === 0 ? (
        <div className="rounded-lg border border-ui-border-base bg-ui-bg-subtle p-12 text-center">
          <Text className="text-ui-fg-subtle">No combo offers yet. Create your first one above.</Text>
        </div>
      ) : (
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Combo Price</Table.HeaderCell>
              <Table.HeaderCell>Original Price</Table.HeaderCell>
              <Table.HeaderCell>Discount</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.HeaderCell>Actions</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {combos.map((combo) => {
              const pct = discountPct(combo.comboPrice, combo.originalPrice)
              return (
                <Table.Row key={combo.id}>
                  <Table.Cell>
                    <div>
                      <p className="font-medium text-ui-fg-base">{combo.name}</p>
                      <p className="text-xs text-ui-fg-subtle">{combo.slug}</p>
                    </div>
                  </Table.Cell>
                  <Table.Cell className="font-semibold text-ui-fg-base">৳{combo.comboPrice.toLocaleString()}</Table.Cell>
                  <Table.Cell className="text-ui-fg-subtle">
                    {combo.originalPrice > 0 ? `৳${combo.originalPrice.toLocaleString()}` : '—'}
                  </Table.Cell>
                  <Table.Cell>
                    {pct !== null ? (
                      <Badge color="green">{pct}% off</Badge>
                    ) : (
                      <span className="text-ui-fg-muted text-sm">—</span>
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    <Badge color={combo.isActive ? 'green' : 'grey'}>
                      {combo.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        title="Edit"
                        onClick={() => openEdit(combo)}
                        className="rounded p-1 text-ui-fg-muted hover:text-ui-fg-base hover:bg-ui-bg-subtle transition-colors"
                      >
                        <PencilSquare />
                      </button>
                      <button
                        type="button"
                        title="Delete"
                        disabled={deleting === combo.id}
                        onClick={() => handleDelete(combo.id, combo.name)}
                        className="rounded p-1 text-ui-fg-muted hover:text-ui-fg-error hover:bg-ui-bg-subtle transition-colors disabled:opacity-50"
                      >
                        <Trash />
                      </button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              )
            })}
          </Table.Body>
        </Table>
      )}
    </div>
  )
}

export const config = defineRouteConfig({
  label: 'Combo Offers',
  icon: Gift,
})

export default ComboOffersPage
