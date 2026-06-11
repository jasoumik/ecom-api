export interface OtpEmailData {
  first_name?: string
  otp: string
}

export function otpEmail(data: OtpEmailData): {
  subject: string
  html: string
  text: string
} {
  const subject = `Your GlowNest verification code: ${data.otp}`
  const greeting = data.first_name ? `Hi ${data.first_name},` : "Hello,"

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f9f9f9; font-family: Arial, Helvetica, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9f9f9; padding: 24px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%;">

          <!-- Header -->
          <tr>
            <td style="background-color: #C2185B; padding: 20px 32px; border-radius: 8px 8px 0 0;">
              <span style="color: #ffffff; font-size: 24px; font-weight: bold; letter-spacing: 1px;">GlowNest</span>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background-color: #ffffff; padding: 32px;">
              <h1 style="margin: 0 0 8px 0; font-size: 22px; color: #1a1a1a;">Verification Code</h1>
              <p style="margin: 0 0 24px 0; font-size: 15px; color: #555; line-height: 1.6;">
                ${greeting} Use the code below to verify your identity. It is valid for 5 minutes.
              </p>

              <div style="background-color: #fce4ec; border-radius: 8px; padding: 24px; text-align: center; margin-bottom: 24px;">
                <span style="font-size: 36px; font-weight: bold; color: #C2185B; letter-spacing: 8px;">${data.otp}</span>
              </div>

              <p style="margin: 0; font-size: 13px; color: #999; line-height: 1.6;">
                Do not share this code with anyone. GlowNest will never ask for this code.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f5f5f5; padding: 20px 32px; border-radius: 0 0 8px 8px; text-align: center;">
              <p style="margin: 0 0 4px 0; font-size: 12px; color: #999;">GlowNest — Beauty &amp; Baby Care, Bangladesh</p>
              <p style="margin: 0; font-size: 12px; color: #bbb;">You received this email because a verification was requested on your account.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

  const text = `${greeting}

Your GlowNest verification code is: ${data.otp}

This code is valid for 5 minutes. Do not share it with anyone.

— GlowNest`

  return { subject, html, text }
}
