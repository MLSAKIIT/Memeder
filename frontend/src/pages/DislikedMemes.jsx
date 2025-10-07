import { useState, useEffect } from 'react';

const DislikedMemes = () => {
  const [dislikedMemes, setDislikedMemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDislikedMemes();
  }, []);

  const fetchDislikedMemes = async () => {
    try {
      // REMOVED: const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/memes/disliked', {
        // REMOVED: Authorization header
        credentials: 'include' // ADDED: Use cookies for auth
      });
      
      if (!response.ok) throw new Error('Failed to fetch');
      
      const data = await response.json();
      setDislikedMemes(data);
      setLoading(false);
    } catch {
      setError('Failed to load disliked memes');
      setLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (error) return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Disliked Memes</h1>
      {dislikedMemes.length === 0 ? (
        <p className="text-center text-gray-500">No disliked memes yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dislikedMemes.map((meme) => (
            <div key={meme._id} className="bg-white rounded-lg shadow-lg overflow-hidden opacity-60">
              <img 
                src={meme.imageUrl} 
                alt={meme.title} 
                className="w-full h-64 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg">{meme.title}</h3>
                {meme.caption && <p className="text-gray-600 text-sm mt-2">{meme.caption}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DislikedMemes;