import { useEffect, useState } from 'react'

export default function Profile() {
  const [liked, setLiked] = useState([])
  const [disliked, setDisliked] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [likedRes, dislikedRes] = await Promise.all([
          fetch('http://localhost:3000/api/memes/liked', { credentials: 'include' }),
          fetch('http://localhost:3000/api/memes/disliked', { credentials: 'include' })
        ])

        if (!likedRes.ok || !dislikedRes.ok) throw new Error('Failed to fetch profile data')

        const likedJson = await likedRes.json()
        const dislikedJson = await dislikedRes.json()

        // Support both {success, data: { memes }} and raw array fallbacks
        const likedMemes = Array.isArray(likedJson) ? likedJson : (likedJson?.data?.memes ?? [])
        const dislikedMemes = Array.isArray(dislikedJson) ? dislikedJson : (dislikedJson?.data?.memes ?? [])

        setLiked(likedMemes)
        setDisliked(dislikedMemes)
        setLoading(false)
      } catch (e) {
        setError('Could not load profile')
        setLoading(false)
      }
    }

    fetchAll()
  }, [])

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-zinc-900 mb-8 text-center">Your Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <section>
          <h2 className="text-xl font-semibold text-zinc-800 mb-4">Liked Memes</h2>
          {liked.length === 0 ? (
            <p className="text-zinc-500">You haven't liked any memes yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {liked.map((meme) => (
                <div key={meme.id || meme._id} className="bg-white rounded-lg shadow overflow-hidden">
                  <img src={meme.imageUrl} alt={meme.title} className="w-full h-56 object-cover" />
                  <div className="p-4">
                    <h3 className="font-semibold text-zinc-900">{meme.title}</h3>
                    {meme.description && (
                      <p className="text-sm text-zinc-600 mt-1">{meme.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-xl font-semibold text-zinc-800 mb-4">Disliked Memes</h2>
          {disliked.length === 0 ? (
            <p className="text-zinc-500">No disliked memes.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {disliked.map((meme) => (
                <div key={meme.id || meme._id} className="bg-white rounded-lg shadow overflow-hidden opacity-70">
                  <img src={meme.imageUrl} alt={meme.title} className="w-full h-56 object-cover" />
                  <div className="p-4">
                    <h3 className="font-semibold text-zinc-900">{meme.title}</h3>
                    {meme.description && (
                      <p className="text-sm text-zinc-600 mt-1">{meme.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
