'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { trackEvent } from '@/lib/analytics'
import { BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  // Track signup started on mount
  useEffect(() => {
    trackEvent('signup_started')
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // TODO: Implement Supabase signup
    // For now, just simulate signup
    setTimeout(() => {
      // Track successful signup
      trackEvent('signup_completed')
      
      // Redirect to onboarding flow
      router.push('/onboarding')
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal/10 to-white flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-teal/10 p-3 rounded-full">
              <BookOpen className="h-8 w-8 text-teal" />
            </div>
          </div>
          <CardTitle className="text-2xl">Start Your Free 7-Day Trial</CardTitle>
          <CardDescription>
            No credit card required • Cancel anytime
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Parent Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Your Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="parent@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="text-base"
                style={{ fontSize: '16px' }}
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Create Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="text-base"
                style={{ fontSize: '16px' }}
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-teal hover:bg-teal/90 text-white h-12 text-base sm:text-lg sm:h-auto sm:py-6"
              disabled={loading}
            >
              {loading ? 'Creating your account...' : 'Start Reading Free'}
            </Button>

            <p className="text-xs text-center text-charcoal/60">
              By signing up, you agree to our{' '}
              <Link href="/legal/terms" className="text-teal hover:underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/legal/privacy" className="text-teal hover:underline">
                Privacy Policy
              </Link>
            </p>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-charcoal/70">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-teal font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
