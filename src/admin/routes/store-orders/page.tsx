import { defineRouteConfig } from '@medusajs/admin-sdk'
import { ShoppingCart } from '@medusajs/icons'
import { Badge, Heading, Table, Text } from '@medusajs/ui'
import { useEffect, useState } from 'react'

type Order = {
  id: string
  fullName: string
  phone: string
  address: string
  deliveryZone: string
  deliveryCharge: number
  paymentMethod: string
  status: string
  subtotal: number
  total: number
  created_at: string
}

const STATUSES = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']

const fmt = (n: number) => `৳${n.toLocaleString()}`

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const res = await fetch('/admin/store-orders', { credentials: 'include' })
      const json = await res.json()
      setOrders(json.data ?? [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchOrders() }, [])

  const handleStatusChange = async (id: string, status: string) => {
    await fetch(`/admin/store-orders/${id}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    fetchOrders()
  }

  return (
    <div className="flex flex-col gap-y-4 p-8">
      <Heading>Store Orders</Heading>
      {loading ? (
        <Text>Loading…</Text>
      ) : orders.length === 0 ? (
        <Text>No orders yet.</Text>
      ) : (
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Customer</Table.HeaderCell>
              <Table.HeaderCell>Phone</Table.HeaderCell>
              <Table.HeaderCell>Zone</Table.HeaderCell>
              <Table.HeaderCell>Subtotal</Table.HeaderCell>
              <Table.HeaderCell>Delivery</Table.HeaderCell>
              <Table.HeaderCell>Total</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.HeaderCell>Date</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {orders.map((order) => (
              <Table.Row key={order.id}>
                <Table.Cell>
                  <div>
                    <p className="font-medium">{order.fullName}</p>
                    <p className="text-ui-fg-subtle text-xs truncate max-w-[160px]">{order.address}</p>
                  </div>
                </Table.Cell>
                <Table.Cell>{order.phone}</Table.Cell>
                <Table.Cell>
                  <Badge color="blue">
                    {order.deliveryZone === 'INSIDE_DHAKA' ? 'Inside Dhaka' : 'Outside Dhaka'}
                  </Badge>
                </Table.Cell>
                <Table.Cell>{fmt(order.subtotal / 100)}</Table.Cell>
                <Table.Cell>{fmt(order.deliveryCharge)}</Table.Cell>
                <Table.Cell className="font-semibold">{fmt((order.subtotal / 100) + order.deliveryCharge)}</Table.Cell>
                <Table.Cell>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className="rounded border border-ui-border-base bg-ui-bg-base px-2 py-1 text-xs"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </Table.Cell>
                <Table.Cell className="text-xs text-ui-fg-subtle">
                  {new Date(order.created_at).toLocaleDateString()}
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
  label: 'Store Orders',
  icon: ShoppingCart,
})

export default OrdersPage
