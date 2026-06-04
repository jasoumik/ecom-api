import { Button, Heading, Input, Label, Switch, Text } from '@medusajs/ui'
import { useEffect, useState } from 'react'

type LandingPage = {
  id: string
  productId: string
  slug: string
  headline: string
  subHeadline: string
  urgencyText: string | null
  countdownEndsAt: string | null
  whatsappNumber: string
  messengerLink: string | null
  isCODAvailable: boolean
  deliveryDhaka: string
  deliveryOutsideDhaka: string
  bkashNumber: string | null
  nagadNumber: string | null
  isActive: boolean
}

const LandingPageDetailPage = () => {
  const id = window.location.pathname.split('/').at(-1) ?? ''
  const [page, setPage] = useState<LandingPage | null>(null)
  const [form, setForm] = useState<Partial<LandingPage>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const fetchPage = () => {
    fetch(`/admin/landing-pages/${id}`, { credentials: 'include' })
      .then((r) => r.json())
      .then((json) => {
        setPage(json.data)
        setForm(json.data)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchPage()
  }, [id])

  const handleSave = async () => {
    setSaving(true)
    setMessage('')
    const res = await fetch(`/admin/landing-pages/${id}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const json = await res.json()
    setSaving(false)
    setMessage(res.ok ? 'Saved successfully.' : (json.message ?? 'Save failed.'))
    if (res.ok) fetchPage()
  }

  const handlePublishToggle = async () => {
    const action = page?.isActive ? 'unpublish' : 'publish'
    const res = await fetch(`/admin/landing-pages/${id}/${action}`, {
      method: 'POST',
      credentials: 'include',
    })
    if (res.ok) fetchPage()
  }

  if (loading) return <div className="p-8"><Text>Loading…</Text></div>
  if (!page) return <div className="p-8"><Text>Landing page not found.</Text></div>

  const field = (key: keyof LandingPage, label: string, type = 'text') => (
    <div>
      <Label>{label}</Label>
      <Input
        type={type}
        value={String(form[key] ?? '')}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
      />
    </div>
  )

  return (
    <div className="flex flex-col gap-y-6 p-8 max-w-2xl">
      <div className="flex items-center justify-between">
        <Heading>Edit Landing Page</Heading>
        <div className="flex gap-x-2">
          <Button
            variant={page.isActive ? 'danger' : 'primary'}
            size="small"
            onClick={handlePublishToggle}
          >
            {page.isActive ? 'Unpublish' : 'Publish'}
          </Button>
          <Button variant="secondary" size="small" asChild>
            <a href="/landing-pages">← Back</a>
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-y-4">
        {field('slug', 'Slug')}
        {field('headline', 'Headline')}
        {field('subHeadline', 'Sub Headline')}
        {field('urgencyText', 'Urgency Text')}
        {field('whatsappNumber', 'WhatsApp Number')}
        {field('messengerLink', 'Messenger Link')}
        {field('bkashNumber', 'bKash Number')}
        {field('nagadNumber', 'Nagad Number')}
        {field('deliveryDhaka', 'Delivery (Dhaka)')}
        {field('deliveryOutsideDhaka', 'Delivery (Outside Dhaka)')}
        <div>
          <Label>Countdown Ends At</Label>
          <Input
            type="datetime-local"
            value={form.countdownEndsAt ? form.countdownEndsAt.slice(0, 16) : ''}
            onChange={(e) => setForm({ ...form, countdownEndsAt: e.target.value || null })}
          />
        </div>
        <div className="flex items-center gap-x-2">
          <Switch
            checked={form.isCODAvailable ?? true}
            onCheckedChange={(val) => setForm({ ...form, isCODAvailable: val })}
          />
          <Label>COD Available</Label>
        </div>
      </div>

      {message && <Text className="text-ui-fg-subtle">{message}</Text>}
      <Button onClick={handleSave} isLoading={saving}>Save Changes</Button>
    </div>
  )
}

export default LandingPageDetailPage
