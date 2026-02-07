'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { BookOpen, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // TODO: Implement Supabase login
    setTimeout(() => {
      router.push('/library')
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal/10 to-white flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md shadow-xl animate-scale-in">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-teal/10 p-3 rounded-full">
              <BookOpen className="h-8 w-8 text-teal" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <CardDescription>
            Sign in to continue reading
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="parent@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="focus:ring-2 focus:ring-teal focus:border-teal transition-all duration-200 text-base"
                style={{ fontSize: '16px' }}
                required
                autoComplete="email"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-teal hover:underline transition-all duration-200"
                >
                  Forgot?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="focus:ring-2 focus:ring-teal focus:border-teal transition-all duration-200 text-base"
                style={{ fontSize: '16px' }}
                required
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm animate-shake">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-teal hover:bg-teal/90 text-white h-12 text-base sm:text-lg sm:h-auto sm:py-6 font-medium rounded-full transition-all duration-300 hover:-translate-y-1 shadow-md hover:shadow-xl"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-charcoal/70">
              Don't have an account?{' '}
              <Link href="/auth/signup" className="text-teal font-medium hover:underline transition-all duration-200">
                Start your free trial
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
