'use client'

import React from 'react'
import { Check, BookOpen, Book, BookOpenText } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export type ReadingLevel = 'early' | 'independent' | 'advanced'

interface ReadingLevelOption {
  id: ReadingLevel
  label: string
  ageRange: string
  description: string
  icon: React.ComponentType<{ className?: string }>
}

const levels: ReadingLevelOption[] = [
  {
    id: 'early',
    label: 'Early Reader',
    ageRange: 'Ages 4-5',
    description: 'Simple words, bright pictures, short stories',
    icon: BookOpen,
  },
  {
    id: 'independent',
    label: 'Independent',
    ageRange: 'Ages 6-8',
    description: 'Paragraphs, chapter books, more complex plots',
    icon: Book,
  },
  {
    id: 'advanced',
    label: 'Advanced',
    ageRange: 'Ages 9-12',
    description: 'Longer stories, deeper themes, rich vocabulary',
    icon: BookOpenText,
  },
]

interface ReadingLevelPickerProps {
  selected: ReadingLevel | null
  onSelect: (level: ReadingLevel) => void
}

export default function ReadingLevelPicker({ selected, onSelect }: ReadingLevelPickerProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
      {levels.map((level) => {
        const Icon = level.icon
        const isSelected = selected === level.id
        
        return (
          <Card
            key={level.id}
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
              isSelected
                ? 'border-2 border-teal bg-teal/5 shadow-md'
                : 'border border-gray-200 hover:border-teal/50'
            }`}
            onClick={() => onSelect(level.id)}
          >
            <CardContent className="p-4 sm:p-6 text-center relative">
              {/* Checkmark */}
              {isSelected && (
                <div className="absolute top-2 right-2 bg-teal rounded-full p-1 animate-scale-in">
                  <Check className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                </div>
              )}
              
              {/* Icon */}
              <div className={`mx-auto mb-3 sm:mb-4 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-colors ${
                isSelected ? 'bg-teal/20' : 'bg-teal/10'
              }`}>
                <Icon className={`h-6 w-6 sm:h-8 sm:w-8 transition-colors ${
                  isSelected ? 'text-teal' : 'text-teal/70'
                }`} />
              </div>
              
              {/* Label */}
              <h3 className={`font-semibold text-base sm:text-lg mb-1 transition-colors ${
                isSelected ? 'text-teal' : 'text-charcoal'
              }`}>
                {level.label}
              </h3>
              
              {/* Age Range */}
              <p className="text-xs sm:text-sm text-teal/70 font-medium mb-2">
                {level.ageRange}
              </p>
              
              {/* Description */}
              <p className="text-xs sm:text-sm text-charcoal/60 leading-relaxed">
                {level.description}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
