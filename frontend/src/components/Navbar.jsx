import React from "react"
import { motion } from "framer-motion"
import { Link, useLocation } from "react-router-dom"
import {
  Home,
  User,
  Heart,
  HeartOff,
  Info,
  LogIn,
  UserPlus,
  LogOut,
} from "lucide-react"
import { cn } from "../lib/utils"
import { useAuth } from "../contexts/AuthContext"

// Sub-component for cleaner mapping
const NavItem = ({ item, isActive }) => {
  const Icon = item.icon
  return (
    <Link
      to={item.url}
      className={cn(
        "relative cursor-pointer text-sm font-semibold px-4 py-2 rounded-full transition-colors",
        isActive ? "text-white" : "text-gray-300 hover:text-purple-300"
      )}
    >
      <span className="hidden md:inline">{item.name}</span>
      <span className="md:hidden">
        <Icon size={18} strokeWidth={2.5} />
      </span>

      {isActive && (
        <motion.div
          layoutId="active-pill"
          className="absolute inset-0 bg-purple-600 rounded-full -z-10"
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
          }}
        />
      )}
    </Link>
  )
}

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth()
  const location = useLocation()

  // Define navigation items
  const [leftItems, rightItems] = React.useMemo(() => {
    if (isAuthenticated) {
      const items = [
        { name: "Home", url: "/", icon: Home },
        { name: "Dashboard", url: "/dashboard", icon: User },
        { name: "Liked", url: "/liked", icon: Heart },
        { name: "Disliked", url: "/disliked", icon: HeartOff },
        { name: "About", url: "/about", icon: Info },
      ]
      const mid = Math.ceil(items.length / 2)
      return [items.slice(0, mid), items.slice(mid)]
    } else {
      const items = [
        { name: "Home", url: "/", icon: Home },
        { name: "About", url: "/about", icon: Info },
        { name: "Login", url: "/login", icon: LogIn },
        { name: "Signup", url: "/register", icon: UserPlus },
      ]
      const mid = Math.ceil(items.length / 2)
      return [items.slice(0, mid), items.slice(mid)]
    }
  }, [isAuthenticated])

  const allItems = [...leftItems, ...rightItems]
  const activeTab =
    allItems.find((item) => item.url === location.pathname)?.name ||
    allItems[0]?.name

  return (
    <div className="fixed top-0 left-0 right-0 z-50 pt-6 px-4">
      <div className="relative flex items-center justify-between max-w-7xl mx-auto">

        {/* Invisible placeholder for centering balance */}
        <div className="w-auto" aria-hidden="true">
          {isAuthenticated && (
            <div className="flex items-center space-x-3 opacity-0">
              <span className="hidden md:inline text-gray-300 font-medium text-sm">
                Welcome, {user?.username}
              </span>
              <div className="flex items-center justify-center h-10 w-10 md:w-auto md:px-4 md:py-2">
                <span className="hidden md:inline">Logout</span>
                <span className="md:hidden">
                  <LogOut size={18} strokeWidth={2.5} />
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Centered Navigation */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 md:mt-6">
          <div className="flex items-center gap-1 bg-gray-800/50 border border-gray-700 backdrop-blur-lg py-1 px-1 rounded-full shadow-lg">
            
            {/* Left Items */}
            {leftItems.map((item) => (
              <NavItem
                key={item.name}
                item={item}
                isActive={activeTab === item.name}
              />
            ))}

            {/* Center Logo (fixed alignment) */}
            <Link
              to="/"
              className="flex items-center justify-center gap-2 px-4 mx-3"
            >
              <div className="flex items-center justify-center text-center">
                <span className="text-2xl leading-none">🎭</span>
                <span className="hidden sm:inline text-xl font-bold text-white ml-1 leading-none group-hover:text-purple-400 transition-colors duration-200">
                  Memeder
                </span>
              </div>
            </Link>

            {/* Right Items */}
            {rightItems.map((item) => (
              <NavItem
                key={item.name}
                item={item}
                isActive={activeTab === item.name}
              />
            ))}
          </div>
        </div>

        {/* User Info (right side) */}
        {isAuthenticated && (
          <div className="flex items-center space-x-3">
            <span className="hidden md:inline text-gray-300 font-medium text-sm">
              Welcome, {user?.username}
            </span>
            <button
              onClick={logout}
              className="flex items-center justify-center h-10 w-10 md:w-auto md:px-4 md:py-2 text-sm font-medium text-gray-300 hover:text-purple-300 bg-gray-800/50 border border-gray-700 backdrop-blur-lg rounded-full transition-colors duration-200"
              aria-label="Logout"
            >
              <span className="hidden md:inline">Logout</span>
              <span className="md:hidden">
                <LogOut size={18} strokeWidth={2.5} />
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Navbar
