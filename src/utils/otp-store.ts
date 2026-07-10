import { Pool } from 'pg'

let _pool: Pool | null = null
function getPool(): Pool {
  if (!_pool) _pool = new Pool({ connectionString: process.env.DATABASE_URL })
  return _pool
}

// Ensure the table exists on first use — idempotent, safe to call repeatedly
let _tableReady = false
async function ensureTable(): Promise<void> {
  if (_tableReady) return
  await getPool().query(`
    CREATE TABLE IF NOT EXISTS otp_verification (
      identifier TEXT PRIMARY KEY,
      otp        TEXT        NOT NULL,
      expires_at TIMESTAMPTZ NOT NULL
    )
  `)
  _tableReady = true
}

export async function setOtp(identifier: string, otp: string, ttlMs = 5 * 60 * 1000): Promise<void> {
  await ensureTable()
  const expiresAt = new Date(Date.now() + ttlMs)
  await getPool().query(
    `INSERT INTO otp_verification (identifier, otp, expires_at)
     VALUES ($1, $2, $3)
     ON CONFLICT (identifier) DO UPDATE SET otp = EXCLUDED.otp, expires_at = EXCLUDED.expires_at`,
    [identifier, otp, expiresAt],
  )
}

export async function verifyOtp(identifier: string, otp: string): Promise<boolean> {
  await ensureTable()
  const { rows } = await getPool().query(
    `DELETE FROM otp_verification
     WHERE identifier = $1 AND otp = $2 AND expires_at > NOW()
     RETURNING identifier`,
    [identifier, otp],
  )
  return rows.length > 0
}

export function generateOtp(): string {
  return String(Math.floor(100000 + Math.random() * 900000))
}
