import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"

export default async function customerCreatedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>): Promise<void> {
  try {
    const notificationService = container.resolve(Modules.NOTIFICATION)
    const customerService = container.resolve(Modules.CUSTOMER)

    const customer = await (customerService as any).retrieveCustomer(data.id)

    const email = customer.email
    const firstName = customer.first_name || "there"

    if (!email) return

    await notificationService.createNotifications({
      to: email,
      channel: "email",
      template: "welcome",
      data: { first_name: firstName },
      trigger_type: "customer.created",
      resource_id: customer.id,
      resource_type: "customer",
    })
  } catch (err) {
    console.error("[customer-created subscriber] Failed to send welcome email:", err)
  }
}

export const config: SubscriberConfig = {
  event: "customer.created",
}
