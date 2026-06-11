export interface OrderShippedSmsData {
  display_id: string | number
  tracking_number?: string
}

export function orderShippedSms(data: OrderShippedSmsData): string {
  if (data.tracking_number) {
    return `GlowNest: Your order #${data.display_id} has been shipped! Track with: ${data.tracking_number}. Thank you for shopping with us!`
  }
  return `GlowNest: Your order #${data.display_id} has been shipped and is on its way. Thank you for shopping with us!`
}
