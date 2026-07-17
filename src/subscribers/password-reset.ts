import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"

export default async function passwordResetHandler({
  event: { data },
  container,
}: SubscriberArgs<{ entity_id: string; actor_type?: string; token: string }>): Promise<void> {
  try {
    // The reset-password event fires for every actor type (customer, user/admin).
    // Only send the storefront reset email for customers.
    if (data.actor_type && data.actor_type !== "customer") return

    const email = data.entity_id
    if (!email || !data.token) return

    const notificationService = container.resolve(Modules.NOTIFICATION)
    const customerService = container.resolve(Modules.CUSTOMER)

    let firstName = "there"
    try {
      const [customer] = await (customerService as any).listCustomers({ email })
      if (customer?.first_name) firstName = customer.first_name
    } catch {
      // Best-effort personalisation; the email still sends without a name.
    }

    const storefrontUrl =
      process.env.STOREFRONT_URL ||
      process.env.STORE_CORS?.split(",")[0]?.trim() ||
      "http://localhost:3000"

    const resetLink = `${storefrontUrl}/account/reset-password?token=${encodeURIComponent(
      data.token
    )}&email=${encodeURIComponent(email)}`

    await notificationService.createNotifications({
      to: email,
      channel: "email",
      template: "password-reset",
      data: { first_name: firstName, reset_link: resetLink },
      trigger_type: "auth.password_reset",
      resource_id: email,
      resource_type: "customer",
    })
  } catch (err) {
    console.error("[password-reset subscriber] Failed to send reset email:", err)
  }
}

export const config: SubscriberConfig = {
  event: "auth.password_reset",
}
