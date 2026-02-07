'use client'

import React, { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle2, Undo2, BookOpen, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function CancellationContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showResubscribeModal, setShowResubscribeModal] = useState(false)

  const endDate = searchParams.get('endDate')
    ? new Date(searchParams.get('endDate') as string).toLocaleDateString()
    : 'immediately'
  const feedbackSubmitted = searchParams.get('feedback') === 'true'

  const handleResubscribe = () => {
    router.push('/subscription')
  }

  const handleGoHome = () => {
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal/5 to-white">
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <Card className="shadow-lg">
          <CardHeader className="text-center pb-8">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <CardTitle className="text-2xl md:text-3xl font-bold text-charcoal mb-2">
              Subscription Cancelled
            </CardTitle>
            <CardDescription className="text-base">
              Your subscription will end on <strong>{endDate}</strong>
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* What Happens Next */}
            <div className="bg-teal/5 border border-teal/20 rounded-lg p-6">
              <h3 className="font-semibold text-charcoal mb-3 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-teal" />
                What Happens Next
              </h3>
              <ul className="space-y-2 text-sm text-charcoal/70">
                <li>• You'll have full access to all stories until {endDate}</li>
                <li>• Reading progress and preferences will be saved</li>
                <li>• You can reactivate anytime with no loss of data</li>
                <li>• No further charges will be made</li>
              </ul>
            </div>

            {feedbackSubmitted && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  <Mail className="inline h-4 w-4 mr-2" />
                  Thank you for your feedback! We're constantly working to improve Wholesome Library.
                </p>
              </div>
            )}

            {/* Changed Your Mind? */}
            <div className="bg-gradient-to-br from-purple/5 to-teal/5 border border-teal/20 rounded-lg p-6">
              <h3 className="font-semibold text-charcoal mb-3 flex items-center gap-2">
                <Undo2 className="h-5 w-5 text-purple" />
                Changed Your Mind?
              </h3>
              <p className="text-sm text-charcoal/70 mb-4">
                You can reactivate your subscription at any time. Your saved stories and reading progress will still be here!
              </p>
              <Button 
                onClick={handleResubscribe}
                className="w-full bg-teal hover:bg-teal/90"
              >
                Reactivate Subscription
              </Button>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button 
                onClick={handleGoHome}
                variant="outline"
                className="flex-1"
              >
                Return Home
              </Button>
            </div>

            {/* Support Message */}
            <p className="text-xs text-charcoal/50 text-center">
              Have questions? Contact us at{' '}
              <a href="mailto:support@wholesomelibrary.com" className="text-teal hover:underline">
                support@wholesomelibrary.com
              </a>
            </p>
          </CardContent>
        </Card>

        {/* Feedback Thank You (if provided) */}
        {feedbackSubmitted && (
          <div className="mt-8 text-center">
            <p className="text-sm text-charcoal/60">
              We appreciate you taking the time to share your thoughts. Your feedback helps us create better stories for families.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
