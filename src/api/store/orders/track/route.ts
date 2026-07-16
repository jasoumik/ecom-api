import type { MedusaRequest, MedusaResponse } from '@medusajs/framework'
import { Modules } from '@medusajs/framework/utils'

export const GET = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
  const { order_id, phone } = req.query as { order_id?: string; phone?: string }

  // Phone is the required key: it guards against sequential order-ID enumeration.
  // order_id is optional and only narrows the lookup to a specific order.
  if (!phone) {
    res.status(400).json({ message: 'phone is required' })
    return
  }

  const relations = ['items', 'shipping_address', 'fulfillments']
  const inputPhone = phone.replace(/\D/g, '').slice(-10)
  const phoneMatches = (o: any): boolean => {
    const orderPhone = o.shipping_address?.phone?.replace(/\D/g, '')
    return !!orderPhone && !!inputPhone && orderPhone.endsWith(inputPhone)
  }

  try {
    const orderService = req.scope.resolve(Modules.ORDER)

    let order: any
    if (order_id) {
      const orders = await (orderService as any).listOrders(
        { display_id: Number(order_id) },
        { relations }
      )
      order = orders?.[0]
    } else {
      // Phone-only: scan recent orders and return the latest one for this phone.
      const orders = await (orderService as any).listOrders(
        {},
        { relations, order: { created_at: 'DESC' }, take: 200 }
      )
      order = (orders ?? []).find(phoneMatches)
    }

    if (!order || !phoneMatches(order)) {
      res.status(404).json({ message: 'Order not found' })
      return
    }

    res.status(200).json({
      order: {
        id: order.id,
        display_id: order.display_id,
        status: order.status,
        fulfillment_status: order.fulfillment_status,
        payment_status: order.payment_status,
        total: order.total,
        subtotal: order.subtotal,
        shipping_total: order.shipping_total,
        created_at: order.created_at,
        items: (order.items ?? []).map((item: any) => ({
          id: item.id,
          title: item.title,
          quantity: item.quantity,
          unit_price: item.unit_price,
          thumbnail: item.thumbnail,
        })),
        shipping_address: {
          first_name: order.shipping_address?.first_name,
          last_name: order.shipping_address?.last_name,
          address_1: order.shipping_address?.address_1,
          city: order.shipping_address?.city,
          phone: order.shipping_address?.phone,
        },
      },
    })
  } catch {
    res.status(500).json({ message: 'Failed to fetch order' })
  }
}
