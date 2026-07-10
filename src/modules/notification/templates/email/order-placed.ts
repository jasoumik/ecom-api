export interface OrderPlacedEmailData {
  id: string
  display_id: string | number
  customer_name: string
  email: string
  items: Array<{
    title: string
    quantity: number
    unit_price: number
  }>
  subtotal: number
  shipping_total: number
  tax_total: number
  total: number
  shipping_address: {
    address_1: string
    city: string
    postal_code?: string
  }
  payment_method: string
}

export function orderPlacedEmail(order: OrderPlacedEmailData): {
  subject: string
  html: string
  text: string
} {
  const subject = `Order Confirmed — #${order.display_id} | Replant Glow`

  const itemRows = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 10px 8px; border-bottom: 1px solid #f0f0f0; font-size: 14px; color: #333;">${item.title}</td>
        <td style="padding: 10px 8px; border-bottom: 1px solid #f0f0f0; font-size: 14px; color: #333; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px 8px; border-bottom: 1px solid #f0f0f0; font-size: 14px; color: #333; text-align: right;">৳${item.unit_price.toLocaleString("en-BD")}</td>
      </tr>`
    )
    .join("")

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

              <h1 style="margin: 0 0 8px 0; font-size: 22px; color: #1a1a1a;">Thank you for your order!</h1>
              <p style="margin: 0 0 24px 0; font-size: 15px; color: #555;">Hi ${order.customer_name}, we've received your order and it's being processed.</p>

              <p style="margin: 0 0 16px 0; font-size: 15px; color: #333;"><strong>Order #${order.display_id}</strong></p>

              <!-- Items table -->
              <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; margin-bottom: 24px;">
                <thead>
                  <tr style="background-color: #fce4ec;">
                    <th style="padding: 10px 8px; text-align: left; font-size: 13px; color: #C2185B; font-weight: 600; border-bottom: 2px solid #C2185B;">Product</th>
                    <th style="padding: 10px 8px; text-align: center; font-size: 13px; color: #C2185B; font-weight: 600; border-bottom: 2px solid #C2185B;">Qty</th>
                    <th style="padding: 10px 8px; text-align: right; font-size: 13px; color: #C2185B; font-weight: 600; border-bottom: 2px solid #C2185B;">Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemRows}
                </tbody>
              </table>

              <!-- Totals -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                <tr>
                  <td style="padding: 4px 0; font-size: 14px; color: #555;">Subtotal</td>
                  <td style="padding: 4px 0; font-size: 14px; color: #555; text-align: right;">৳${order.subtotal.toLocaleString("en-BD")}</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; font-size: 14px; color: #555;">Shipping</td>
                  <td style="padding: 4px 0; font-size: 14px; color: #555; text-align: right;">৳${order.shipping_total.toLocaleString("en-BD")}</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; font-size: 14px; color: #555;">Tax</td>
                  <td style="padding: 4px 0; font-size: 14px; color: #555; text-align: right;">৳${order.tax_total.toLocaleString("en-BD")}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0 4px 0; font-size: 16px; color: #1a1a1a; font-weight: bold; border-top: 2px solid #eee;">Total</td>
                  <td style="padding: 10px 0 4px 0; font-size: 16px; color: #C2185B; font-weight: bold; text-align: right; border-top: 2px solid #eee;">৳${order.total.toLocaleString("en-BD")}</td>
                </tr>
              </table>

              <!-- Shipping address -->
              <div style="background-color: #f9f9f9; border-radius: 6px; padding: 16px; margin-bottom: 24px;">
                <p style="margin: 0 0 6px 0; font-size: 13px; font-weight: 600; color: #888; text-transform: uppercase; letter-spacing: 0.5px;">Shipping Address</p>
                <p style="margin: 0; font-size: 14px; color: #333; line-height: 1.6;">
                  ${order.shipping_address.address_1}<br />
                  ${order.shipping_address.city}${order.shipping_address.postal_code ? ", " + order.shipping_address.postal_code : ""}
                </p>
              </div>

              <!-- Payment method -->
              <div style="margin-bottom: 24px;">
                <p style="margin: 0 0 4px 0; font-size: 13px; font-weight: 600; color: #888; text-transform: uppercase; letter-spacing: 0.5px;">Payment Method</p>
                <p style="margin: 0; font-size: 14px; color: #333;">${order.payment_method}</p>
              </div>

              <!-- CTA -->
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

  const text = `Thank you for your order, ${order.customer_name}!

Order #${order.display_id}

Items:
${order.items.map((i) => `- ${i.title} x${i.quantity} — ৳${i.unit_price}`).join("\n")}

Subtotal: ৳${order.subtotal}
Shipping: ৳${order.shipping_total}
Tax: ৳${order.tax_total}
Total: ৳${order.total}

Shipping to: ${order.shipping_address.address_1}, ${order.shipping_address.city}
Payment: ${order.payment_method}

Thank you for shopping with Replant Glow!`

  return { subject, html, text }
}
