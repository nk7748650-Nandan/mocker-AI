"use client"

import React, { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

const Shuffle = React.forwardRef(({ 
  className, 
  children, 
  text,
  duration = 1000,
  interval = 100,
  shuffleChars = "!@#$%^&*()_+-=[]{}|;':\",./<>?",
  shuffleDirection,
  animationMode,
  shuffleTimes,
  ease,
  stagger,
  threshold,
  triggerOnce,
  triggerOnHover,
  respectReducedMotion,
  loop = false,
  loopDelay = 2000,
  ...props 
}, ref) => {
  const [displayText, setDisplayText] = useState('')
  const [isAnimating, setIsAnimating] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  const originalText = text || (typeof children === 'string' ? children : children?.props?.children || '')

  useEffect(() => {
    if (!originalText) return

    setIsAnimating(true)
    setCurrentIndex(0)
    setDisplayText('')

    const totalDuration = duration * 1000 // Convert to milliseconds
    const steps = Math.ceil(totalDuration / interval)
    let currentStep = 0

    const shuffleInterval = setInterval(() => {
      if (currentStep < steps) {
        // Show shuffled characters
        const shuffledText = originalText
          .split('')
          .map((char, index) => {
            if (index < currentStep) {
              return char // Show actual character
            }
            return shuffleChars[Math.floor(Math.random() * shuffleChars.length)]
          })
          .join('')
        
        setDisplayText(shuffledText)
        currentStep++
      } else {
        // Show final text
        setDisplayText(originalText)
        setIsAnimating(false)
        clearInterval(shuffleInterval)
        
        // Start loop if enabled
        if (loop) {
          setTimeout(() => {
            setCurrentIndex(0)
            setDisplayText('')
            setIsAnimating(true)
            
            const loopSteps = Math.ceil(totalDuration / interval)
            let loopStep = 0
            
            const loopInterval = setInterval(() => {
              if (loopStep < loopSteps) {
                const shuffledText = originalText
                  .split('')
                  .map((char, index) => {
                    if (index < loopStep) {
                      return char
                    }
                    return shuffleChars[Math.floor(Math.random() * shuffleChars.length)]
                  })
                  .join('')
                
                setDisplayText(shuffledText)
                loopStep++
              } else {
                setDisplayText(originalText)
                setIsAnimating(false)
                clearInterval(loopInterval)
                
                // Continue the loop
                setTimeout(() => {
                  setCurrentIndex(0)
                  setDisplayText('')
                  setIsAnimating(true)
                  
                  const nextLoopSteps = Math.ceil(totalDuration / interval)
                  let nextLoopStep = 0
                  
                  const nextLoopInterval = setInterval(() => {
                    if (nextLoopStep < nextLoopSteps) {
                      const shuffledText = originalText
                        .split('')
                        .map((char, index) => {
                          if (index < nextLoopStep) {
                            return char
                          }
                          return shuffleChars[Math.floor(Math.random() * shuffleChars.length)]
                        })
                        .join('')
                      
                      setDisplayText(shuffledText)
                      nextLoopStep++
                    } else {
                      setDisplayText(originalText)
                      setIsAnimating(false)
                      clearInterval(nextLoopInterval)
                    }
                  }, interval)
                }, loopDelay)
              }
            }, interval)
          }, loopDelay)
        }
      }
    }, interval)

    return () => clearInterval(shuffleInterval)
  }, [originalText, duration, interval, shuffleChars, loop, loopDelay])

  const handleClick = () => {
    if (!isAnimating) {
      setCurrentIndex(0)
      setDisplayText('')
      setIsAnimating(true)

      const totalDuration = duration * 1000 // Convert to milliseconds
      const steps = Math.ceil(totalDuration / interval)
      let currentStep = 0

      const shuffleInterval = setInterval(() => {
        if (currentStep < steps) {
          const shuffledText = originalText
            .split('')
            .map((char, index) => {
              if (index < currentStep) {
                return char
              }
              return shuffleChars[Math.floor(Math.random() * shuffleChars.length)]
            })
            .join('')
          
          setDisplayText(shuffledText)
          currentStep++
        } else {
          setDisplayText(originalText)
          setIsAnimating(false)
          clearInterval(shuffleInterval)
        }
      }, interval)
    }
  }

  return (
    <span
      ref={ref}
      className={cn(
        "inline-block cursor-pointer select-none",
        className
      )}
      onClick={handleClick}
      {...props}
    >
      {displayText || originalText}
    </span>
  )
})

Shuffle.displayName = "Shuffle"

export { Shuffle }
