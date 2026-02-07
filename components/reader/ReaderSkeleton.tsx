import React from 'react'
import { cn } from '@/lib/utils'

interface ReaderSkeletonProps {
  className?: string
}

export function ReaderSkeleton({ className }: ReaderSkeletonProps) {
  return (
    <div className={cn('animate-pulse', className)}>
      {/* Header skeleton */}
      <div className="mb-8">
        <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>

      {/* Chapter title skeleton */}
      <div className="mb-6">
        <div className="h-6 bg-gray-200 rounded w-2/3 mb-2"></div>
        <div className="h-1 bg-gray-300 rounded w-2/3"></div>
      </div>

      {/* Content skeleton - mimics text lines */}
      <div className="space-y-4">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        ))}
      </div>
    </div>
  )
}
