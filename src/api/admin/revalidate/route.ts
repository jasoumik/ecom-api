import { MedusaRequest, MedusaResponse } from '@medusajs/framework/http'

/**
 * POST /admin/revalidate
 *
 * Proxies an on-demand cache revalidation request to the storefront so admins
 * can refresh the live site from the panel. The revalidation secret stays
 * server-side and is never exposed to the browser.
 *
 * Requires env vars:
 *   STOREFRONT_URL     e.g. https://replantglow.com
 *   REVALIDATE_SECRET  must match the storefront's REVALIDATE_SECRET
 */
export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const storefrontUrl = process.env.STOREFRONT_URL
  const secret = process.env.REVALIDATE_SECRET

  if (!storefrontUrl || !secret) {
    res.status(500).json({
      error: 'STOREFRONT_URL and REVALIDATE_SECRET must be configured on the server.',
    })
    return
  }

  const target = `${storefrontUrl.replace(/\/+$/, '')}/api/revalidate?secret=${encodeURIComponent(secret)}`

  try {
    const response = await fetch(target, { method: 'POST' })
    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
      res.status(response.status).json({ error: 'Revalidation failed', details: data })
      return
    }

    res.status(200).json({ data })
  } catch (error) {
    res.status(502).json({ error: `Could not reach storefront: ${(error as Error).message}` })
  }
}
