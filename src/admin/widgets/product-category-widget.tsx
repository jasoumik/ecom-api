import { defineWidgetConfig } from '@medusajs/admin-sdk'
import { Badge, Button, Heading, Select, Text } from '@medusajs/ui'
import { useEffect, useState } from 'react'

type ProductCategory = {
  id: string
  name: string
  handle: string
  parent_category_id: string | null
}

type ProductCategoryWidgetProps = {
  data: {
    id: string
    categories?: Array<{ id: string }>
  }
}

const NONE = '__none__'

const ProductCategoryWidget = ({ data }: ProductCategoryWidgetProps) => {
  const [categories, setCategories] = useState<ProductCategory[]>([])
  const [selectedId, setSelectedId] = useState<string>(
    data.categories?.[0]?.id ?? NONE
  )
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/admin/product-categories?fields=id,name,handle,parent_category_id', {
      credentials: 'include',
    })
      .then((r) => r.json())
      .then((json) => setCategories(json.product_categories ?? []))
      .catch((err) => setError(String(err)))
  }, [])

  const currentCategory = categories.find((c) => c.id === selectedId)

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    setSaved(false)
    try {
      const body =
        selectedId === NONE
          ? { categories: [] }
          : { categories: [{ id: selectedId }] }

      const res = await fetch(`/admin/products/${data.id}`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const json = await res.json()
        setError(json.message ?? 'Failed to save')
        return
      }
      setSaved(true)
    } catch (err) {
      setError(String(err))
    } finally {
      setSaving(false)
    }
  }

  const indent = (cat: ProductCategory): string => {
    let depth = 0
    let current: ProductCategory | undefined = cat
    while (current?.parent_category_id) {
      depth++
      current = categories.find((c) => c.id === current!.parent_category_id)
    }
    return '\u00A0\u00A0'.repeat(depth) + cat.name
  }

  return (
    <div className="flex flex-col gap-y-3 p-4 border rounded-lg bg-ui-bg-subtle">
      <Heading level="h2">Category</Heading>

      {currentCategory && (
        <Badge color="blue">{currentCategory.name}</Badge>
      )}

      <Select value={selectedId} onValueChange={setSelectedId}>
        <Select.Trigger>
          <Select.Value placeholder="Select a category…" />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value={NONE}>— None —</Select.Item>
          {categories.map((cat) => (
            <Select.Item key={cat.id} value={cat.id}>
              {indent(cat)}
            </Select.Item>
          ))}
        </Select.Content>
      </Select>

      {error && <Text className="text-ui-fg-error text-sm">{error}</Text>}
      {saved && <Text className="text-ui-fg-positive text-sm">Saved.</Text>}

      <Button
        size="small"
        variant="secondary"
        isLoading={saving}
        onClick={handleSave}
        disabled={saving}
      >
        Save Category
      </Button>
    </div>
  )
}

export const config = defineWidgetConfig({
  zone: 'product.details.side.before',
})

export default ProductCategoryWidget
