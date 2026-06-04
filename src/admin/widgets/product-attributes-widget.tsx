import { defineWidgetConfig } from '@medusajs/admin-sdk'
import { Badge, Heading, Text } from '@medusajs/ui'
import { useEffect, useState } from 'react'

type AttributeValue = {
  attributeId: string
  value: unknown
}

type AttributeDefinition = {
  id: string
  name: string
  handle: string
  type: string
}

type ProductAttributesWidgetProps = {
  data: { id: string }
}

const ProductAttributesWidget = ({ data }: ProductAttributesWidgetProps) => {
  const [attributes, setAttributes] = useState<AttributeValue[]>([])
  const [definitions, setDefinitions] = useState<AttributeDefinition[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch(`/store/products/${data.id}/attributes`, { credentials: 'include' })
        .then((r) => r.json()),
      fetch('/admin/attributes', { credentials: 'include' })
        .then((r) => r.json()),
    ])
      .then(([attrRes, groupsRes]) => {
        setAttributes(attrRes.data ?? [])
        const allDefs: AttributeDefinition[] = []
        for (const group of groupsRes.data ?? []) {
          allDefs.push(...(group.attributes ?? []))
        }
        setDefinitions(allDefs)
      })
      .finally(() => setLoading(false))
  }, [data.id])

  if (loading) return null

  const getName = (attributeId: string) =>
    definitions.find((d) => d.id === attributeId)?.name ?? attributeId

  return (
    <div className="flex flex-col gap-y-3 p-4 border rounded-lg bg-ui-bg-subtle">
      <Heading level="h2">Product Attributes</Heading>
      {attributes.length === 0 ? (
        <Text className="text-ui-fg-muted">No attributes assigned.</Text>
      ) : (
        <div className="flex flex-col gap-y-2">
          {attributes.map((attr) => (
            <div key={attr.attributeId} className="flex items-center justify-between">
              <Text className="text-ui-fg-subtle text-sm">{getName(attr.attributeId)}</Text>
              <Badge color="blue">{String(attr.value)}</Badge>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export const config = defineWidgetConfig({
  zone: 'product.details.side.before',
})

export default ProductAttributesWidget
