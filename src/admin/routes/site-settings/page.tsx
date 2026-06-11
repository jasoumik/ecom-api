import { defineRouteConfig } from '@medusajs/admin-sdk'
import { Photo } from '@medusajs/icons'
import { Button, Heading, Text, toast } from '@medusajs/ui'
import { useEffect, useRef, useState } from 'react'

const SiteSettingsPage = () => {
  const [heroImageUrl, setHeroImageUrl] = useState<string | null>(null)
  const [philosophyImage1Url, setPhilosophyImage1Url] = useState<string | null>(null)
  const [philosophyImage2Url, setPhilosophyImage2Url] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadingPhil1, setUploadingPhil1] = useState(false)
  const [uploadingPhil2, setUploadingPhil2] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const philFile1Ref = useRef<HTMLInputElement>(null)
  const philFile2Ref = useRef<HTMLInputElement>(null)

  const fetchSettings = async () => {
    setLoading(true)
    try {
      const [heroRes, philRes] = await Promise.all([
        fetch('/admin/site-settings/hero', { credentials: 'include' }),
        fetch('/admin/site-settings/philosophy', { credentials: 'include' }),
      ])
      const heroJson = await heroRes.json()
      const philJson = await philRes.json()
      setHeroImageUrl(heroJson.data?.heroImageUrl ?? null)
      setPhilosophyImage1Url(philJson.data?.image1Url ?? null)
      setPhilosophyImage2Url(philJson.data?.image2Url ?? null)
    } catch {
      toast.error('Failed to load site settings')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchSettings() }, [])

  const handleHeroUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/admin/site-settings/hero', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      })
      const json = await res.json()
      const url = json.data?.heroImageUrl
      if (!url) throw new Error('No URL returned')
      setHeroImageUrl(url)
      toast.success('Hero image uploaded successfully')
    } catch {
      toast.error('Hero image upload failed')
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const handlePhilosophyUpload = (slot: '1' | '2') => async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const setUpl = slot === '1' ? setUploadingPhil1 : setUploadingPhil2
    const ref = slot === '1' ? philFile1Ref : philFile2Ref
    setUpl(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('slot', slot)
      const res = await fetch('/admin/site-settings/philosophy', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      })
      const json = await res.json()
      const url = json.data?.imageUrl
      if (!url) throw new Error('No URL returned')
      if (slot === '1') setPhilosophyImage1Url(url)
      else setPhilosophyImage2Url(url)
      toast.success(`Philosophy image ${slot} uploaded successfully`)
    } catch {
      toast.error(`Philosophy image ${slot} upload failed`)
    } finally {
      setUpl(false)
      if (ref.current) ref.current.value = ''
    }
  }

  if (loading) {
    return <div className="p-8 text-ui-fg-subtle">Loading...</div>
  }

  return (
    <div className="p-8 max-w-2xl">
      <Heading level="h1" className="mb-1">Site Settings</Heading>
      <Text className="text-ui-fg-subtle mb-8">
        Manage your storefront appearance, including the homepage hero image.
      </Text>

      <div className="bg-ui-bg-base border border-ui-border-base rounded-lg p-6 mb-6">
        <Heading level="h2" className="mb-4">Hero Image</Heading>
        <Text className="text-ui-fg-subtle text-sm mb-4">
          This image is displayed as the main banner on the storefront homepage.
        </Text>

        {heroImageUrl ? (
          <div className="mb-4">
            <img
              src={heroImageUrl}
              alt="Hero image"
              className="w-full max-h-64 object-cover rounded border border-ui-border-base"
            />
            <Text className="text-ui-fg-subtle text-sm mt-2">Current hero image</Text>
          </div>
        ) : (
          <div className="mb-4 flex items-center gap-2 text-ui-fg-subtle">
            <Photo />
            <Text className="text-sm">No hero image uploaded yet</Text>
          </div>
        )}

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleHeroUpload}
        />
        <Button
          variant="secondary"
          size="small"
          isLoading={uploading}
          onClick={() => fileRef.current?.click()}
        >
          {heroImageUrl ? 'Replace Hero Image' : 'Upload Hero Image'}
        </Button>
      </div>

      <div className="bg-ui-bg-base border border-ui-border-base rounded-lg p-6">
        <Heading level="h2" className="mb-4">Philosophy Images</Heading>
        <Text className="text-ui-fg-subtle text-sm mb-6">
          These images appear in the Brand Philosophy section on the storefront homepage.
        </Text>

        <div className="grid grid-cols-2 gap-6">
          {/* Image 1 — left tall */}
          <div>
            <Text className="text-sm font-medium text-ui-fg-base mb-2">Image 1 (left tall)</Text>
            {philosophyImage1Url ? (
              <div className="mb-3">
                <img
                  src={philosophyImage1Url}
                  alt="Philosophy image 1"
                  className="w-full h-40 object-cover rounded border border-ui-border-base"
                />
              </div>
            ) : (
              <div className="mb-3 flex items-center gap-2 text-ui-fg-subtle">
                <Photo />
                <Text className="text-sm">No image uploaded yet</Text>
              </div>
            )}
            <input
              ref={philFile1Ref}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhilosophyUpload('1')}
            />
            <Button
              variant="secondary"
              size="small"
              isLoading={uploadingPhil1}
              onClick={() => philFile1Ref.current?.click()}
            >
              {philosophyImage1Url ? 'Replace Image 1' : 'Upload Image 1'}
            </Button>
          </div>

          {/* Image 2 — right top */}
          <div>
            <Text className="text-sm font-medium text-ui-fg-base mb-2">Image 2 (right top)</Text>
            {philosophyImage2Url ? (
              <div className="mb-3">
                <img
                  src={philosophyImage2Url}
                  alt="Philosophy image 2"
                  className="w-full h-40 object-cover rounded border border-ui-border-base"
                />
              </div>
            ) : (
              <div className="mb-3 flex items-center gap-2 text-ui-fg-subtle">
                <Photo />
                <Text className="text-sm">No image uploaded yet</Text>
              </div>
            )}
            <input
              ref={philFile2Ref}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhilosophyUpload('2')}
            />
            <Button
              variant="secondary"
              size="small"
              isLoading={uploadingPhil2}
              onClick={() => philFile2Ref.current?.click()}
            >
              {philosophyImage2Url ? 'Replace Image 2' : 'Upload Image 2'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export const config = defineRouteConfig({
  label: 'Site Settings',
  icon: Photo,
})

export default SiteSettingsPage
