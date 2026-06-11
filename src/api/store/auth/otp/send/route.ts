import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"
import { generateOtp, setOtp } from "../../../../../utils/otp-store"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { identifier } = req.body as { identifier?: string }

  if (!identifier || typeof identifier !== "string" || identifier.trim().length < 5) {
    return res.status(400).json({ message: "A valid phone number or email is required." })
  }

  const id = identifier.trim()
  const otp = generateOtp()
  setOtp(id, otp)

  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(id)
  const notificationService = req.scope.resolve(Modules.NOTIFICATION)

  try {
    if (isEmail) {
      await notificationService.createNotifications({
        to: id,
        channel: "email",
        template: "otp",
        data: { otp, first_name: undefined },
        trigger_type: "otp.send",
        resource_id: id,
        resource_type: "otp",
      })
    } else {
      await notificationService.createNotifications({
        to: id,
        channel: "sms",
        template: "otp",
        data: { otp },
        trigger_type: "otp.send",
        resource_id: id,
        resource_type: "otp",
      })
    }
  } catch (err) {
    console.error("[otp/send] Failed to send OTP notification:", err)
    return res.status(500).json({ message: "Failed to send OTP. Please try again." })
  }

  return res.status(200).json({ success: true })
}
