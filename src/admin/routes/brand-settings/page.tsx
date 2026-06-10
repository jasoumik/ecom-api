import { defineRouteConfig } from '@medusajs/admin-sdk'
import { Photo } from '@medusajs/icons'
import { Button, Heading, Input, Label, Select, Text, toast } from '@medusajs/ui'
import { useEffect, useRef, useState } from 'react'

type BrandSettings = {
  id: string
  name: string
  logoUrl: string | null
  watermarkPosition: string
  watermarkOpacity: number
  watermarkSizePercent: number
  watermarkPadding: number
  isActive: boolean
}

const POSITIONS = [
  { value: 'BOTTOM_RIGHT', label: 'Bottom Right' },
  { value: 'BOTTOM_LEFT', label: 'Bottom Left' },
  { value: 'TOP_RIGHT', label: 'Top Right' },
  { value: 'TOP_LEFT', label: 'Top Left' },
  { value: 'CENTER', label: 'Center' },
]

const BrandSettingsPage = () => {
  const [settings, setSettings] = useState<BrandSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [form, setForm] = useState({
    name: '',
    watermarkPosition: 'BOTTOM_RIGHT',
    watermarkOpacity: 0.7,
    watermarkSizePercent: 15,
    watermarkPadding: 20,
  })
  const fileRef = useRef<HTMLInputElement>(null)

  const fetchSettings = async () => {
    setLoading(true)
    try {
      const res = await fetch('/admin/media/brand-settings', { credentials: 'include' })
      if (res.status === 404) {
        setSettings(null)
      } else {
        const json = await res.json()
        const data = json.data as BrandSettings
        setSettings(data)
        setForm({
          name: data.name,
          watermarkPosition: data.watermarkPosition,
          watermarkOpacity: data.watermarkOpacity,
          watermarkSizePercent: data.watermarkSizePercent,
          watermarkPadding: data.watermarkPadding,
        })
      }
    } catch {
      toast.error('Failed to load brand settings')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchSettings() }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      if (settings) {
        await fetch(`/admin/media/brand-settings/${settings.id}`, {
          method: 'PUT',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        })
        toast.success('Brand settings updated')
      } else {
        await fetch('/admin/media/brand-settings', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        })
        toast.success('Brand settings created')
      }
      fetchSettings()
    } catch {
      toast.error('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/admin/media/brand-settings/logo', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      })
      const json = await res.json()
      const logoUrl = json.data?.logo_url
      if (!logoUrl) throw new Error('No URL returned')

      // Save logo URL to existing settings or create new
      if (settings) {
        await fetch(`/admin/media/brand-settings/${settings.id}`, {
          method: 'PUT',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ logoUrl }),
        })
      } else {
        await fetch('/admin/media/brand-settings', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form, name: form.name || 'Default', logoUrl }),
        })
      }
      toast.success('Logo uploaded and saved')
      fetchSettings()
    } catch {
      toast.error('Logo upload failed')
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  if (loading) {
    return <div className="p-8 text-ui-fg-subtle">Loading...</div>
  }

  return (
    <div className="p-8 max-w-2xl">
      <Heading level="h1" className="mb-1">Brand Settings</Heading>
      <Text className="text-ui-fg-subtle mb-8">
        Configure your watermark logo and appearance for uploaded product images.
      </Text>

      {/* Logo section */}
      <div className="bg-ui-bg-base border border-ui-border-base rounded-lg p-6 mb-6">
        <Heading level="h2" className="mb-4">Watermark Logo</Heading>

        {settings?.logoUrl ? (
          <div className="mb-4">
            <img
              src={settings.logoUrl}
              alt="Brand logo"
              className="h-20 w-20 object-contain rounded border border-ui-border-base bg-ui-bg-subtle p-2"
            />
            <Text className="text-ui-fg-subtle text-sm mt-2">Current logo</Text>
          </div>
        ) : (
          <div className="mb-4 flex items-center gap-2 text-ui-fg-subtle">
            <Photo />
            <Text className="text-sm">No logo uploaded yet</Text>
          </div>
        )}

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleLogoUpload}
        />
        <Button
          variant="secondary"
          size="small"
          isLoading={uploading}
          onClick={() => fileRef.current?.click()}
        >
          {settings?.logoUrl ? 'Replace Logo' : 'Upload Logo'}
        </Button>
      </div>

      {/* Settings form */}
      <div className="bg-ui-bg-base border border-ui-border-base rounded-lg p-6 space-y-5">
        <Heading level="h2" className="mb-2">Watermark Settings</Heading>

        <div>
          <Label htmlFor="name" className="mb-1.5 block">Config Name</Label>
          <Input
            id="name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Default"
          />
        </div>

        <div>
          <Label htmlFor="position" className="mb-1.5 block">Position</Label>
          <Select
            value={form.watermarkPosition}
            onValueChange={(v) => setForm({ ...form, watermarkPosition: v })}
          >
            <Select.Trigger id="position">
              <Select.Value />
            </Select.Trigger>
            <Select.Content>
              {POSITIONS.map((p) => (
                <Select.Item key={p.value} value={p.value}>{p.label}</Select.Item>
              ))}
            </Select.Content>
          </Select>
        </div>

        <div>
          <Label htmlFor="opacity" className="mb-1.5 block">
            Opacity <span className="text-ui-fg-subtle">({Math.round(form.watermarkOpacity * 100)}%)</span>
          </Label>
          <input
            id="opacity"
            type="range"
            min="0.1"
            max="1"
            step="0.05"
            value={form.watermarkOpacity}
            onChange={(e) => setForm({ ...form, watermarkOpacity: parseFloat(e.target.value) })}
            className="w-full"
          />
        </div>

        <div>
          <Label htmlFor="size" className="mb-1.5 block">
            Size <span className="text-ui-fg-subtle">({form.watermarkSizePercent}% of image width)</span>
          </Label>
          <input
            id="size"
            type="range"
            min="5"
            max="40"
            step="1"
            value={form.watermarkSizePercent}
            onChange={(e) => setForm({ ...form, watermarkSizePercent: parseInt(e.target.value) })}
            className="w-full"
          />
        </div>

        <div>
          <Label htmlFor="padding" className="mb-1.5 block">
            Padding <span className="text-ui-fg-subtle">({form.watermarkPadding}px)</span>
          </Label>
          <input
            id="padding"
            type="range"
            min="0"
            max="60"
            step="2"
            value={form.watermarkPadding}
            onChange={(e) => setForm({ ...form, watermarkPadding: parseInt(e.target.value) })}
            className="w-full"
          />
        </div>

        <div className="pt-2">
          <Button isLoading={saving} onClick={handleSave}>
            {settings ? 'Save Changes' : 'Create Settings'}
          </Button>
        </div>
      </div>
    </div>
  )
}

export const config = defineRouteConfig({
  label: 'Brand Settings',
  icon: Photo,
})

export default BrandSettingsPage
