import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"

export default async function orderPlacedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>): Promise<void> {
  try {
    const notificationService = container.resolve(Modules.NOTIFICATION)
    const orderService = container.resolve(Modules.ORDER)

    const order = await (orderService as any).retrieveOrder(data.id, {
      relations: ["items", "shipping_address", "customer"],
    })

    const email = order.email || order.customer?.email
    const phone = order.customer?.phone || order.shipping_address?.phone
    const customerName = order.customer?.first_name
      ? `${order.customer.first_name} ${order.customer.last_name || ""}`.trim()
      : order.email

    const orderData = {
      id: order.id,
      display_id: order.display_id,
      customer_name: customerName,
      email,
      items: (order.items || []).map((item: any) => ({
        title: item.title,
        quantity: item.quantity,
        unit_price: item.unit_price,
      })),
      subtotal: order.subtotal,
      shipping_total: order.shipping_total,
      tax_total: order.tax_total,
      total: order.total,
      shipping_address: {
        address_1: order.shipping_address?.address_1 || "",
        city: order.shipping_address?.city || "",
        postal_code: order.shipping_address?.postal_code,
      },
      payment_method:
        order.payment_collections?.[0]?.payment_sessions?.[0]?.provider_id || "N/A",
    }

    if (email) {
      await notificationService.createNotifications({
        to: email,
        channel: "email",
        template: "order-placed",
        data: orderData,
        trigger_type: "order.placed",
        resource_id: order.id,
        resource_type: "order",
      })
    }

    if (phone) {
      await notificationService.createNotifications({
        to: phone,
        channel: "sms",
        template: "order-placed",
        data: {
          display_id: order.display_id,
          total: order.total,
          customer_name: customerName,
        },
        trigger_type: "order.placed",
        resource_id: order.id,
        resource_type: "order",
      })
    }
  } catch (err) {
    console.error("[order-placed subscriber] Failed to send notification:", err)
  }
}

export const config: SubscriberConfig = {
  event: "order.placed",
}
