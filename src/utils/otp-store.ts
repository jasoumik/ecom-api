type OTPEntry = { otp: string; expiresAt: number }
const store = new Map<string, OTPEntry>()

export function setOtp(identifier: string, otp: string, ttlMs = 5 * 60 * 1000): void {
  store.set(identifier, { otp, expiresAt: Date.now() + ttlMs })
}

export function verifyOtp(identifier: string, otp: string): boolean {
  const entry = store.get(identifier)
  if (!entry) return false
  if (Date.now() > entry.expiresAt) { store.delete(identifier); return false }
  if (entry.otp !== otp) return false
  store.delete(identifier)
  return true
}

export function generateOtp(): string {
  return String(Math.floor(100000 + Math.random() * 900000))
}
