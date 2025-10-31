import { useEffect, useState } from 'react'
import { Link } from 'react-router'

export default function MyMemes() {
  const [memes, setMemes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const load = async () => {
      setError(null)
      try {
        const res = await fetch('http://localhost:3000/api/memes/mine', { credentials: 'include' })
        if (!res.ok) throw new Error('Failed to fetch your memes')
        const json = await res.json()
        const list = json?.data?.memes || []
        setMemes(list)
      } catch (e) {
        setError(e.message || 'Error loading memes')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>
  if (error) return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-zinc-900 mb-8">My Memes</h1>
      {memes.length === 0 ? (
        <p className="text-zinc-600">You haven't posted any memes yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {memes.map((meme) => (
            <div key={meme.id} className="bg-white rounded-lg shadow overflow-hidden">
              <img src={meme.imageUrl} alt={meme.title} className="w-full h-56 object-cover" />
              <div className="p-4">
                <h3 className="font-semibold text-zinc-900">{meme.title}</h3>
                {meme.description && (
                  <p className="text-sm text-zinc-600 mt-1">{meme.description}</p>
                )}
                <div className="mt-3 flex gap-3">
                  <Link
                    to={`/edit/${meme.id}`}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
