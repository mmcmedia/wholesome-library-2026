'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import OnboardingWizard from '@/components/onboarding/onboarding-wizard'
import { createClient } from '@/lib/supabase/client'

export default function OnboardingPage() {
  const [parentEmail, setParentEmail] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function checkAuth() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        // Not authenticated, redirect to signup
        router.push('/auth/signup')
        return
      }
      
      setParentEmail(user.email || '')
      setLoading(false)
    }
    
    checkAuth()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal mx-auto"></div>
          <p className="mt-4 text-charcoal/60">Loading...</p>
        </div>
      </div>
    )
  }
  
  return <OnboardingWizard parentEmail={parentEmail} />
}
