export interface WelcomeEmailData {
  first_name: string
}

export function welcomeEmail(data: WelcomeEmailData): {
  subject: string
  html: string
  text: string
} {
  const subject = `Welcome to GlowNest, ${data.first_name}!`

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
              <h1 style="margin: 0 0 8px 0; font-size: 22px; color: #1a1a1a;">Welcome, ${data.first_name}! 🌸</h1>
              <p style="margin: 0 0 16px 0; font-size: 15px; color: #555; line-height: 1.6;">
                We're so happy to have you as part of the GlowNest family — your go-to destination for beauty and baby care products in Bangladesh.
              </p>
              <p style="margin: 0 0 24px 0; font-size: 15px; color: #555; line-height: 1.6;">
                Browse our curated collection and enjoy a seamless shopping experience, fast delivery, and trusted brands — all in one place.
              </p>

              <div style="text-align: center; margin-top: 32px;">
                <a href="#" style="display: inline-block; background-color: #C2185B; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 4px; font-size: 15px; font-weight: 600;">Start Shopping</a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f5f5f5; padding: 20px 32px; border-radius: 0 0 8px 8px; text-align: center;">
              <p style="margin: 0 0 4px 0; font-size: 12px; color: #999;">GlowNest — Beauty &amp; Baby Care, Bangladesh</p>
              <p style="margin: 0; font-size: 12px; color: #bbb;">You received this email because you created an account on GlowNest.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

  const text = `Welcome to GlowNest, ${data.first_name}!

We're thrilled to have you as part of our community. Start exploring our collection of beauty and baby care products today.

Thank you for joining GlowNest!`

  return { subject, html, text }
}
