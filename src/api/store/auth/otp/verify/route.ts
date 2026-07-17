import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys, Modules, generateJwtToken } from "@medusajs/framework/utils"
import { verifyOtp } from "../../../../../utils/otp-store"

// Verifies an OTP and returns a customer-scoped session token.
//
// Unlike the core `/auth/customer/otp` route, this links the OTP auth identity to
// the customer that already exists for this phone/email (created via email/password
// or during guest checkout). Without that link the OTP identity has no customer,
// so the storefront used to try creating a duplicate — which failed with
// "Customer with this email already has an account."
export async function POST(req: MedusaRequest, res: MedusaResponse): Promise<void> {
  const { identifier, otp } = req.body as { identifier?: string; otp?: string }

  const id = identifier?.trim()
  const code = otp?.trim()
  if (!id || !code) {
    res.status(400).json({ message: "identifier and otp are required" })
    return
  }

  const valid = await verifyOtp(id, code)
  if (!valid) {
    res.status(401).json({ message: "Invalid or expired OTP. Please request a new one." })
    return
  }

  const authService = req.scope.resolve(Modules.AUTH)
  const customerService = req.scope.resolve(Modules.CUSTOMER)
  const config = req.scope.resolve(ContainerRegistrationKeys.CONFIG_MODULE)

  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(id)
  const email = isEmail ? id.toLowerCase() : `${id}@otp.replantglow.com`

  try {
    // 1. Find the existing customer (by phone, then email) or create one.
    let customer: any
    if (!isEmail) {
      ;[customer] = await (customerService as any).listCustomers({ phone: id })
    }
    if (!customer) {
      ;[customer] = await (customerService as any).listCustomers({ email })
    }
    if (!customer) {
      customer = await (customerService as any).createCustomers({
        email,
        first_name: "Customer",
        last_name: "",
        has_account: true,
        ...(isEmail ? {} : { phone: id }),
      })
    }

    // 2. Find or create the OTP auth identity for this identifier.
    const providerIdentities = await (authService as any).listProviderIdentities({
      entity_id: id,
      provider: "otp",
    })
    let authIdentity: any
    if (providerIdentities?.[0]?.auth_identity_id) {
      authIdentity = await authService.retrieveAuthIdentity(
        providerIdentities[0].auth_identity_id,
        { relations: ["provider_identities"] }
      )
    } else {
      authIdentity = await (authService as any).createAuthIdentities({
        provider_identities: [{ provider: "otp", entity_id: id }],
      })
    }

    // 3. Link the auth identity to the customer so the token carries customer_id.
    if (authIdentity.app_metadata?.customer_id !== customer.id) {
      await (authService as any).updateAuthIdentities({
        id: authIdentity.id,
        app_metadata: { ...(authIdentity.app_metadata ?? {}), customer_id: customer.id },
      })
      authIdentity = await authService.retrieveAuthIdentity(authIdentity.id, {
        relations: ["provider_identities"],
      })
    }

    // 4. Mint a customer session token (same claim shape as Medusa's auth routes).
    const { http } = config.projectConfig
    const token = generateJwtToken(
      {
        actor_id: customer.id,
        actor_type: "customer",
        auth_identity_id: authIdentity.id,
        auth_provider: "otp",
        app_metadata: { ...(authIdentity.app_metadata ?? {}), customer_id: customer.id },
      },
      { secret: http.jwtSecret, expiresIn: http.jwtExpiresIn, jwtOptions: http.jwtOptions }
    )

    res.status(200).json({ token, customer })
  } catch (err) {
    console.error("[otp/verify] Failed to verify OTP:", err)
    res.status(500).json({ message: "Failed to verify OTP. Please try again." })
  }
}
