import { defineRouteConfig } from '@medusajs/admin-sdk'
import { Tag } from '@medusajs/icons'
import { Badge, Button, Heading, Table, Text } from '@medusajs/ui'
import { useEffect, useState } from 'react'

type ComboOffer = {
  id: string
  name: string
  slug: string
  type: string
  discountValue: number
  originalPrice: number
  comboPrice: number
  isActive: boolean
  startsAt: string | null
  endsAt: string | null
}

const ComboOffersPage = () => {
  const [offers, setOffers] = useState<ComboOffer[]>([])
  const [loading, setLoading] = useState(true)

  const fetchOffers = async () => {
    setLoading(true)
    try {
      const res = await fetch('/admin/combos', { credentials: 'include' })
      const json = await res.json()
      setOffers(json.data ?? [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOffers()
  }, [])

  const handleToggleActive = async (offer: ComboOffer) => {
    await fetch(`/admin/combos/${offer.id}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !offer.isActive }),
    })
    fetchOffers()
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this combo offer?')) return
    await fetch(`/admin/combos/${id}`, { method: 'DELETE', credentials: 'include' })
    fetchOffers()
  }

  const formatDate = (d: string | null) => (d ? new Date(d).toLocaleDateString() : '—')

  return (
    <div className="flex flex-col gap-y-4 p-8">
      <div className="flex items-center justify-between">
        <Heading>Combo Offers</Heading>
      </div>

      {loading ? (
        <Text>Loading…</Text>
      ) : (
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Type</Table.HeaderCell>
              <Table.HeaderCell>Discount</Table.HeaderCell>
              <Table.HeaderCell>Original / Combo</Table.HeaderCell>
              <Table.HeaderCell>Dates</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.HeaderCell>Actions</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {offers.map((offer) => (
              <Table.Row key={offer.id}>
                <Table.Cell>
                  <a
                    href={`/combo-offers/${offer.id}`}
                    className="text-ui-fg-interactive hover:underline"
                  >
                    {offer.name}
                  </a>
                </Table.Cell>
                <Table.Cell>
                  <Badge color="blue">{offer.type}</Badge>
                </Table.Cell>
                <Table.Cell>{offer.discountValue}%</Table.Cell>
                <Table.Cell>
                  {offer.originalPrice} / {offer.comboPrice}
                </Table.Cell>
                <Table.Cell>
                  {formatDate(offer.startsAt)} – {formatDate(offer.endsAt)}
                </Table.Cell>
                <Table.Cell>
                  <Badge color={offer.isActive ? 'green' : 'grey'}>
                    {offer.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </Table.Cell>
                <Table.Cell>
                  <div className="flex gap-x-2">
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => handleToggleActive(offer)}
                    >
                      {offer.isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Button
                      variant="danger"
                      size="small"
                      onClick={() => handleDelete(offer.id)}
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
  label: 'Combo Offers',
  icon: Tag,
})

export default ComboOffersPage
