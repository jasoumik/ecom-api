import { defineRouteConfig } from '@medusajs/admin-sdk'
import { Trash } from '@medusajs/icons'
import { Button, Heading, Text, toast } from '@medusajs/ui'
import { useEffect, useState } from 'react'

type TrashItem = {
  key: string
  trashedAt: string
  originalKey: string
  size: number
  url: string
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function formatDate(iso: string) {
  try { return new Date(iso).toLocaleString() } catch { return iso }
}

const MediaTrashPage = () => {
  const [items, setItems] = useState<TrashItem[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [restoring, setRestoring] = useState<string | null>(null)
  const [emptyingAll, setEmptyingAll] = useState(false)

  const fetchTrash = async () => {
    setLoading(true)
    try {
      const res = await fetch('/admin/media/trash', { credentials: 'include' })
      const json = await res.json()
      setItems(json.data ?? [])
    } catch {
      toast.error('Failed to load trash')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchTrash() }, [])

  const handleDelete = async (key: string) => {
    setDeleting(key)
    try {
      await fetch('/admin/media/trash', {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key }),
      })
      toast.success('Permanently deleted from Cloudflare R2')
      setItems((prev) => prev.filter((i) => i.key !== key))
    } catch {
      toast.error('Delete failed')
    } finally {
      setDeleting(null)
    }
  }

  const handleRestore = async (key: string) => {
    setRestoring(key)
    try {
      const res = await fetch('/admin/media/trash', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key }),
      })
      const json = await res.json()
      toast.success('File restored to: ' + json.data?.url)
      setItems((prev) => prev.filter((i) => i.key !== key))
    } catch {
      toast.error('Restore failed')
    } finally {
      setRestoring(null)
    }
  }

  const handleEmptyAll = async () => {
    if (!confirm(`Permanently delete all ${items.length} file(s) from Cloudflare R2? This cannot be undone.`)) return
    setEmptyingAll(true)
    try {
      await fetch('/admin/media/trash', {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })
      toast.success('Trash emptied')
      setItems([])
    } catch {
      toast.error('Failed to empty trash')
    } finally {
      setEmptyingAll(false)
    }
  }

  return (
    <div className="p-8">
      <div className="flex items-start justify-between mb-6">
        <div>
          <Heading level="h1" className="mb-1">Media Trash</Heading>
          <Text className="text-ui-fg-subtle">
            Files removed from products are held here before permanent deletion from Cloudflare R2.
          </Text>
        </div>
        {items.length > 0 && (
          <Button
            variant="danger"
            size="small"
            isLoading={emptyingAll}
            onClick={handleEmptyAll}
          >
            Empty Trash ({items.length})
          </Button>
        )}
      </div>

      {loading ? (
        <Text className="text-ui-fg-subtle">Loading...</Text>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 border border-dashed border-ui-border-base rounded-lg">
          <Trash className="text-ui-fg-muted mb-3" style={{ width: 40, height: 40 }} />
          <Text className="text-ui-fg-subtle">Trash is empty</Text>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {items.map((item) => (
            <div
              key={item.key}
              className="flex items-center gap-4 bg-ui-bg-base border border-ui-border-base rounded-lg p-4"
            >
              {/* Thumbnail */}
              <div className="w-16 h-16 flex-shrink-0 rounded-md overflow-hidden bg-ui-bg-subtle border border-ui-border-base">
                <img
                  src={item.url}
                  alt={item.originalKey}
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <Text className="font-medium text-sm truncate">{item.originalKey}</Text>
                <Text className="text-ui-fg-subtle text-xs mt-0.5">
                  Deleted {formatDate(item.trashedAt)} · {formatBytes(item.size)}
                </Text>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <Button
                  variant="secondary"
                  size="small"
                  isLoading={restoring === item.key}
                  onClick={() => handleRestore(item.key)}
                >
                  Restore
                </Button>
                <Button
                  variant="danger"
                  size="small"
                  isLoading={deleting === item.key}
                  onClick={() => handleDelete(item.key)}
                >
                  Delete Forever
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export const config = defineRouteConfig({
  label: 'Media Trash',
  icon: Trash,
})

export default MediaTrashPage
