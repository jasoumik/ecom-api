import { defineWidgetConfig } from '@medusajs/admin-sdk'
import { Heading, Text, Button, toast } from '@medusajs/ui'
import { useEffect, useRef, useState } from 'react'
import { Trash, Upload } from '@medusajs/icons'

type MediaFile = {
  id: string
  url: string
  filename: string
}

type CollectionData = {
  id: string
  metadata?: Record<string, unknown> | null
}

const ComboImagesWidget = ({ data }: { data: CollectionData }) => {
  const [images, setImages] = useState<MediaFile[]>([])
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function fetchImages() {
    const res = await fetch(
      `/admin/media?entityType=combo-collection&entityId=${data.id}&limit=50`,
      { credentials: 'include' }
    )
    const json = await res.json()
    setImages(json.data ?? [])
  }

  useEffect(() => { fetchImages() }, [data.id])

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    setUploading(true)
    const uploaded: MediaFile[] = []

    for (const file of Array.from(files)) {
      const form = new FormData()
      form.append('file', file)
      form.append('entityType', 'combo-collection')
      form.append('entityId', data.id)
      form.append('applyWatermark', 'false')

      try {
        const res = await fetch('/admin/media', {
          method: 'POST',
          credentials: 'include',
          body: form,
        })
        const json = await res.json()
        if (json.data?.url) uploaded.push(json.data)
        else toast.error('Upload failed', { description: json.error?.message ?? 'Unknown error' })
      } catch {
        toast.error('Upload failed', { description: file.name })
      }
    }

    if (uploaded.length > 0) {
      const allImages = [...images, ...uploaded]
      await syncMetadata(allImages)
      setImages(allImages)
      toast.success(`${uploaded.length} image${uploaded.length > 1 ? 's' : ''} uploaded`)
    }

    setUploading(false)
  }

  async function handleDelete(mediaId: string, url: string) {
    try {
      await fetch(`/admin/media/${mediaId}`, { method: 'DELETE', credentials: 'include' })
      const remaining = images.filter((img) => img.id !== mediaId)
      await syncMetadata(remaining)
      setImages(remaining)
      toast.success('Image removed')
    } catch {
      toast.error('Failed to remove image')
    }
  }

  async function syncMetadata(imgs: MediaFile[]) {
    // First image = main image_url, all = images (comma-separated)
    const metadata: Record<string, unknown> = {
      ...(data.metadata ?? {}),
      image: imgs[0]?.url ?? '',
      images: imgs.map((i) => i.url).join(','),
    }
    await fetch(`/admin/collections/${data.id}`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ metadata }),
    })
  }

  return (
    <div className="bg-white border border-ui-border-base rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <Heading level="h2" className="text-ui-fg-base">Combo Images</Heading>
        <Button
          variant="secondary"
          size="small"
          isLoading={uploading}
          onClick={() => inputRef.current?.click()}
        >
          <Upload className="mr-1.5" />
          Upload
        </Button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {images.length === 0 ? (
        <div
          className="border-2 border-dashed border-ui-border-base rounded-lg p-8 text-center cursor-pointer hover:border-ui-border-interactive transition-colors"
          onClick={() => inputRef.current?.click()}
        >
          <Upload className="mx-auto mb-2 text-ui-fg-muted" />
          <Text className="text-ui-fg-muted text-sm">Click or drag images to upload</Text>
          <Text className="text-ui-fg-subtle text-xs mt-1">First image becomes the main combo image</Text>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {images.map((img, idx) => (
            <div key={img.id} className="relative group rounded-lg overflow-hidden border border-ui-border-base aspect-square bg-ui-bg-subtle">
              <img src={img.url} alt={img.filename} className="w-full h-full object-cover" />
              {idx === 0 && (
                <span className="absolute top-1 left-1 text-[10px] bg-black/60 text-white px-1.5 py-0.5 rounded font-medium">
                  Main
                </span>
              )}
              <button
                onClick={() => handleDelete(img.id, img.url)}
                className="absolute top-1 right-1 p-1 rounded bg-white/80 text-ui-fg-error opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
              >
                <Trash className="w-3 h-3" />
              </button>
            </div>
          ))}
          <div
            className="border-2 border-dashed border-ui-border-base rounded-lg aspect-square flex items-center justify-center cursor-pointer hover:border-ui-border-interactive transition-colors"
            onClick={() => inputRef.current?.click()}
          >
            <Upload className="text-ui-fg-muted" />
          </div>
        </div>
      )}
    </div>
  )
}

export const config = defineWidgetConfig({
  zone: 'product_collection.details.before',
})

export default ComboImagesWidget
