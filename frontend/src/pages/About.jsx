import React from 'react';

export default function About() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        
        {/* --- Header --- */}
        <h1 className="text-4xl sm:text-5xl font-extrabold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-orange-400">
          About Memeder
        </h1>
        <p className="text-lg text-gray-300 text-center max-w-2xl mx-auto mb-16">
          Memeder is a Tinder-like application for memes where you can discover,
          rate, and enjoy the best memes on the internet.
        </p>

        {/* --- How It Works --- */}
        <h2 className="text-3xl font-bold text-white text-center mb-8">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {/* Card 1: Swipe Right */}
          <div className="bg-gray-800 p-6 rounded-2xl text-center shadow-lg flex flex-col items-center">
            <span className="text-5xl" role="img" aria-label="point right">👆</span>
            <h3 className="text-xl font-semibold text-white mt-4 mb-2">Swipe Right</h3>
            <p className="text-gray-400">Like the memes you find funny.</p>
          </div>
          {/* Card 2: Swipe Left */}
          <div className="bg-gray-800 p-6 rounded-2xl text-center shadow-lg flex flex-col items-center">
            <span className="text-5xl" role="img" aria-label="point left">👈</span>
            <h3 className="text-xl font-semibold text-white mt-4 mb-2">Swipe Left</h3>
            <p className="text-gray-400">Pass on memes that don't resonate.</p>
          </div>
          {/* Card 3: Collect */}
          <div className="bg-gray-800 p-6 rounded-2xl text-center shadow-lg flex flex-col items-center">
            <span className="text-5xl" role="img" aria-label="heart">❤️</span>
            <h3 className="text-xl font-semibold text-white mt-4 mb-2">Build Your Collection</h3>
            <p className="text-gray-400">Save your favorite memes to view later.</p>
          </div>
        </div>

        {/* --- Tech Stack --- */}
        <h2 className="text-3xl font-bold text-white text-center mb-8">
          Tech Stack
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
          {/* Frontend Card */}
          <div className="bg-gray-800 rounded-2xl p-6 ring-1 ring-white/10">
            <h3 className="text-2xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-orange-400">
              Frontend
            </h3>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-center">
                <span className="text-pink-400 mr-2">✓</span>
                <span>React.js</span>
              </li>
              <li className="flex items-center">
                <span className="text-pink-400 mr-2">✓</span>
                <span>Tailwind CSS</span>
              </li>
              <li className="flex items-center">
                <span className="text-pink-400 mr-2">✓</span>
                <span>React Router</span>
              </li>
              <li className="flex items-center">
                <span className="text-pink-400 mr-2">✓</span>
                <span>Vite</span>
              </li>
            </ul>
          </div>
          {/* Backend Card */}
          <div className="bg-gray-800 rounded-2xl p-6 ring-1 ring-white/10">
            <h3 className="text-2xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-orange-400">
              Backend
            </h3>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-center">
                <span className="text-pink-400 mr-2">✓</span>
                <span>Node.js</span>
              </li>
              <li className="flex items-center">
                <span className="text-pink-400 mr-2">✓</span>
                <span>Express.js</span>
              </li>
              <li className="flex items-center">
                <span className="text-pink-400 mr-2">✓</span>
                <span>MongoDB</span>
              </li>
              <li className="flex items-center">
                <span className="text-pink-400 mr-2">✓</span>
                <span>JWT Authentication</span>
              </li>
            </ul>
          </div>
        </div>

        {/* --- Contributing CTA --- */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Join the Fun!
          </h2>
          <p className="text-gray-300 mb-8 max-w-lg mx-auto">
            This is an open-source project and we welcome contributions!
            Whether you're fixing bugs, adding features, or improving documentation,
            your help is appreciated.
          </p>
          <a
            href="https://github.com/MLSAKIIT/Memeder"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center text-white font-semibold bg-gradient-to-r from-pink-500 to-orange-400 hover:from-pink-600 hover:to-orange-500 rounded-full py-3 px-8 text-lg transition-all duration-300 shadow-lg"
          >
            View on GitHub &nbsp; →
          </a>
        </div>

      </div>
    </div>
  );
}