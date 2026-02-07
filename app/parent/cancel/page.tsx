'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Heart, AlertCircle, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { getRetentionMetricsAction, cancelSubscriptionAction, getSubscriptionStatusAction } from '@/app/actions/retention'
import { useAuth } from '@/lib/supabase'

interface RetentionMetrics {
  totalStoriesRead: number
  totalMinutesRead: number
  readingStreak: number
  childrenCount: number
  mostRecentRead: { title: string; completedAt: string | null } | null
}

const CancelReasons = [
  'Too expensive',
  'Not enough stories',
  'Child lost interest',
  'Found alternative',
  'Technical issues',
  'Other',
]

type Step = 'value-reminder' | 'pause-option' | 'confirm'

export default function CancelSubscriptionPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [step, setStep] = useState<Step>('value-reminder')
  const [metrics, setMetrics] = useState<RetentionMetrics | null>(null)
  const [subscriptionStatus, setSubscriptionStatus] = useState<any>(null)
  const [selectedReasons, setSelectedReasons] = useState<string[]>([])
  const [otherReason, setOtherReason] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [cancelled, setCancelled] = useState(false)

  useEffect(() => {
    if (!user?.id) {
      router.push('/auth/login')
      return
    }

    const loadData = async () => {
      try {
        const [metricsData, subStatus] = await Promise.all([
          getRetentionMetrics(user.id),
          getSubscriptionStatus(user.id),
        ])
        setMetrics(metricsData)
        setSubscriptionStatus(subStatus)
      } catch (err) {
        console.error('Error loading data:', err)
        setError('Failed to load subscription information')
      }
    }

    loadData()
  }, [user?.id, router])

  const handleReasonToggle = (reason: string) => {
    setSelectedReasons((prev) =>
      prev.includes(reason) ? prev.filter((r) => r !== reason) : [...prev, reason]
    )
  }

  const handlePauseInstead = () => {
    router.push('/parent/pause')
  }

  const handleContinueCancel = async () => {
    if (selectedReasons.length === 0 && !otherReason) {
      setError('Please select at least one reason or provide feedback')
      return
    }

    setStep('confirm')
  }

  const handleConfirmCancel = async () => {
    if (!user?.id || !subscriptionStatus) {
      setError('Unable to process cancellation')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const result = await cancelSubscription(
        user.id,
        selectedReasons,
        otherReason || undefined
      )

      if (result.success) {
        setCancelled(true)
        // Redirect to confirmation page after a brief delay
        setTimeout(() => {
          router.push(
            `/parent/cancel-confirmation?endDate=${result.endDate?.toISOString()}`
          )
        }, 2000)
      } else {
        setError(result.error || 'Failed to cancel subscription')
      }
    } catch (err) {
      console.error('Cancellation error:', err)
      setError('An error occurred while processing your cancellation')
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeepSubscription = () => {
    router.back()
  }

  if (!metrics || !subscriptionStatus) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal/5 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal mx-auto mb-4"></div>
          <p className="text-charcoal/70">Loading your subscription information...</p>
        </div>
      </div>
    )
  }

  if (cancelled) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal/5 to-white flex items-center justify-center p-4">
        <Card className="max-w-lg w-full border-teal/20">
          <CardContent className="pt-12 pb-8 text-center">
            <CheckCircle2 className="h-16 w-16 text-teal mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-charcoal mb-2">
              Subscription Cancelled
            </h2>
            <p className="text-charcoal/70 mb-4">
              Redirecting you to confirmation details...
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal/5 to-white py-8 px-4">
      <div className="container max-w-2xl">
        {/* Step 1: Value Reminder & Pause Option */}
        {step === 'value-reminder' && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Heart className="h-12 w-12 text-teal mx-auto mb-2" />
              <h1 className="text-3xl font-bold text-charcoal mb-2">
                We're Sorry to See You Go
              </h1>
              <p className="text-charcoal/70">
                Before you leave, we'd love to share what {metrics.childrenCount === 1 ? 'your child has' : 'your children have'} loved about Wholesome Library
              </p>
            </div>

            {/* Value Reminder Card */}
            <Card className="border-teal/20 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">
                  {metrics.childrenCount === 1
                    ? "Your Child's Reading Journey"
                    : "Your Family's Reading Journey"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-teal/5 rounded-lg">
                    <div className="text-2xl font-bold text-teal">
                      {metrics.totalStoriesRead}
                    </div>
                    <p className="text-sm text-charcoal/70">Stories Read</p>
                  </div>
                  <div className="p-3 bg-teal/5 rounded-lg">
                    <div className="text-2xl font-bold text-teal">
                      {Math.round(metrics.totalMinutesRead / 60)}
                    </div>
                    <p className="text-sm text-charcoal/70">Hours Reading</p>
                  </div>
                  {metrics.readingStreak > 0 && (
                    <div className="p-3 bg-teal/5 rounded-lg">
                      <div className="text-2xl font-bold text-teal">
                        {metrics.readingStreak}
                      </div>
                      <p className="text-sm text-charcoal/70">Day Reading Streak</p>
                    </div>
                  )}
                  {metrics.mostRecentRead && (
                    <div className="p-3 bg-teal/5 rounded-lg">
                      <div className="text-sm font-medium text-charcoal truncate">
                        {metrics.mostRecentRead.title}
                      </div>
                      <p className="text-xs text-charcoal/70">Last Story Read</p>
                    </div>
                  )}
                </div>

                <p className="text-sm text-charcoal/70 pt-2">
                  That's an amazing journey! {metrics.childrenCount === 1 ? 'Your child has' : 'Your children have'} discovered {metrics.totalStoriesRead} wholesome stories and spent {metrics.totalMinutesRead} minutes reading — all in a safe environment where every story is curated with love.
                </p>
              </CardContent>
            </Card>

            {/* Pause Instead Option */}
            <Card className="border-teal/20 bg-gradient-to-r from-teal/5 to-transparent">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-teal" />
                  Take a Break Instead?
                </CardTitle>
                <CardDescription>
                  You don't have to cancel. Pause your subscription for 1 month and we'll keep everything safe.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-charcoal/70 mb-4">
                  Your {metrics.childrenCount === 1 ? "child's" : "children's"} reading progress will be waiting when you return. We're also adding new stories every week!
                </p>
                <Button
                  onClick={handlePauseInstead}
                  variant="outline"
                  className="w-full border-teal text-teal hover:bg-teal/5"
                >
                  Pause for 1 Month Instead
                </Button>
              </CardContent>
            </Card>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={() => setStep('pause-option')}
                className="flex-1 bg-teal hover:bg-teal/90 text-white"
              >
                I Still Want to Cancel
              </Button>
              <Button
                onClick={handleKeepSubscription}
                variant="outline"
                className="flex-1"
              >
                Keep My Subscription
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Reason Survey */}
        {step === 'pause-option' && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-charcoal mb-2">
                Help Us Understand
              </h1>
              <p className="text-charcoal/70">
                Your feedback helps us improve Wholesome Library for all families
              </p>
            </div>

            <Card className="border-teal/20">
              <CardHeader>
                <CardTitle>What's prompting your cancellation?</CardTitle>
                <CardDescription>
                  Select all that apply (we promise to read every response)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {CancelReasons.map((reason) => (
                  <div key={reason} className="flex items-center space-x-3">
                    <Checkbox
                      id={reason}
                      checked={selectedReasons.includes(reason)}
                      onCheckedChange={() => handleReasonToggle(reason)}
                      className="border-charcoal/30"
                    />
                    <Label
                      htmlFor={reason}
                      className="text-charcoal cursor-pointer flex-1"
                    >
                      {reason}
                    </Label>
                  </div>
                ))}

                {selectedReasons.includes('Other') && (
                  <div className="mt-4 pt-4 border-t border-charcoal/10">
                    <Label htmlFor="otherReason" className="block mb-2">
                      Please tell us more
                    </Label>
                    <Textarea
                      id="otherReason"
                      placeholder="Your feedback matters..."
                      value={otherReason}
                      onChange={(e) => setOtherReason(e.target.value)}
                      className="resize-none"
                      rows={4}
                    />
                  </div>
                )}

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                    {error}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={handleContinueCancel}
                disabled={selectedReasons.length === 0 && !otherReason}
                className="flex-1 bg-teal hover:bg-teal/90 text-white disabled:opacity-50"
              >
                Continue to Confirmation
              </Button>
              <Button
                onClick={() => setStep('value-reminder')}
                variant="outline"
                className="flex-1"
              >
                Back
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Confirmation */}
        {step === 'confirm' && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <AlertCircle className="h-12 w-12 text-charcoal/30 mx-auto mb-2" />
              <h1 className="text-3xl font-bold text-charcoal mb-2">
                Are You Sure?
              </h1>
              <p className="text-charcoal/70">
                Your access continues until{' '}
                <span className="font-semibold">
                  {subscriptionStatus.currentPeriodEnd?.toLocaleDateString()}
                </span>
              </p>
            </div>

            <Card className="border-teal/20 bg-teal/5">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-charcoal mb-3">
                  What happens next:
                </h3>
                <ul className="space-y-2 text-sm text-charcoal/70">
                  <li className="flex gap-2">
                    <span className="text-teal">✓</span>
                    Your access continues until{' '}
                    {subscriptionStatus.currentPeriodEnd?.toLocaleDateString()}
                  </li>
                  <li className="flex gap-2">
                    <span className="text-teal">✓</span>
                    You won't be charged after that date
                  </li>
                  <li className="flex gap-2">
                    <span className="text-teal">✓</span>
                    Reading progress is always saved
                  </li>
                  <li className="flex gap-2">
                    <span className="text-teal">✓</span>
                    You can resubscribe anytime
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleConfirmCancel}
                disabled={isLoading}
                className="w-full bg-teal hover:bg-teal/90 text-white disabled:opacity-50"
              >
                {isLoading ? 'Processing...' : 'Confirm Cancellation'}
              </Button>
              <Button
                onClick={handleKeepSubscription}
                disabled={isLoading}
                className="w-full bg-teal hover:bg-teal/90 text-white"
                size="lg"
              >
                Keep My Subscription
              </Button>
              <button
                onClick={() => setStep('pause-option')}
                disabled={isLoading}
                className="w-full text-charcoal/70 hover:text-charcoal text-sm underline py-2"
              >
                Back to Reasons
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
