'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { BookOpen, ChevronLeft, Sparkles } from 'lucide-react'
import ReadingLevelPicker, { type ReadingLevel } from './reading-level-picker'
import InterestPicker, { type Interest } from './interest-picker'
import { trackEvent } from '@/lib/analytics'
import { trpc } from '@/lib/trpc/client'

interface OnboardingData {
  parentName: string
  childName: string
  childAge: string
  readingLevel: ReadingLevel | null
  interests: Interest[]
}

const AGE_GROUPS = [
  { value: '4-5', label: '4-5 years' },
  { value: '6-7', label: '6-7 years' },
  { value: '8-9', label: '8-9 years' },
  { value: '10-12', label: '10-12 years' },
]

export default function OnboardingWizard({ parentEmail }: { parentEmail?: string }) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [data, setData] = useState<OnboardingData>({
    parentName: '',
    childName: '',
    childAge: '',
    readingLevel: null,
    interests: [],
  })

  const totalSteps = 4
  const progress = (step / totalSteps) * 100

  const handleNext = () => {
    trackEvent('onboarding_step_completed', { step })
    setStep(step + 1)
  }

  const handleBack = () => {
    setStep(step - 1)
  }

  const handleComplete = async () => {
    try {
      // TODO: Save child profile using tRPC when mutations are set up
      // For now, just track completion and redirect
      
      trackEvent('onboarding_completed', {
        readingLevel: data.readingLevel || undefined,
        interests: data.interests,
        childAge: data.childAge || undefined,
      })
      
      // Redirect to library with recommendations
      router.push('/library?onboarding=complete')
    } catch (error) {
      console.error('Failed to complete onboarding:', error)
      // Still redirect but show error - TODO: add toast notification
      router.push('/library?onboarding=complete')
    }
  }

  const canProceedStep1 = data.parentName.trim().length > 0
  const canProceedStep2 = data.childName.trim().length > 0 && data.childAge && data.readingLevel
  const canProceedStep3 = data.interests.length >= 3

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal/10 via-white to-teal/5 flex items-center justify-center px-4 py-8 sm:py-12">
      <Card className="w-full max-w-3xl shadow-xl">
        {/* Progress Bar */}
        <div className="px-4 sm:px-6 pt-4 sm:pt-6">
          <Progress value={progress} className="h-2" />
          <p className="text-xs sm:text-sm text-charcoal/60 mt-2 text-center">
            Step {step} of {totalSteps}
          </p>
        </div>

        <CardHeader className="text-center px-4 sm:px-6 pb-4">
          <div className="flex justify-center mb-3 sm:mb-4">
            <div className="bg-teal/10 p-2 sm:p-3 rounded-full">
              <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-teal" />
            </div>
          </div>
          
          {step === 1 && (
            <>
              <CardTitle className="text-xl sm:text-2xl md:text-3xl">Welcome! Let's set up your family library</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                This will only take a minute
              </CardDescription>
            </>
          )}
          
          {step === 2 && (
            <>
              <CardTitle className="text-xl sm:text-2xl md:text-3xl">Tell us about your child</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                We'll personalize stories just for them
              </CardDescription>
            </>
          )}
          
          {step === 3 && (
            <>
              <CardTitle className="text-xl sm:text-2xl md:text-3xl">What does {data.childName} love?</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Select their favorite topics and themes
              </CardDescription>
            </>
          )}
          
          {step === 4 && (
            <>
              <CardTitle className="text-xl sm:text-2xl md:text-3xl flex items-center justify-center gap-2">
                <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-teal animate-pulse" />
                Your library is ready!
              </CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Based on {data.childName}'s interests, here are stories they'll love
              </CardDescription>
            </>
          )}
        </CardHeader>

        <CardContent className="px-4 sm:px-6 pb-6 sm:pb-8">
          {/* Step 1: Parent Info */}
          {step === 1 && (
            <div className="space-y-4 sm:space-y-6 animate-fade-in">
              <div className="space-y-2">
                <Label htmlFor="parentName" className="text-sm sm:text-base">Your Name</Label>
                <Input
                  id="parentName"
                  type="text"
                  placeholder="e.g., Sarah"
                  value={data.parentName}
                  onChange={(e) => setData({ ...data, parentName: e.target.value })}
                  className="text-base sm:text-lg py-5 sm:py-6"
                  autoFocus
                />
              </div>
              
              {parentEmail && (
                <div className="text-sm text-charcoal/60 bg-teal/5 p-3 sm:p-4 rounded-lg">
                  <span className="font-medium">Email:</span> {parentEmail}
                </div>
              )}
            </div>
          )}

          {/* Step 2: Child Info + Reading Level */}
          {step === 2 && (
            <div className="space-y-4 sm:space-y-6 animate-fade-in">
              <div className="space-y-2">
                <Label htmlFor="childName" className="text-sm sm:text-base">Child's First Name</Label>
                <Input
                  id="childName"
                  type="text"
                  placeholder="e.g., Emma"
                  value={data.childName}
                  onChange={(e) => setData({ ...data, childName: e.target.value })}
                  className="text-base sm:text-lg py-5 sm:py-6"
                  autoFocus
                />
                <p className="text-xs sm:text-sm text-charcoal/60">
                  You can add more children later from your parent dashboard
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm sm:text-base">Age Group</Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                  {AGE_GROUPS.map((age) => (
                    <Button
                      key={age.value}
                      type="button"
                      variant={data.childAge === age.value ? 'default' : 'outline'}
                      className={`text-sm sm:text-base h-10 sm:h-12 ${
                        data.childAge === age.value
                          ? 'bg-teal hover:bg-teal/90 text-white'
                          : 'hover:border-teal/50'
                      }`}
                      onClick={() => setData({ ...data, childAge: age.value })}
                    >
                      {age.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <Label className="text-sm sm:text-base">Reading Level</Label>
                <ReadingLevelPicker
                  selected={data.readingLevel}
                  onSelect={(level) => setData({ ...data, readingLevel: level })}
                />
              </div>
            </div>
          )}

          {/* Step 3: Interests */}
          {step === 3 && (
            <div className="space-y-4 sm:space-y-6 animate-fade-in">
              <InterestPicker
                selected={data.interests}
                onToggle={(interest) => {
                  const newInterests = data.interests.includes(interest)
                    ? data.interests.filter((i) => i !== interest)
                    : [...data.interests, interest]
                  setData({ ...data, interests: newInterests })
                }}
                minRequired={3}
              />
            </div>
          )}

          {/* Step 4: Completion */}
          {step === 4 && (
            <div className="space-y-4 sm:space-y-6 animate-fade-in">
              <div className="bg-gradient-to-r from-teal/10 to-teal/5 p-4 sm:p-6 rounded-lg border border-teal/20">
                <h3 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4 text-teal">
                  📚 Recommended Stories
                </h3>
                <div className="space-y-2 sm:space-y-3">
                  <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200 hover:border-teal/50 transition-colors cursor-pointer">
                    <p className="font-medium text-sm sm:text-base text-charcoal">The Brave Little Explorer</p>
                    <p className="text-xs sm:text-sm text-charcoal/60 mt-1">
                      An adventure story perfect for {data.childName}
                    </p>
                  </div>
                  <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200 hover:border-teal/50 transition-colors cursor-pointer">
                    <p className="font-medium text-sm sm:text-base text-charcoal">Friends in the Forest</p>
                    <p className="text-xs sm:text-sm text-charcoal/60 mt-1">
                      A heartwarming tale of friendship and animals
                    </p>
                  </div>
                  <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200 hover:border-teal/50 transition-colors cursor-pointer">
                    <p className="font-medium text-sm sm:text-base text-charcoal">Mystery at Moonlight Lake</p>
                    <p className="text-xs sm:text-sm text-charcoal/60 mt-1">
                      A thrilling mystery adventure in nature
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-3 mt-6 sm:mt-8">
            {step > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                className="flex items-center gap-2 h-11 sm:h-12 px-4 sm:px-6 text-sm sm:text-base"
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </Button>
            )}
            
            <Button
              type="button"
              onClick={step === totalSteps ? handleComplete : handleNext}
              disabled={
                (step === 1 && !canProceedStep1) ||
                (step === 2 && !canProceedStep2) ||
                (step === 3 && !canProceedStep3)
              }
              className="flex-1 bg-teal hover:bg-teal/90 text-white h-11 sm:h-12 text-sm sm:text-base font-medium"
            >
              {step === totalSteps ? '🎉 Start Reading!' : 'Continue'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
