import nodemailer from "nodemailer"

export interface NodemailerEmailParams {
  to: string
  subject: string
  html: string
  text?: string
}

export async function sendNodemailerEmail(params: NodemailerEmailParams): Promise<boolean> {
  let transporter: nodemailer.Transporter

  const smtpHost = process.env.SMTP_HOST

  if (!smtpHost) {
    // Fall back to Ethereal test account
    const testAccount = await nodemailer.createTestAccount()
    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    })
    console.log(`[Nodemailer] SMTP_HOST not set — using Ethereal test account: ${testAccount.user}`)
  } else {
    transporter = nodemailer.createTransport({
      host: smtpHost,
      port: parseInt(process.env.SMTP_PORT || "587", 10),
      secure: process.env.SMTP_SECURE === "true",
      auth: process.env.SMTP_USER
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        : undefined,
    })
  }

  const from = process.env.SMTP_FROM || '"GlowNest" <noreply@glownest.com>'

  try {
    const info = await transporter.sendMail({
      from,
      to: params.to,
      subject: params.subject,
      html: params.html,
      text: params.text,
    })

    console.log(`[Nodemailer] Email sent to ${params.to} — messageId: ${info.messageId}`)

    if (!process.env.SMTP_HOST) {
      console.log(`[Nodemailer] Preview URL: ${nodemailer.getTestMessageUrl(info)}`)
    }

    return true
  } catch (err) {
    console.error(`[Nodemailer] Failed to send email to ${params.to}:`, err)
    return false
  }
}
