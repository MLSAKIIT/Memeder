import { useState, useEffect } from 'react';

const LikedMemes = () => {
  const [likedMemes, setLikedMemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLikedMemes();
  }, []);

  const fetchLikedMemes = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/memes/liked', {
        credentials: 'include'
      });
      
      if (!response.ok) throw new Error('failed to fetch');
      
      const data = await response.json();
      setLikedMemes(data.data || []);
      setLoading(false);
    } catch (err) {
      setError('failed to load liked memes');
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      <div className="text-xl text-gray-300">Loading...</div>
    </div>
  );
  
  if (error) return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      <div className="text-red-400 text-xl">{error}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center text-white">Liked Memes</h1>
        {likedMemes.length === 0 ? (
          <div className="text-center">
            <div className="text-6xl mb-4">💔</div>
            <p className="text-gray-400 text-lg">No liked memes yet. Start swiping!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {likedMemes.map((meme) => (
              <div key={meme._id} className="bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-700 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <img 
                  src={meme.imageUrl} 
                  alt={meme.title} 
                  className="w-full h-64 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-white">{meme.title}</h3>
                  {meme.description && <p className="text-gray-300 text-sm mt-2">{meme.description}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LikedMemes;