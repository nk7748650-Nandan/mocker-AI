"use client"

import React from 'react'
import { cn } from '@/lib/utils'

const ShinyText = React.forwardRef(({ 
  className, 
  children, 
  variant = "default",
  ...props 
}, ref) => {
  const variants = {
    default: "bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent animate-pulse",
    rainbow: "bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 via-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-pulse",
    gold: "bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent animate-pulse",
    silver: "bg-gradient-to-r from-gray-300 via-gray-400 to-gray-500 bg-clip-text text-transparent animate-pulse",
    neon: "text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)] animate-pulse",
    glow: "text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.5)] animate-pulse"
  }

  return (
    <span
      ref={ref}
      className={cn(
        "inline-block font-bold",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
})

ShinyText.displayName = "ShinyText"

export { ShinyText }
