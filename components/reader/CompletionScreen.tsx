'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Sparkles, TrendingDown, Target, TrendingUp, ArrowRight } from 'lucide-react'
import confetti from 'canvas-confetti'
import { trackEvent } from '@/lib/analytics'
import { cn } from '@/lib/utils'

interface CompletionScreenProps {
  storyId: string
  storyTitle: string
  readingTimeMinutes: number
  recommendations: Array<{
    id: string
    slug: string
    title: string
    genre: string
    readingLevel: string
    estimatedReadMinutes: number
  }>
}

type DifficultyFeedback = 'too-easy' | 'just-right' | 'too-hard' | null

export function CompletionScreen({
  storyId,
  storyTitle,
  readingTimeMinutes,
  recommendations,
}: CompletionScreenProps) {
  const router = useRouter()
  const [feedback, setFeedback] = useState<DifficultyFeedback>(null)
  const [isVisible, setIsVisible] = useState(false)

  // Fade in and trigger confetti
  useEffect(() => {
    setIsVisible(true)
    
    // Gentle confetti animation
    const duration = 2000
    const end = Date.now() + duration

    const frame = () => {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.6 },
        colors: ['#135C5E', '#F59E0B', '#EC4899'],
      })
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.6 },
        colors: ['#135C5E', '#F59E0B', '#EC4899'],
      })

      if (Date.now() < end) {
        requestAnimationFrame(frame)
      }
    }

    frame()
  }, [])

  const handleFeedback = (type: DifficultyFeedback) => {
    setFeedback(type)
    
    // Track feedback
    trackEvent('story_difficulty_feedback', {
      storyId,
      storyTitle,
      feedback: type,
      readingTimeMinutes,
    })
  }

  const handleReadStory = (slug: string) => {
    router.push(`/story/${slug}`)
  }

  return (
    <div
      className={cn(
        'mt-12 p-8 rounded-2xl transition-all duration-500',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      )}
      style={{
        backgroundColor: 'var(--theme-bg)',
        border: '2px solid var(--theme-border)',
      }}
    >
      {/* Completion Header */}
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">🎉</div>
        <h3
          className="text-2xl md:text-3xl font-bold mb-2"
          style={{ color: 'var(--theme-text)' }}
        >
          Story Complete!
        </h3>
        <p style={{ color: 'var(--theme-muted)' }}>
          You finished <span className="font-semibold">"{storyTitle}"</span> in{' '}
          <span className="font-semibold">{readingTimeMinutes} minutes</span>
        </p>
      </div>

      {/* Difficulty Feedback */}
      <div className="mb-8">
        <p
          className="text-center mb-4 font-medium"
          style={{ color: 'var(--theme-text)' }}
        >
          How was this story for your reader?
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Button
            variant={feedback === 'too-hard' ? 'default' : 'outline'}
            onClick={() => handleFeedback('too-hard')}
            className={cn(
              'gap-2',
              feedback === 'too-hard' && 'bg-teal text-white hover:bg-teal/90'
            )}
          >
            <TrendingDown className="h-4 w-4" />
            Too Hard
          </Button>
          <Button
            variant={feedback === 'just-right' ? 'default' : 'outline'}
            onClick={() => handleFeedback('just-right')}
            className={cn(
              'gap-2',
              feedback === 'just-right' && 'bg-teal text-white hover:bg-teal/90'
            )}
          >
            <Target className="h-4 w-4" />
            Just Right
          </Button>
          <Button
            variant={feedback === 'too-easy' ? 'default' : 'outline'}
            onClick={() => handleFeedback('too-easy')}
            className={cn(
              'gap-2',
              feedback === 'too-easy' && 'bg-teal text-white hover:bg-teal/90'
            )}
          >
            <TrendingUp className="h-4 w-4" />
            Too Easy
          </Button>
        </div>
        {feedback && (
          <p
            className="text-center mt-3 text-sm"
            style={{ color: 'var(--theme-muted)' }}
          >
            Thanks for the feedback! We'll use this to recommend better stories.
          </p>
        )}
      </div>

      {/* Recommendations */}
      <div className="border-t pt-6" style={{ borderColor: 'var(--theme-border)' }}>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-teal" />
          <h4
            className="text-lg font-semibold"
            style={{ color: 'var(--theme-text)' }}
          >
            Read Another Story
          </h4>
        </div>
        <div className="space-y-3">
          {recommendations.slice(0, 3).map((rec) => (
            <button
              key={rec.id}
              onClick={() => handleReadStory(rec.slug)}
              className="w-full text-left p-4 rounded-lg transition-all hover:shadow-md group"
              style={{
                border: '1px solid var(--theme-border)',
                backgroundColor: 'var(--theme-bg)',
              }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h5
                    className="font-semibold mb-1 group-hover:text-teal transition-colors"
                    style={{ color: 'var(--theme-text)' }}
                  >
                    {rec.title}
                  </h5>
                  <div className="flex flex-wrap gap-2 mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {rec.genre}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {rec.readingLevel}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {rec.estimatedReadMinutes} min
                    </Badge>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-teal flex-shrink-0 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Back to Library */}
      <div className="mt-6 text-center">
        <Button
          onClick={() => router.push('/library')}
          variant="ghost"
          className="w-full sm:w-auto"
        >
          Back to Library
        </Button>
      </div>
    </div>
  )
}
