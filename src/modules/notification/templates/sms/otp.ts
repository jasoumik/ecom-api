export interface OtpSmsData {
  otp: string
}

export function otpSms(data: OtpSmsData): string {
  return `Replant Glow: Your verification code is ${data.otp}. Valid for 5 minutes. Do not share this code.`
}
