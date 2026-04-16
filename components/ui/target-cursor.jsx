"use client"

import React, { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

const TargetCursor = React.forwardRef(({ 
  className,
  spinDuration = 2,
  hideDefaultCursor = false,
  size = 40,
  color = "#3b82f6",
  trailColor = "#60a5fa",
  trailLength = 8,
  ...props 
}, ref) => {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)
  const [trail, setTrail] = useState([])

  useEffect(() => {
    const updatePosition = (e) => {
      setPosition({ x: e.clientX, y: e.clientY })
      setIsVisible(true)
      
      // Add to trail
      setTrail(prev => {
        const newTrail = [{ x: e.clientX, y: e.clientY, id: Date.now() }, ...prev]
        return newTrail.slice(0, trailLength)
      })
    }

    const handleMouseLeave = () => {
      setIsVisible(false)
    }

    const handleMouseEnter = () => {
      setIsVisible(true)
    }

    document.addEventListener('mousemove', updatePosition)
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mouseenter', handleMouseEnter)

    return () => {
      document.removeEventListener('mousemove', updatePosition)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mouseenter', handleMouseEnter)
    }
  }, [trailLength])

  if (hideDefaultCursor) {
    useEffect(() => {
      document.body.style.cursor = 'none'
      return () => {
        document.body.style.cursor = 'auto'
      }
    }, [])
  }

  return (
    <>
      {/* Trail */}
      {trail.map((point, index) => (
        <div
          key={point.id}
          className="fixed pointer-events-none z-50 transition-opacity duration-100"
          style={{
            left: point.x - size / 2,
            top: point.y - size / 2,
            width: size - (index * 3),
            height: size - (index * 3),
            borderRadius: '50%',
            backgroundColor: trailColor,
            opacity: (trailLength - index) / trailLength * 0.6,
            transform: 'translate(-50%, -50%)',
            transition: 'all 0.1s ease-out'
          }}
        />
      ))}
      
      {/* Main cursor */}
      {isVisible && (
        <div
          ref={ref}
          className={cn(
            "fixed pointer-events-none z-50 transition-all duration-75",
            className
          )}
          style={{
            left: position.x,
            top: position.y,
            transform: 'translate(-50%, -50%)',
            width: size,
            height: size,
            borderRadius: '50%',
            backgroundColor: color,
            boxShadow: `0 0 20px ${color}40`,
            animation: `spin ${spinDuration}s linear infinite`
          }}
          {...props}
        >
          {/* Inner ring */}
          <div
            className="absolute inset-2 rounded-full border-2 border-white"
            style={{
              animation: `spin ${spinDuration * 0.5}s linear infinite reverse`
            }}
          />
          
          {/* Center dot */}
          <div
            className="absolute top-1/2 left-1/2 w-2 h-2 bg-white rounded-full"
            style={{
              transform: 'translate(-50%, -50%)',
              animation: `pulse 1s ease-in-out infinite`
            }}
          />
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.7; transform: translate(-50%, -50%) scale(1.2); }
        }
      `}</style>
    </>
  )
})

TargetCursor.displayName = "TargetCursor"

export { TargetCursor }
