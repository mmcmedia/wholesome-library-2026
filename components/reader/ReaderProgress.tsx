'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface ReaderProgressProps {
  currentChapter: number
  totalChapters: number
  estimatedMinutesRemaining: number
  className?: string
}

export function ReaderProgress({
  currentChapter,
  totalChapters,
  estimatedMinutesRemaining,
  className,
}: ReaderProgressProps) {
  const progress = ((currentChapter + 1) / totalChapters) * 100

  return (
    <div className={cn('mb-6', className)}>
      <div className="flex items-center justify-between mb-2 text-sm" style={{ color: 'var(--theme-muted)' }}>
        <span>
          Chapter {currentChapter + 1} of {totalChapters}
        </span>
        <span>
          ~{estimatedMinutesRemaining} min remaining
        </span>
      </div>
      <div
        className="h-1 rounded-full overflow-hidden"
        style={{ backgroundColor: 'var(--theme-border)' }}
      >
        <div
          className="h-full transition-all duration-500 ease-out"
          style={{
            width: `${progress}%`,
            backgroundColor: '#135C5E',
          }}
        />
      </div>
    </div>
  )
}
