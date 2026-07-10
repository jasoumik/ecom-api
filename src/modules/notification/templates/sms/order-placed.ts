export interface OrderPlacedSmsData {
  display_id: string | number
  total: number
  customer_name: string
}

export function orderPlacedSms(data: OrderPlacedSmsData): string {
  return `Replant Glow: Hi ${data.customer_name}, your order #${data.display_id} for ৳${data.total} is confirmed. We'll notify you when it ships. Thank you!`
}
