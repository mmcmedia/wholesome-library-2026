'use client'

import React from 'react'
import Link from 'next/link'
import { Clock, BookOpen } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import type { MockStory } from '@/lib/mock-data'

interface StoryCardProps {
  story: MockStory
}

const levelColors = {
  early: 'bg-green-100 text-green-700 border-green-200',
  independent: 'bg-blue-100 text-blue-700 border-blue-200',
  confident: 'bg-purple-100 text-purple-700 border-purple-200',
  advanced: 'bg-orange-100 text-orange-700 border-orange-200',
}

const levelLabels = {
  early: 'Early Reader',
  independent: 'Independent',
  confident: 'Confident',
  advanced: 'Advanced',
}

const genreGradients: Record<string, string> = {
  Adventure: 'from-teal to-teal-light',
  Fantasy: 'from-purple-600 to-purple-400',
  Mystery: 'from-indigo-700 to-indigo-400',
  Friendship: 'from-pink-600 to-pink-400',
  'Sci-Fi': 'from-blue-700 to-blue-400',
  Humor: 'from-amber-600 to-amber-400',
}

export default function StoryCard({ story }: StoryCardProps) {
  const gradient = genreGradients[story.genre] || 'from-teal to-teal-light'

  return (
    <Link href={`/story/${story.slug}`} aria-label={`Read ${story.title}, a ${story.genre} story about ${story.primaryVirtue}`}>
      <Card className="group overflow-hidden rounded-2xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer h-full">
        <div className="aspect-[3/4] relative overflow-hidden">
          <div className={`w-full h-full flex items-center justify-center p-6 bg-gradient-to-br ${gradient}`}>
            <span className="text-white text-xl font-bold text-center leading-tight drop-shadow-lg">
              {story.title}
            </span>
          </div>
          <div className="absolute top-3 left-3">
            <Badge className={`${levelColors[story.readingLevel]} border`}>
              {levelLabels[story.readingLevel]}
            </Badge>
          </div>
        </div>

        <CardContent className="p-4">
          <h3 className="font-bold text-lg text-charcoal mb-2 line-clamp-2 group-hover:text-teal transition-colors">
            {story.title}
          </h3>

          <p className="text-sm text-charcoal/70 mb-3 line-clamp-2">
            {story.blurb}
          </p>

          <div className="flex flex-wrap gap-2 mb-3">
            <Badge variant="outline" className="text-xs">
              {story.genre}
            </Badge>
            <Badge variant="outline" className="text-xs text-teal border-teal/30">
              {story.primaryVirtue}
            </Badge>
          </div>

          <div className="flex items-center gap-4 text-xs text-charcoal/60">
            <div className="flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{story.chapterCount} chapters</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{story.estimatedReadMinutes} min read</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
