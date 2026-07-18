import { defineRouteConfig } from '@medusajs/admin-sdk'
import { MagnifyingGlass } from '@medusajs/icons'
import { Button, Heading, Text, toast } from '@medusajs/ui'
import { useState } from 'react'

const ReindexSearchPage = () => {
  const [reindexing, setReindexing] = useState(false)

  const handleReindex = async () => {
    setReindexing(true)
    try {
      const res = await fetch('/admin/search/reindex', {
        method: 'POST',
        credentials: 'include',
      })
      const json = await res.json()
      if (!res.ok) {
        throw new Error(json.error ?? 'Reindexing failed')
      }
      toast.success(`Reindexing complete (${json.totalProducts} products)`)
    } catch (error) {
      toast.error((error as Error).message || 'Failed to reindex search')
    } finally {
      setReindexing(false)
    }
  }

  return (
    <div className="p-8 max-w-2xl">
      <Heading level="h1" className="mb-1">Reindex Search</Heading>
      <Text className="text-ui-fg-subtle mb-8">
        Rebuild the MeiliSearch index so recent product, price and content
        changes are searchable on the live site immediately.
      </Text>

      <div className="bg-ui-bg-base border border-ui-border-base rounded-lg p-6">
        <Heading level="h2" className="mb-2">Full reindex</Heading>
        <Text className="text-ui-fg-subtle text-sm mb-4">
          This clears the search index and re-populates it with all products.
          It's safe to run any time after making changes.
        </Text>
        <Button
          variant="primary"
          size="small"
          isLoading={reindexing}
          onClick={handleReindex}
        >
          Reindex Search
        </Button>
      </div>
    </div>
  )
}

export const config = defineRouteConfig({
  label: 'Reindex Search',
  icon: MagnifyingGlass,
})

export default ReindexSearchPage
