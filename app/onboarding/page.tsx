'use client'

import OnboardingWizard from '@/components/onboarding/onboarding-wizard'

export default function OnboardingPage() {
  // TODO: Get parent email from Supabase session
  const parentEmail = 'parent@example.com' // Placeholder
  
  return <OnboardingWizard parentEmail={parentEmail} />
}
