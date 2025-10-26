import { cn } from "../lib/utils"

export function Button({ className, variant = "default", size = "default", children, ...props }) {
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:scale-105 active:scale-95"

  const variants = {
    default: "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl",
    outline: "border-2 border-gray-600 bg-transparent hover:bg-gray-800 text-gray-100",
    ghost: "hover:bg-gray-800 text-gray-100",
    destructive: "bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl",
    secondary: "bg-gray-700 hover:bg-gray-600 text-gray-100"
  }

  const sizes = {
    default: "h-10 px-4 py-2 text-sm",
    sm: "h-8 px-3 text-xs",
    lg: "h-12 px-8 text-base",
    xl: "h-14 px-10 text-lg"
  }

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  )
}
