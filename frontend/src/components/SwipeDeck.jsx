import { useCallback, useMemo, useRef, useState } from 'react'
import TinderCard from 'react-tinder-card'

export default function SwipeDeck({ memes = [], onExhausted }) {
  const [stack, setStack] = useState(memes)
  const [swipingId, setSwipingId] = useState(null)
  const [dir, setDir] = useState(null) // 'left' or 'right' for overlay
  const childRefs = useMemo(
    () => Array(memes.length).fill(0).map(() => ({ current: null })),
    [memes.length]
  )

  const handleSwipe = useCallback(async (direction, meme, index) => {
    setDir(direction)
    setSwipingId(meme.id || meme._id)
    try {
      // Only record left/right
      if (direction === 'left' || direction === 'right') {
        await fetch(`http://localhost:3000/api/memes/${meme.id || meme._id}/swipe`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ direction })
        })
        // optimistic - ignore response
      }
    } catch (_) {
      // ignore network errors for fluid UX
    } finally {
      setDir(null)
      setSwipingId(null)
    }
  }, [])

  const handleCardLeftScreen = useCallback((identifier) => {
    setStack(prev => {
      const next = prev.slice(1)
      if (next.length === 0) onExhausted?.()
      return next
    })
  }, [onExhausted])

  return (
    <div className="relative w-full h-[70vh] max-w-md mx-auto">
      {stack.map((meme, idx) => {
        const key = meme.id || meme._id || idx
        return (
          <div key={key} className="absolute inset-0">
            <TinderCard
              ref={childRefs[idx]}
              onSwipe={(d) => handleSwipe(d, meme, idx)}
              onCardLeftScreen={() => handleCardLeftScreen(key)}
              preventSwipe={[ 'up', 'down' ]}
              swipeRequirementType="position"
              swipeThreshold={100}
              flickOnSwipe={true}
              className="w-full h-full"
            >
              <div className="relative w-full h-full select-none">
                <img
                  src={meme.imageUrl}
                  alt={meme.title}
                  className="rounded-xl w-full h-full object-cover shadow-md"
                  draggable={false}
                />
                {/* Title overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent rounded-b-xl">
                  <h3 className="text-white text-lg font-semibold line-clamp-2">{meme.title}</h3>
                </div>
                {/* Like/Pass indicators */}
                <div className="pointer-events-none absolute inset-0">
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-md border-2 border-green-400 text-green-400 font-bold text-xl opacity-0 group-[.swiping-right]:opacity-100 transition-opacity">
                    LIKE
                  </div>
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-md border-2 border-red-400 text-red-400 font-bold text-xl opacity-0 group-[.swiping-left]:opacity-100 transition-opacity">
                    PASS
                  </div>
                </div>
              </div>
            </TinderCard>
          </div>
        )
      }).reverse()}
    </div>
  )
}
