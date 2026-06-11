import { AbstractNotificationProviderService, ModuleProvider, Modules } from "@medusajs/framework/utils"
import type {
  ProviderSendNotificationDTO,
  ProviderSendNotificationResultsDTO,
} from "@medusajs/types"
import { orderPlacedSms } from "../templates/sms/order-placed"
import { orderShippedSms } from "../templates/sms/order-shipped"
import { otpSms } from "../templates/sms/otp"

type Options = {
  apiKey?: string
  senderId?: string
  smsEnabled?: string
}

const SMS_TEMPLATES: Record<string, (data: any) => string> = {
  "order-placed": orderPlacedSms,
  "order-shipped": orderShippedSms,
  "otp": otpSms,
}

function formatPhone(phone: string): string {
  let digits = phone.replace(/\D/g, "")
  if (digits.startsWith("880")) digits = digits.slice(2)
  return digits
}

class NetSmsBdProvider extends AbstractNotificationProviderService {
  static identifier = "netsmsbd"

  private options_: Options

  constructor(_: unknown, options: Options) {
    super()
    this.options_ = options
  }

  async send(notification: ProviderSendNotificationDTO): Promise<ProviderSendNotificationResultsDTO> {
    if (this.options_.smsEnabled !== "true") {
      console.log("[NetSmsBdProvider] SMS disabled (SMS_ENABLED != true), skipping")
      return {}
    }

    const apiKey = this.options_.apiKey
    if (!apiKey) {
      throw new Error("[NetSmsBdProvider] NETSMSBD_API_KEY is not set")
    }

    const templateFn = SMS_TEMPLATES[notification.template]
    if (!templateFn) {
      throw new Error(`[NetSmsBdProvider] Unknown SMS template: "${notification.template}"`)
    }

    const message = templateFn(notification.data || {})
    const mobileNo = formatPhone(notification.to)

    const payload: Record<string, string> = { apiKey, mobileNo, msgBody: message }
    if (this.options_.senderId) payload.senderId = this.options_.senderId

    const response = await fetch("https://netsmsbd.com/v1.1/sms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const body = await response.text()
      throw new Error(`[NetSmsBdProvider] API error ${response.status}: ${body}`)
    }

    console.log(`[NetSmsBdProvider] SMS sent to ${mobileNo}`)
    return { id: mobileNo }
  }
}

export default ModuleProvider(Modules.NOTIFICATION, {
  services: [NetSmsBdProvider],
})
