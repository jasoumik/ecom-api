import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"

export default async function orderShippedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>): Promise<void> {
  try {
    const notificationService = container.resolve(Modules.NOTIFICATION)
    const orderService = container.resolve(Modules.ORDER)

    const order = await (orderService as any).retrieveOrder(data.id, {
      relations: ["fulfillments", "shipping_address", "customer"],
    })

    const email = order.email || order.customer?.email
    const phone = order.customer?.phone || order.shipping_address?.phone
    const customerName = order.customer?.first_name
      ? `${order.customer.first_name} ${order.customer.last_name || ""}`.trim()
      : order.email

    const latestFulfillment = (order.fulfillments || []).at(-1)
    const trackingNumber = latestFulfillment?.tracking_numbers?.[0] || undefined

    if (email) {
      await notificationService.createNotifications({
        to: email,
        channel: "email",
        template: "order-shipped",
        data: {
          customer_name: customerName,
          order_id: order.display_id,
          tracking_number: trackingNumber,
        },
        trigger_type: "order.fulfillment_created",
        resource_id: order.id,
        resource_type: "order",
      })
    }

    if (phone) {
      await notificationService.createNotifications({
        to: phone,
        channel: "sms",
        template: "order-shipped",
        data: {
          display_id: order.display_id,
          tracking_number: trackingNumber,
        },
        trigger_type: "order.fulfillment_created",
        resource_id: order.id,
        resource_type: "order",
      })
    }
  } catch (err) {
    console.error("[order-shipped subscriber] Failed to send notification:", err)
  }
}

export const config: SubscriberConfig = {
  event: "order.fulfillment_created",
}
