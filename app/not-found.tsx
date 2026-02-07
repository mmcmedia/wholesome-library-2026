'use client'

import Link from 'next/link'
import { BookOpen, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'

export default function NotFound() {
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mediaQuery.matches)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal/10 to-white flex items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        {/* Animated book icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <BookOpen 
              className="w-24 h-24 text-teal" 
              strokeWidth={1.5}
              style={reducedMotion ? {} : { animation: 'float 6s ease-in-out infinite' }}
            />
            <div 
              className="absolute -top-2 -right-2 text-6xl"
              style={reducedMotion ? {} : { animation: 'bounce-subtle 0.6s ease-in-out infinite' }}
            >
              📖
            </div>
          </div>
        </div>

        {/* 404 heading */}
        <h1 className="text-8xl md:text-9xl font-bold text-teal mb-6 leading-none">
          404
        </h1>

        {/* Main message */}
        <h2 className="text-3xl md:text-4xl font-bold text-charcoal mb-4">
          This story hasn't been written yet
        </h2>
        
        <p className="text-lg md:text-xl text-charcoal/70 mb-8 max-w-md mx-auto leading-relaxed">
          Looks like this page wandered off into an adventure of its own. 
          Let's get you back to somewhere familiar!
        </p>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/library">
            <Button 
              size="lg" 
              className="bg-teal hover:bg-teal/90 text-white rounded-full px-8 py-6 text-lg font-medium transition-all duration-300 hover:-translate-y-1 shadow-md hover:shadow-xl"
            >
              <BookOpen className="w-5 h-5 mr-2" />
              Browse Our Library
            </Button>
          </Link>
          
          <Link href="/">
            <Button 
              size="lg" 
              variant="outline"
              className="border-2 border-teal text-teal rounded-full px-8 py-6 text-lg font-medium transition-all duration-300 hover:-translate-y-1 hover:bg-teal/10"
            >
              <Home className="w-5 h-5 mr-2" />
              Go Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
