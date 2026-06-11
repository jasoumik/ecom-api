export interface PasswordResetEmailData {
  first_name: string
  reset_link: string
}

export function passwordResetEmail(data: PasswordResetEmailData): {
  subject: string
  html: string
  text: string
} {
  const subject = "Reset your GlowNest password"

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
              <h1 style="margin: 0 0 8px 0; font-size: 22px; color: #1a1a1a;">Reset Your Password</h1>
              <p style="margin: 0 0 16px 0; font-size: 15px; color: #555; line-height: 1.6;">
                Hi ${data.first_name}, we received a request to reset the password for your GlowNest account.
              </p>
              <p style="margin: 0 0 24px 0; font-size: 15px; color: #555; line-height: 1.6;">
                Click the button below to set a new password. This link is valid for 30 minutes.
              </p>

              <div style="text-align: center; margin: 32px 0;">
                <a href="${data.reset_link}" style="display: inline-block; background-color: #C2185B; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 4px; font-size: 15px; font-weight: 600;">Reset Password</a>
              </div>

              <p style="margin: 0; font-size: 13px; color: #999; line-height: 1.6;">
                If you did not request this, you can safely ignore this email. Your password will not change.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f5f5f5; padding: 20px 32px; border-radius: 0 0 8px 8px; text-align: center;">
              <p style="margin: 0 0 4px 0; font-size: 12px; color: #999;">GlowNest — Beauty &amp; Baby Care, Bangladesh</p>
              <p style="margin: 0; font-size: 12px; color: #bbb;">You received this email because a password reset was requested for your account.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

  const text = `Hi ${data.first_name},

We received a request to reset your GlowNest password.

Reset your password here: ${data.reset_link}

This link is valid for 30 minutes. If you did not request this, you can safely ignore this email.

— GlowNest`

  return { subject, html, text }
}
