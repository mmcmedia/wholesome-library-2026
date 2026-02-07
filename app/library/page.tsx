'use client'

import React, { useState, useEffect } from 'react'
import { Search, SlidersHorizontal, BookOpen, X } from 'lucide-react'
import { trackEvent, trackFilterUsage } from '@/lib/analytics'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet'
import StoryCard from '@/components/library/story-card'
import { mockStories } from '@/lib/mock-data'
import { EmptyState } from '@/components/ui/empty-state'
import { FadeIn } from '@/components/ui/fade-in'

export default function LibraryPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLevel, setSelectedLevel] = useState<string>('all')
  const [selectedGenre, setSelectedGenre] = useState<string>('all')
  const [selectedVirtue, setSelectedVirtue] = useState<string>('all')
  const [showFilters, setShowFilters] = useState(false)

  // Track library browse on mount
  useEffect(() => {
    trackEvent('library_browse')
  }, [])

  // Track filter usage when filters change
  useEffect(() => {
    if (selectedLevel !== 'all') {
      trackFilterUsage('level', selectedLevel)
    }
  }, [selectedLevel])

  useEffect(() => {
    if (selectedGenre !== 'all') {
      trackFilterUsage('genre', selectedGenre)
    }
  }, [selectedGenre])

  useEffect(() => {
    if (selectedVirtue !== 'all') {
      trackFilterUsage('virtue', selectedVirtue)
    }
  }, [selectedVirtue])

  // Get unique genres and virtues from mock data
  const genres = ['All', ...Array.from(new Set(mockStories.map(s => s.genre)))]
  const virtues = ['All', ...Array.from(new Set(mockStories.map(s => s.primaryVirtue)))]

  // Filter stories
  const filteredStories = mockStories.filter(story => {
    const matchesSearch = story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.blurb.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesLevel = selectedLevel === 'all' || story.readingLevel === selectedLevel
    const matchesGenre = selectedGenre === 'all' || story.genre === selectedGenre
    const matchesVirtue = selectedVirtue === 'all' || story.primaryVirtue === selectedVirtue

    return matchesSearch && matchesLevel && matchesGenre && matchesVirtue
  })

  const activeFiltersCount = [selectedLevel !== 'all', selectedGenre !== 'all', selectedVirtue !== 'all'].filter(Boolean).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal/5 to-white">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <FadeIn>
          <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-charcoal mb-2">
            Browse Our Library
          </h1>
          <p className="text-charcoal/70 text-lg">
            {filteredStories.length} wholesome {filteredStories.length === 1 ? 'story' : 'stories'} waiting for your family
          </p>
          </header>
        </FadeIn>

        {/* Search and Filters */}
        <FadeIn delay={100}>
          <section aria-label="Search and filter stories" className="mb-8 space-y-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-charcoal/40" aria-hidden="true" />
              <Input
                type="search"
                placeholder="Search stories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 py-6 text-lg"
                aria-label="Search stories by title or description"
              />
            </div>
            <Button
              variant="outline"
              size="lg"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
              aria-label={`${showFilters ? 'Hide' : 'Show'} filters ${activeFiltersCount > 0 ? `(${activeFiltersCount} active)` : ''}`}
              aria-expanded={showFilters}
            >
              <SlidersHorizontal className="h-5 w-5" aria-hidden="true" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge className="ml-1" aria-label={`${activeFiltersCount} filters active`}>
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </div>

          {/* Filter Controls */}
          {showFilters && (
            <div 
              className="bg-white rounded-xl p-6 shadow-md border border-teal/10 grid grid-cols-1 md:grid-cols-3 gap-4 animate-slide-up"
              role="region"
              aria-label="Story filters"
            >
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Reading Level
                </label>
                <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="early">Early Reader (Ages 4-6)</SelectItem>
                    <SelectItem value="independent">Independent (Ages 7-8)</SelectItem>
                    <SelectItem value="confident">Confident (Ages 9-10)</SelectItem>
                    <SelectItem value="advanced">Advanced (Ages 11-12)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Genre
                </label>
                <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {genres.map((genre) => (
                      <SelectItem key={genre} value={genre === 'All' ? 'all' : genre}>
                        {genre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Primary Virtue
                </label>
                <Select value={selectedVirtue} onValueChange={setSelectedVirtue}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {virtues.map((virtue) => (
                      <SelectItem key={virtue} value={virtue === 'All' ? 'all' : virtue}>
                        {virtue}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {activeFiltersCount > 0 && (
                <div className="md:col-span-3">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setSelectedLevel('all')
                      setSelectedGenre('all')
                      setSelectedVirtue('all')
                    }}
                    className="text-teal hover:text-teal/80"
                  >
                    Clear all filters
                  </Button>
                </div>
              )}
            </div>
          )}
          </section>
        </FadeIn>

        {/* Story Grid */}
        {filteredStories.length > 0 ? (
          <section 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            aria-label="Story library"
            role="region"
          >
            {filteredStories.map((story, index) => (
              <FadeIn key={story.id} delay={index * 50} duration={400}>
                <StoryCard story={story} />
              </FadeIn>
            ))}
          </section>
        ) : (
          <EmptyState
            icon={<BookOpen className="w-16 h-16" />}
            title="No stories match your filters"
            description="Try adjusting your filters or clearing them to see more stories."
            action={{
              label: 'Clear All Filters',
              onClick: () => {
                setSearchQuery('')
                setSelectedLevel('all')
                setSelectedGenre('all')
                setSelectedVirtue('all')
              },
            }}
          />
        )}
      </div>
    </div>
  )
}
