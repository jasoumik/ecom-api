import type { MedusaRequest, MedusaResponse } from '@medusajs/framework'
import { Modules } from '@medusajs/framework/utils'

export const GET = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
  const { order_id, phone } = req.query as { order_id?: string; phone?: string }

  if (!order_id || !phone) {
    res.status(400).json({ message: 'order_id and phone are required' })
    return
  }

  try {
    const orderService = req.scope.resolve(Modules.ORDER)

    const orders = await (orderService as any).listOrders(
      { display_id: Number(order_id) },
      { relations: ['items', 'shipping_address', 'fulfillments'] }
    )

    const order = orders?.[0]
    if (!order) {
      res.status(404).json({ message: 'Order not found' })
      return
    }

    const orderPhone = order.shipping_address?.phone?.replace(/\D/g, '')
    const inputPhone = phone.replace(/\D/g, '')

    if (!orderPhone || !orderPhone.endsWith(inputPhone.slice(-10))) {
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
