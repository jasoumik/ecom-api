import { defineRouteConfig } from '@medusajs/admin-sdk'
import { ArrowPath } from '@medusajs/icons'
import { Button, Heading, Text, toast } from '@medusajs/ui'
import { useState } from 'react'

const RevalidatePage = () => {
  const [refreshing, setRefreshing] = useState(false)

  const handleRevalidate = async () => {
    setRefreshing(true)
    try {
      const res = await fetch('/admin/revalidate', {
        method: 'POST',
        credentials: 'include',
      })
      const json = await res.json()
      if (!res.ok) {
        throw new Error(json.error ?? 'Revalidation failed')
      }
      toast.success('Storefront cache refreshed')
    } catch (error) {
      toast.error((error as Error).message || 'Failed to refresh storefront')
    } finally {
      setRefreshing(false)
    }
  }

  return (
    <div className="p-8 max-w-2xl">
      <Heading level="h1" className="mb-1">Refresh Storefront</Heading>
      <Text className="text-ui-fg-subtle mb-8">
        Rebuild the storefront's cached pages so recent product, price and content
        changes appear on the live site immediately.
      </Text>

      <div className="bg-ui-bg-base border border-ui-border-base rounded-lg p-6">
        <Heading level="h2" className="mb-2">On-demand revalidation</Heading>
        <Text className="text-ui-fg-subtle text-sm mb-4">
          This clears the cache for the homepage, product, combo and listing pages.
          It's safe to run any time after making changes.
        </Text>
        <Button
          variant="primary"
          size="small"
          isLoading={refreshing}
          onClick={handleRevalidate}
        >
          Refresh Storefront
        </Button>
      </div>
    </div>
  )
}

export const config = defineRouteConfig({
  label: 'Refresh Storefront',
  icon: ArrowPath,
})

export default RevalidatePage
