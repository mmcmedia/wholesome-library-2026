'use client'

import React from 'react'
import { Check } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export type Interest =
  | 'adventure'
  | 'animals'
  | 'fantasy'
  | 'friendship'
  | 'science'
  | 'mystery'
  | 'humor'
  | 'nature'
  | 'space'
  | 'sports'

interface InterestOption {
  id: Interest
  label: string
  emoji: string
}

const interests: InterestOption[] = [
  { id: 'adventure', label: 'Adventure', emoji: '🗺️' },
  { id: 'animals', label: 'Animals', emoji: '🐾' },
  { id: 'fantasy', label: 'Fantasy', emoji: '🧙‍♀️' },
  { id: 'friendship', label: 'Friendship', emoji: '🤝' },
  { id: 'science', label: 'Science', emoji: '🔬' },
  { id: 'mystery', label: 'Mystery', emoji: '🔍' },
  { id: 'humor', label: 'Humor', emoji: '😄' },
  { id: 'nature', label: 'Nature', emoji: '🌿' },
  { id: 'space', label: 'Space', emoji: '🚀' },
  { id: 'sports', label: 'Sports', emoji: '⚽' },
]

interface InterestPickerProps {
  selected: Interest[]
  onToggle: (interest: Interest) => void
  minRequired?: number
}

export default function InterestPicker({
  selected,
  onToggle,
  minRequired = 3,
}: InterestPickerProps) {
  const needsMore = selected.length < minRequired
  
  return (
    <div className="space-y-4">
      {/* Hint */}
      <p className="text-sm text-charcoal/70 text-center">
        {needsMore ? (
          <>
            Pick at least <span className="font-semibold text-teal">{minRequired} favorites</span>
            {' '}({selected.length}/{minRequired} selected)
          </>
        ) : (
          <span className="text-teal font-medium">
            ✓ Great! You can add more or continue
          </span>
        )}
      </p>
      
      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
        {interests.map((interest) => {
          const isSelected = selected.includes(interest.id)
          
          return (
            <Card
              key={interest.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                isSelected
                  ? 'border-2 border-teal bg-teal shadow-md scale-105'
                  : 'border border-gray-200 hover:border-teal/50 hover:scale-105'
              }`}
              onClick={() => onToggle(interest.id)}
            >
              <CardContent className="p-3 sm:p-4 text-center relative min-h-[100px] sm:min-h-[120px] flex flex-col items-center justify-center">
                {/* Checkmark */}
                {isSelected && (
                  <div className="absolute top-1.5 right-1.5 bg-white rounded-full p-0.5 sm:p-1 animate-scale-in shadow-sm">
                    <Check className="h-3 w-3 sm:h-4 sm:w-4 text-teal" />
                  </div>
                )}
                
                {/* Emoji */}
                <div className={`text-3xl sm:text-4xl mb-2 transition-transform ${
                  isSelected ? 'animate-bounce-subtle' : ''
                }`}>
                  {interest.emoji}
                </div>
                
                {/* Label */}
                <p className={`text-xs sm:text-sm font-medium transition-colors ${
                  isSelected ? 'text-white' : 'text-charcoal'
                }`}>
                  {interest.label}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
