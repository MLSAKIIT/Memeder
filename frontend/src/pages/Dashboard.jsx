import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/Button';

const Dashboard = () => {
  const { user } = useAuth();
  const [memes, setMemes] = useState([]);
  const [currentMemeIndex, setCurrentMemeIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // fetch memes from backend
  useEffect(() => {
    const fetchMemes = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/memes', {
          credentials: 'include'
        });
        
        if (response.ok) {
          const data = await response.json();
          setMemes(data.data || []);
        } else {
          setError('failed to load memes');
        }
      } catch (err) {
        setError('network error loading memes');
      } finally {
        setLoading(false);
      }
    };

    fetchMemes();
  }, []);

  // handle swipe action
  const handleSwipe = async (direction) => {
    if (currentMemeIndex >= memes.length) return;

    const currentMeme = memes[currentMemeIndex];
    
    try {
      // send swipe data to backend
      await fetch('http://localhost:3000/api/memes/swipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          memeId: currentMeme._id,
          direction: direction
        })
      });

      // move to next meme
      setCurrentMemeIndex(prev => prev + 1);
    } catch (err) {
      console.error('swipe error:', err);
    }
  };

  // handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowLeft') {
        handleSwipe('left');
      } else if (e.key === 'ArrowRight') {
        handleSwipe('right');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentMemeIndex, memes]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-xl text-gray-300">loading memes...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-red-400 text-xl">{error}</div>
      </div>
    );
  }

  if (currentMemeIndex >= memes.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold mb-4 text-white">you've seen all memes!</h2>
          <p className="text-gray-300 mb-4">check back later for new content</p>
          <Button 
            onClick={() => setCurrentMemeIndex(0)}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            start over
          </Button>
        </div>
      </div>
    );
  }

  const currentMeme = memes[currentMemeIndex];

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* welcome message */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white">
            welcome back, {user?.username}!
          </h1>
          <p className="text-gray-300">
            meme {currentMemeIndex + 1} of {memes.length}
          </p>
        </div>

        {/* meme card */}
        <div className="bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-700">
          <div className="aspect-square bg-gray-700 flex items-center justify-center">
            {currentMeme.imageUrl ? (
              <img 
                src={currentMeme.imageUrl} 
                alt="meme" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-6xl">🎭</div>
            )}
          </div>
          
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-2 text-white">{currentMeme.title}</h3>
            <p className="text-gray-300 text-sm mb-6">{currentMeme.description}</p>
            
            {/* swipe buttons */}
            <div className="flex justify-center space-x-4">
              <Button
                onClick={() => handleSwipe('left')}
                variant="destructive"
                className="px-8 py-3 rounded-full"
              >
                👎 pass
              </Button>
              <Button
                onClick={() => handleSwipe('right')}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 px-8 py-3 rounded-full"
              >
                👍 like
              </Button>
            </div>
            
            {/* keyboard hints */}
            <div className="text-center mt-4 text-xs text-gray-400">
              use ← → arrow keys or click buttons
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
