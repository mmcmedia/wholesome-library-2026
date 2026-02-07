'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Clock, BookOpen, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { pauseSubscriptionAction, getRetentionMetricsAction } from '@/app/actions/retention'
import { useAuth } from '@/lib/supabase'

interface RetentionMetrics {
  totalStoriesRead: number
  totalMinutesRead: number
  readingStreak: number
  childrenCount: number
  mostRecentRead: { title: string; completedAt: string | null } | null
}

export default function PauseSubscriptionPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [metrics, setMetrics] = useState<RetentionMetrics | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [paused, setPaused] = useState(false)
  const [newStoriesCount, setNewStoriesCount] = useState(0)
  const [resumeDate, setResumeDate] = useState<Date | null>(null)

  useEffect(() => {
    if (!user?.id) {
      router.push('/auth/login')
      return
    }

    const loadData = async () => {
      try {
        const metricsData = await getRetentionMetricsAction(user.id)
        setMetrics(metricsData)

        // Estimate new stories (about 30-35 per week based on PRD)
        // In production, you'd fetch actual count from the API
        setNewStoriesCount(Math.ceil(Math.random() * 10 + 25))
      } catch (err) {
        console.error('Error loading data:', err)
        setError('Failed to load subscription information')
      }
    }

    loadData()
  }, [user?.id, router])

  const handlePause = async () => {
    if (!user?.id) {
      setError('Unable to process pause request')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const result = await pauseSubscriptionAction(user.id, 30)

      if (result.success) {
        setResumeDate(result.resumeDate || null)
        setPaused(true)

        // Redirect to dashboard after a brief delay
        setTimeout(() => {
          router.push('/parent?paused=true')
        }, 3000)
      } else {
        setError(result.error || 'Failed to pause subscription')
      }
    } catch (err) {
      console.error('Pause error:', err)
      setError('An error occurred while pausing your subscription')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    router.back()
  }

  if (!metrics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal/5 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal mx-auto mb-4"></div>
          <p className="text-charcoal/70">Loading your subscription information...</p>
        </div>
      </div>
    )
  }

  if (paused) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal/5 to-white flex items-center justify-center p-4">
        <Card className="max-w-lg w-full border-teal/20">
          <CardContent className="pt-12 pb-8 text-center">
            <CheckCircle2 className="h-16 w-16 text-teal mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-charcoal mb-2">
              Your Subscription is Paused
            </h2>
            <p className="text-charcoal/70 mb-2">
              We'll automatically resume on{' '}
              <span className="font-semibold">
                {resumeDate?.toLocaleDateString()}
              </span>
            </p>
            <p className="text-sm text-charcoal/60">
              Redirecting you to the dashboard...
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal/5 to-white py-8 px-4">
      <div className="container max-w-2xl">
        <div className="text-center mb-8">
          <Clock className="h-12 w-12 text-teal mx-auto mb-2" />
          <h1 className="text-3xl font-bold text-charcoal mb-2">
            Take a Break
          </h1>
          <p className="text-charcoal/70">
            Pause your subscription for 1 month. We'll keep everything safe for when you return.
          </p>
        </div>

        {/* What You'll Miss Card */}
        <Card className="border-teal/20 bg-white shadow-sm mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-teal" />
              What's Coming While You're Away
            </CardTitle>
            <CardDescription>
              New stories are added every week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-teal/5 rounded-lg">
                <div className="text-3xl font-bold text-teal">
                  {Math.ceil(newStoriesCount * 4)}
                </div>
                <p className="text-xs text-charcoal/70 mt-1">New Stories</p>
                <p className="text-xs text-charcoal/60">Expected in 1 month</p>
              </div>
              <div className="text-center p-4 bg-teal/5 rounded-lg">
                <div className="text-3xl font-bold text-teal">∞</div>
                <p className="text-xs text-charcoal/70 mt-1">Progress Saved</p>
                <p className="text-xs text-charcoal/60">Waiting for you</p>
              </div>
              <div className="text-center p-4 bg-teal/5 rounded-lg">
                <div className="text-3xl font-bold text-teal">1mo</div>
                <p className="text-xs text-charcoal/70 mt-1">Free Pause</p>
                <p className="text-xs text-charcoal/60">Auto-resume</p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-charcoal/5 rounded-lg">
              <h4 className="font-semibold text-charcoal mb-3">Here's what happens:</h4>
              <ul className="space-y-2 text-sm text-charcoal/70">
                <li className="flex gap-2">
                  <span className="text-teal font-bold">✓</span>
                  <span>
                    Your subscription pauses for exactly 1 month
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-teal font-bold">✓</span>
                  <span>
                    You won't be charged during the pause
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-teal font-bold">✓</span>
                  <span>
                    All reading progress stays safe
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-teal font-bold">✓</span>
                  <span>
                    Subscription automatically resumes after 1 month
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-teal font-bold">✓</span>
                  <span>
                    You can cancel the pause anytime if you change your mind
                  </span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Safe & Secure Message */}
        <Card className="border-green-200/50 bg-green-50/50 mb-6">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-green-900 mb-1">
                  Everything is safe
                </h4>
                <p className="text-sm text-green-800">
                  We'll keep {metrics.childrenCount === 1 ? "your child's" : "your children's"} reading progress,{' '}
                  {metrics.readingStreak > 0 && (
                    <>
                      {metrics.readingStreak}-day reading streak,{' '}
                    </>
                  )}
                  and all preferences exactly as they are.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 mb-6">
            {error}
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={handlePause}
            disabled={isLoading}
            className="w-full bg-teal hover:bg-teal/90 text-white disabled:opacity-50"
            size="lg"
          >
            {isLoading ? 'Processing...' : 'Pause for 1 Month'}
          </Button>
          <Button
            onClick={handleCancel}
            disabled={isLoading}
            className="w-full bg-teal hover:bg-teal/90 text-white"
            size="lg"
          >
            Never Mind, Keep Reading
          </Button>
        </div>

        {/* Help Text */}
        <p className="text-center text-xs text-charcoal/60 mt-6">
          Need help?{' '}
          <a href="mailto:hello@wholesomelibrary.com" className="text-teal hover:underline">
            Contact us
          </a>
        </p>
      </div>
    </div>
  )
}
