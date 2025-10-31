import { Link } from 'react-router'
import { Button } from './Button'
import { useAuth } from '../contexts/AuthContext'

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <nav className="border-b border-zinc-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl">🎭</span>
            <span className="text-xl font-semibold text-zinc-900">Memeder</span>
          </Link>

          {/* Navigation Links - only show when authenticated */}
          {isAuthenticated && (
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
              <Link to="/add" className="text-zinc-600 hover:text-zinc-900 transition-colors">
                Add Meme
              </Link>
              <Link to="/profile" className="text-zinc-600 hover:text-zinc-900 transition-colors">
                Profile
              </Link>
            </div>
          )}

          {/* Auth Buttons */}
          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-zinc-600">
                  Welcome, {user?.name || user?.username || 'User'}
                </span>
                <Button variant="ghost" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
