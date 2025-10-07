import { Link } from 'react-router'
import { Button } from './Button'

export default function Navbar() {
  return (
    <nav className="border-b border-zinc-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl">🎭</span>
            <span className="text-xl font-semibold text-zinc-900">Memeder</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-zinc-600 hover:text-zinc-900 transition-colors">
              Home
            </Link>
            <Link to="/about" className="text-zinc-600 hover:text-zinc-900 transition-colors">
              About
            </Link>
            <Link to="/liked" className="text-zinc-600 hover:text-zinc-900 transition-colors">
              Liked
            </Link>
            <Link to="/disliked" className="text-zinc-600 hover:text-zinc-900 transition-colors">
              Disliked
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-3">
            <Button variant="ghost">
              <Link to="/login" className="text-zinc-600 hover:text-zinc-900 transition-colors">
                Log In
              </Link>
            </Button>
            <Button>
              <Link to="/register" >
                Sign Up
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
