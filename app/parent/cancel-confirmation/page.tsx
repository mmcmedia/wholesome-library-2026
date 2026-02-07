'use client'

import React, { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle2, Undo2, BookOpen, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function CancellationConfirmationPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showResubscribeModal, setShowResubscribeModal] = useState(false)

  const endDate = searchParams.get('endDate')
    ? new Date(searchParams.get('endDate') as string).toLocaleDateString()
    : 'end of billing period'

  const handleResubscribe = () => {
    // Route to resubscription flow
    router.push('/auth/plans?from=resubscribe')
  }

  const handleDashboard = () => {
    router.push('/parent')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal/5 to-white py-8 px-4">
      <div className="container max-w-2xl">
        <div className="text-center mb-8">
          <CheckCircle2 className="h-16 w-16 text-teal mx-auto mb-4 animate-scale-in" />
          <h1 className="text-3xl md:text-4xl font-bold text-charcoal mb-2">
            Subscription Cancelled
          </h1>
          <p className="text-charcoal/70">
            We've got your request and your access is secured until {endDate}
          </p>
        </div>

        {/* Confirmation Details */}
        <Card className="border-teal/20 bg-white shadow-sm mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Confirmation Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-teal/5 rounded-lg">
              <div className="text-sm text-charcoal/70 mb-1">Access Continues Until</div>
              <div className="text-2xl font-bold text-teal">{endDate}</div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex gap-3">
                <CheckCircle2 className="h-5 w-5 text-teal flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-charcoal">Confirmation Email Sent</h4>
                  <p className="text-sm text-charcoal/70">
                    Check your inbox for cancellation details
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <CheckCircle2 className="h-5 w-5 text-teal flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-charcoal">Your Feedback Matters</h4>
                  <p className="text-sm text-charcoal/70">
                    We've saved your feedback and will use it to improve
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <CheckCircle2 className="h-5 w-5 text-teal flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-charcoal">Progress is Safe</h4>
                  <p className="text-sm text-charcoal/70">
                    All reading progress and preferences are saved
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* What Happens Next */}
        <Card className="border-charcoal/10 bg-charcoal/5 mb-6">
          <CardHeader>
            <CardTitle className="text-base">What Happens Now?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm text-charcoal/70">
                Until <strong>{endDate}</strong>, you'll have full access to all stories and features.
              </p>

              <div className="mt-4 p-4 bg-white rounded-lg border border-charcoal/10">
                <h4 className="font-semibold text-charcoal mb-2 text-sm">
                  After {endDate}:
                </h4>
                <ul className="space-y-2 text-sm text-charcoal/70">
                  <li className="flex gap-2">
                    <span className="text-charcoal">•</span>
                    <span>Access to the library will no longer be available</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-charcoal">•</span>
                    <span>You won't be charged again</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-charcoal">•</span>
                    <span>Your data remains safe for 12 months</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recommendations Based on Cancel Reason */}
        <Card className="border-amber-200/50 bg-amber-50/50 mb-6">
          <CardHeader>
            <CardTitle className="text-base">Things To Know</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-charcoal/70">
              <li className="flex gap-2">
                <span className="text-amber-700 font-bold">→</span>
                <span>
                  <strong>We're always improving.</strong> We release new stories and features regularly. Consider resubscribing in a few months!
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-amber-700 font-bold">→</span>
                <span>
                  <strong>You can pause instead.</strong> If you just need a break, you can pause your subscription anytime without cancelling completely.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-amber-700 font-bold">→</span>
                <span>
                  <strong>Your family is welcome back.</strong> Resubscribe anytime and everything will be waiting for you.
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Win-Back Offer */}
        <Card className="border-teal/20 bg-gradient-to-r from-teal/10 to-transparent mb-6">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <BookOpen className="h-6 w-6 text-teal flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-charcoal mb-1">
                  We'll Keep You in Mind
                </h4>
                <p className="text-sm text-charcoal/70 mb-3">
                  In 30 days, we'll send you a special offer with new stories and content updates. No pressure—just letting you know what you'll have missed!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={handleDashboard}
            className="w-full bg-teal hover:bg-teal/90 text-white"
            size="lg"
          >
            Go to Dashboard
          </Button>

          <button
            onClick={handleResubscribe}
            className="w-full px-4 py-2 text-teal hover:text-teal/80 font-medium underline"
          >
            <span className="flex items-center justify-center gap-2">
              <Undo2 className="h-4 w-4" />
              Change Your Mind? Resubscribe Now
            </span>
          </button>

          <a
            href="mailto:hello@wholesomelibrary.com"
            className="w-full px-4 py-2 bg-charcoal/5 hover:bg-charcoal/10 text-charcoal rounded-lg border border-charcoal/10 font-medium text-center flex items-center justify-center gap-2 transition-colors"
          >
            <Mail className="h-4 w-4" />
            Have Questions? Email Us
          </a>
        </div>

        {/* Footer Message */}
        <p className="text-center text-xs text-charcoal/60 mt-8">
          Thank you for being part of the Wholesome Library family. We hope to see you again soon! 💚
        </p>
      </div>

      <style jsx>{`
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scale-in {
          animation: scale-in 0.5s ease-out;
        }
      `}</style>
    </div>
  )
}
