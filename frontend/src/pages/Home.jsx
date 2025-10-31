import { useEffect, useState } from 'react'
import { Button } from '../components/Button'
import SwipeDeck from '../components/SwipeDeck'

export default function Home() {
  const [memes, setMemes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [exhausted, setExhausted] = useState(false)

  useEffect(() => {
    const load = async () => {
      setError(null)
      setExhausted(false)
      try {
        const res = await fetch('http://localhost:3000/api/memes?page=1&limit=20', { credentials: 'include' })
        if (!res.ok) throw new Error('Failed to load memes')
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
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-zinc-900 mb-2">Swipe Right for Laughs</h1>
          <p className="text-zinc-600">Swipe right to like, left to pass.</p>
        </div>

        {memes.length > 0 && !exhausted ? (
          <SwipeDeck memes={memes} onExhausted={() => setExhausted(true)} />
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🎉</div>
            <p className="text-zinc-700">You're all caught up! No more memes to swipe.</p>
            <div className="mt-6">
              <Button onClick={() => window.location.reload()}>Reload</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
