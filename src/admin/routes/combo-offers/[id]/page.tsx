import { Button, Heading, Input, Label, Switch, Text } from '@medusajs/ui'
import { useEffect, useState } from 'react'

type ComboItem = {
  id: string
  productId: string
  quantity: number
}

type ComboOffer = {
  id: string
  name: string
  slug: string
  description: string | null
  type: string
  discountValue: number
  originalPrice: number
  comboPrice: number
  isActive: boolean
  startsAt: string | null
  endsAt: string | null
  items: ComboItem[]
}

const ComboOfferDetailPage = () => {
  const id = window.location.pathname.split('/').at(-1) ?? ''
  const [offer, setOffer] = useState<ComboOffer | null>(null)
  const [form, setForm] = useState<Partial<ComboOffer>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [newProductId, setNewProductId] = useState('')
  const [newQuantity, setNewQuantity] = useState('1')

  const fetchOffer = () => {
    fetch(`/admin/combos/${id}`, { credentials: 'include' })
      .then((r) => r.json())
      .then((json) => {
        setOffer(json.data)
        setForm(json.data)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchOffer()
  }, [id])

  const handleSave = async () => {
    setSaving(true)
    setMessage('')
    const res = await fetch(`/admin/combos/${id}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name,
        slug: form.slug,
        description: form.description,
        isActive: form.isActive,
        originalPrice: form.originalPrice,
        comboPrice: form.comboPrice,
        startsAt: form.startsAt || null,
        endsAt: form.endsAt || null,
      }),
    })
    const json = await res.json()
    setSaving(false)
    setMessage(res.ok ? 'Saved successfully.' : (json.message ?? 'Save failed.'))
    if (res.ok) fetchOffer()
  }

  const handleAddItem = async () => {
    if (!newProductId) return
    const res = await fetch(`/admin/combos/${id}/items`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: [{ productId: newProductId, quantity: Number(newQuantity) }] }),
    })
    if (res.ok) {
      setNewProductId('')
      setNewQuantity('1')
      fetchOffer()
    } else {
      const json = await res.json()
      setMessage(json.message ?? 'Failed to add item.')
    }
  }

  if (loading) return <div className="p-8"><Text>Loading…</Text></div>
  if (!offer) return <div className="p-8"><Text>Combo offer not found.</Text></div>

  return (
    <div className="flex flex-col gap-y-6 p-8 max-w-2xl">
      <div className="flex items-center justify-between">
        <Heading>Edit Combo Offer</Heading>
        <Button variant="secondary" size="small" asChild>
          <a href="/combo-offers">← Back</a>
        </Button>
      </div>

      <div className="flex flex-col gap-y-4">
        <div>
          <Label>Name</Label>
          <Input value={form.name ?? ''} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div>
          <Label>Slug</Label>
          <Input value={form.slug ?? ''} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
        </div>
        <div>
          <Label>Description</Label>
          <Input value={form.description ?? ''} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>
        <div className="flex gap-x-4">
          <div className="flex-1">
            <Label>Original Price</Label>
            <Input type="number" value={String(form.originalPrice ?? 0)} onChange={(e) => setForm({ ...form, originalPrice: Number(e.target.value) })} />
          </div>
          <div className="flex-1">
            <Label>Combo Price</Label>
            <Input type="number" value={String(form.comboPrice ?? 0)} onChange={(e) => setForm({ ...form, comboPrice: Number(e.target.value) })} />
          </div>
        </div>
        <div className="flex gap-x-4">
          <div className="flex-1">
            <Label>Starts At</Label>
            <Input type="datetime-local" value={form.startsAt ? form.startsAt.slice(0, 16) : ''} onChange={(e) => setForm({ ...form, startsAt: e.target.value })} />
          </div>
          <div className="flex-1">
            <Label>Ends At</Label>
            <Input type="datetime-local" value={form.endsAt ? form.endsAt.slice(0, 16) : ''} onChange={(e) => setForm({ ...form, endsAt: e.target.value })} />
          </div>
        </div>
        <div className="flex items-center gap-x-2">
          <Switch checked={form.isActive ?? true} onCheckedChange={(val) => setForm({ ...form, isActive: val })} />
          <Label>Active</Label>
        </div>
      </div>

      {message && <Text className="text-ui-fg-subtle">{message}</Text>}
      <Button onClick={handleSave} isLoading={saving}>Save Changes</Button>

      <div className="border-t pt-4">
        <Heading level="h2">Items ({offer.items.length})</Heading>
        {offer.items.map((item) => (
          <div key={item.id} className="flex justify-between py-2 border-b text-sm">
            <Text>Product: {item.productId}</Text>
            <Text>Qty: {item.quantity}</Text>
          </div>
        ))}
        <div className="flex gap-x-2 mt-4">
          <Input placeholder="Product ID" value={newProductId} onChange={(e) => setNewProductId(e.target.value)} />
          <Input type="number" placeholder="Qty" value={newQuantity} onChange={(e) => setNewQuantity(e.target.value)} className="w-20" />
          <Button size="small" onClick={handleAddItem}>Add Item</Button>
        </div>
      </div>
    </div>
  )
}

export default ComboOfferDetailPage
