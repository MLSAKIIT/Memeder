import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { Button } from '../components/Button'

export default function EditMeme() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    title: '',
    imageUrl: '',
    description: '',
    tags: '',
  })
  const [imageFile, setImageFile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  useEffect(() => {
    const load = async () => {
      setError(null)
      try {
        const res = await fetch(`http://localhost:3000/api/memes/${id}`, { credentials: 'include' })
        if (!res.ok) throw new Error('Failed to load meme')
        const json = await res.json()
        const m = json?.data?.meme || json
        const tags = Array.isArray(m?.tags) ? m.tags.join(', ') : ''
        setForm({
          title: m?.title || '',
          imageUrl: m?.imageUrl || '',
          description: m?.description || '',
          tags,
        })
      } catch (e) {
        setError(e.message || 'Error loading meme')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [id])

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0]
    setImageFile(file || null)
  }

  async function saveChanges(e) {
    e?.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(null)

    try {
      const fd = new FormData()
      if (form.title) fd.append('title', form.title)
      if (form.description) fd.append('description', form.description)
      if (form.tags.trim()) {
        const tagsArray = form.tags.split(',').map(t => t.trim()).filter(Boolean)
        fd.append('tags', JSON.stringify(tagsArray))
      }
      if (imageFile) {
        fd.append('image', imageFile)
      } else if (form.imageUrl) {
        // Only send imageUrl if user typed a new one
        fd.append('imageUrl', form.imageUrl)
      }

      const res = await fetch(`http://localhost:3000/api/memes/${id}`, {
        method: 'PUT',
        credentials: 'include',
        body: fd,
      })

      if (!res.ok) {
        const maybe = await res.json().catch(() => null)
        throw new Error(maybe?.message || 'Failed to update meme')
      }

      setSuccess('Meme updated')
      setTimeout(() => navigate('/my-memes'), 800)
    } catch (e) {
      setError(e.message || 'Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold text-zinc-900">Edit Meme</h1>
        <p className="mt-2 text-zinc-600">Update your meme details.</p>

        {error && <div className="mt-4 text-red-600 text-sm">{error}</div>}
        {success && <div className="mt-4 text-green-600 text-sm">{success}</div>}

        <form className="mt-8 space-y-6" onSubmit={saveChanges}>
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-zinc-700">Title</label>
            <input
              id="title"
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              className="mt-2 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 placeholder-zinc-400 shadow-sm focus:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700">Image</label>
            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 placeholder-zinc-400 shadow-sm focus:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
              />
              <input
                id="imageUrl"
                name="imageUrl"
                type="url"
                value={form.imageUrl}
                onChange={handleChange}
                placeholder="https://example.com/meme.jpg"
                className="block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 placeholder-zinc-400 shadow-sm focus:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
              />
            </div>
            <p className="mt-1 text-xs text-zinc-500">Upload a new image or keep the current URL.</p>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-zinc-700">Description</label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={form.description}
              onChange={handleChange}
              className="mt-2 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 placeholder-zinc-400 shadow-sm focus:border-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
            />
          </div>

          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-zinc-700">Tags</label>
            <input
              id="tags"
              name="tags"
              type="text"
              value={form.tags}
              onChange={handleChange}
              placeholder="comma, separated, tags"
              className="mt-2 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 placeholder-zinc-400 shadow-sm focus:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
            />
          </div>

          <div className="pt-2 flex items-center gap-3">
            <Button type="submit" disabled={saving} onClick={saveChanges}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button variant="ghost" onClick={() => navigate(-1)}>Cancel</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
