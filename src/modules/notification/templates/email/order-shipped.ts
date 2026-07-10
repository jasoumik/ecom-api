export interface OrderShippedEmailData {
  customer_name: string
  order_id: string
  tracking_number?: string
  carrier?: string
}

export function orderShippedEmail(data: OrderShippedEmailData): {
  subject: string
  html: string
  text: string
} {
  const subject = `Your order is on its way! — Replant Glow`

  const trackingSection = data.tracking_number
    ? `
      <div style="background-color: #fce4ec; border-radius: 6px; padding: 16px; margin-bottom: 24px; text-align: center;">
        <p style="margin: 0 0 4px 0; font-size: 13px; font-weight: 600; color: #C2185B; text-transform: uppercase; letter-spacing: 0.5px;">Tracking Number</p>
        <p style="margin: 0; font-size: 18px; font-weight: bold; color: #1a1a1a; letter-spacing: 1px;">${data.tracking_number}</p>
        ${data.carrier ? `<p style="margin: 4px 0 0 0; font-size: 13px; color: #666;">via ${data.carrier}</p>` : ""}
      </div>`
    : `<p style="font-size: 14px; color: #555; margin-bottom: 24px;">Your tracking information will be available soon.</p>`

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
              <span style="color: #ffffff; font-size: 24px; font-weight: bold; letter-spacing: 1px;">Replant Glow</span>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background-color: #ffffff; padding: 32px;">
              <h1 style="margin: 0 0 8px 0; font-size: 22px; color: #1a1a1a;">Your order is on its way! 🚚</h1>
              <p style="margin: 0 0 24px 0; font-size: 15px; color: #555;">Hi ${data.customer_name}, great news — your order <strong>#${data.order_id}</strong> has been shipped.</p>

              ${trackingSection}

              <div style="text-align: center; margin-top: 32px;">
                <a href="#" style="display: inline-block; background-color: #C2185B; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 4px; font-size: 15px; font-weight: 600;">Track Your Order</a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f5f5f5; padding: 20px 32px; border-radius: 0 0 8px 8px; text-align: center;">
              <p style="margin: 0 0 4px 0; font-size: 12px; color: #999;">Replant Glow — Beauty &amp; Baby Care, Bangladesh</p>
              <p style="margin: 0; font-size: 12px; color: #bbb;">You received this email because you placed an order on Replant Glow.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

  const text = `Hi ${data.customer_name},

Your order #${data.order_id} has been shipped!${data.tracking_number ? `\nTracking Number: ${data.tracking_number}${data.carrier ? ` (${data.carrier})` : ""}` : ""}

Thank you for shopping with Replant Glow!`

  return { subject, html, text }
}
