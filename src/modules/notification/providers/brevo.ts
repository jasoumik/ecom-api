import { AbstractNotificationProviderService, ModuleProvider, Modules } from "@medusajs/framework/utils"
import type {
  ProviderSendNotificationDTO,
  ProviderSendNotificationResultsDTO,
} from "@medusajs/types"
import nodemailer from "nodemailer"
import { orderPlacedEmail } from "../templates/email/order-placed"
import { orderShippedEmail } from "../templates/email/order-shipped"
import { welcomeEmail } from "../templates/email/welcome"
import { passwordResetEmail } from "../templates/email/password-reset"
import { otpEmail } from "../templates/email/otp"

type Options = {
  apiKey?: string
  senderEmail?: string
  senderName?: string
  emailProvider?: string
  smtpHost?: string
  smtpPort?: string
  smtpSecure?: string
  smtpUser?: string
  smtpPass?: string
  smtpFrom?: string
}

const TEMPLATES: Record<string, (data: any) => { subject: string; html: string; text: string }> = {
  "order-placed": orderPlacedEmail,
  "order-shipped": orderShippedEmail,
  "welcome": welcomeEmail,
  "password-reset": passwordResetEmail,
  "otp": otpEmail,
}

class BrevoEmailProvider extends AbstractNotificationProviderService {
  static identifier = "brevo"

  private options_: Options

  constructor(_: unknown, options: Options) {
    super()
    this.options_ = options
  }

  private async sendViaBrevo(to: string, subject: string, html: string, text: string): Promise<string | undefined> {
    const apiKey = this.options_.apiKey
    if (!apiKey) {
      console.error("[BrevoProvider] BREVO_API_KEY not set")
      return undefined
    }

    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify({
        sender: {
          name: this.options_.senderName || "GlowNest",
          email: this.options_.senderEmail || "noreply@glownest.com",
        },
        to: [{ email: to }],
        subject,
        htmlContent: html,
        textContent: text,
      }),
    })

    if (!response.ok) {
      const body = await response.text()
      throw new Error(`Brevo error ${response.status}: ${body}`)
    }

    const data = (await response.json()) as { messageId?: string }
    console.log(`[BrevoProvider] Email sent to ${to} — messageId: ${data.messageId}`)
    return data.messageId
  }

  private async sendViaNodemailer(to: string, subject: string, html: string, text: string): Promise<string> {
    let transporter: nodemailer.Transporter

    if (!this.options_.smtpHost) {
      const testAccount = await nodemailer.createTestAccount()
      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: { user: testAccount.user, pass: testAccount.pass },
      })
      console.log(`[BrevoProvider/Nodemailer] Using Ethereal: ${testAccount.user}`)
    } else {
      transporter = nodemailer.createTransport({
        host: this.options_.smtpHost,
        port: parseInt(this.options_.smtpPort || "587", 10),
        secure: this.options_.smtpSecure === "true",
        auth: this.options_.smtpUser
          ? { user: this.options_.smtpUser, pass: this.options_.smtpPass }
          : undefined,
      })
    }

    const from = this.options_.smtpFrom || '"GlowNest" <noreply@glownest.com>'
    const info = await transporter.sendMail({ from, to, subject, html, text })

    if (!this.options_.smtpHost) {
      console.log(`[BrevoProvider/Nodemailer] Preview: ${nodemailer.getTestMessageUrl(info)}`)
    }

    return info.messageId
  }

  async send(notification: ProviderSendNotificationDTO): Promise<ProviderSendNotificationResultsDTO> {
    const templateFn = TEMPLATES[notification.template]
    if (!templateFn) {
      throw new Error(`[BrevoProvider] Unknown template: "${notification.template}"`)
    }

    const { subject, html, text } = templateFn(notification.data || {})
    const useNodemailer = this.options_.emailProvider === "nodemailer"

    let messageId: string | undefined

    if (useNodemailer) {
      messageId = await this.sendViaNodemailer(notification.to, subject, html, text)
    } else {
      try {
        messageId = await this.sendViaBrevo(notification.to, subject, html, text)
      } catch (err) {
        console.warn("[BrevoProvider] Brevo failed, falling back to Nodemailer:", err)
        messageId = await this.sendViaNodemailer(notification.to, subject, html, text)
      }
    }

    return { id: messageId }
  }
}

export default ModuleProvider(Modules.NOTIFICATION, {
  services: [BrevoEmailProvider],
})
