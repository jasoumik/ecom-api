import { defineRouteConfig } from '@medusajs/admin-sdk'
import { DocumentText } from '@medusajs/icons'
import { Badge, Button, Heading, Table, Text } from '@medusajs/ui'
import { useEffect, useState } from 'react'

type LandingPage = {
  id: string
  slug: string
  headline: string
  productId: string
  whatsappNumber: string
  isActive: boolean
}

const LandingPagesPage = () => {
  const [pages, setPages] = useState<LandingPage[]>([])
  const [loading, setLoading] = useState(true)

  const fetchPages = async () => {
    setLoading(true)
    try {
      const res = await fetch('/admin/landing-pages', { credentials: 'include' })
      const json = await res.json()
      setPages(json.data ?? [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPages()
  }, [])

  const handlePublish = async (page: LandingPage) => {
    const action = page.isActive ? 'unpublish' : 'publish'
    await fetch(`/admin/landing-pages/${page.id}/${action}`, {
      method: 'POST',
      credentials: 'include',
    })
    fetchPages()
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this landing page?')) return
    await fetch(`/admin/landing-pages/${id}`, { method: 'DELETE', credentials: 'include' })
    fetchPages()
  }

  return (
    <div className="flex flex-col gap-y-4 p-8">
      <div className="flex items-center justify-between">
        <Heading>Landing Pages</Heading>
      </div>

      {loading ? (
        <Text>Loading…</Text>
      ) : (
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Headline</Table.HeaderCell>
              <Table.HeaderCell>Slug</Table.HeaderCell>
              <Table.HeaderCell>Product ID</Table.HeaderCell>
              <Table.HeaderCell>WhatsApp</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.HeaderCell>Actions</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {pages.map((page) => (
              <Table.Row key={page.id}>
                <Table.Cell>
                  <a
                    href={`/landing-pages/${page.id}`}
                    className="text-ui-fg-interactive hover:underline"
                  >
                    {page.headline}
                  </a>
                </Table.Cell>
                <Table.Cell>{page.slug}</Table.Cell>
                <Table.Cell>
                  <Text className="font-mono text-xs">{page.productId}</Text>
                </Table.Cell>
                <Table.Cell>{page.whatsappNumber}</Table.Cell>
                <Table.Cell>
                  <Badge color={page.isActive ? 'green' : 'grey'}>
                    {page.isActive ? 'Published' : 'Draft'}
                  </Badge>
                </Table.Cell>
                <Table.Cell>
                  <div className="flex gap-x-2">
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => handlePublish(page)}
                    >
                      {page.isActive ? 'Unpublish' : 'Publish'}
                    </Button>
                    <Button
                      variant="danger"
                      size="small"
                      onClick={() => handleDelete(page.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}
    </div>
  )
}

export const config = defineRouteConfig({
  label: 'Landing Pages',
  icon: DocumentText,
})

export default LandingPagesPage
