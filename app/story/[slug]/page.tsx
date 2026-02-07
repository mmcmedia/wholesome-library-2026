'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight, Flag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { trackEvent, trackReadingProgress } from '@/lib/analytics'
import { getMockStory, getMockChapters } from '@/lib/mock-data'
import { ReaderThemeProvider, useReaderTheme, THEMES, FONT_SIZES } from '@/components/reader/ReaderThemeProvider'
import { ReaderToolbar } from '@/components/reader/ReaderToolbar'
import { ChapterContent } from '@/components/reader/ChapterContent'
import { ReaderProgress } from '@/components/reader/ReaderProgress'
import { CompletionScreen } from '@/components/reader/CompletionScreen'
import { cn } from '@/lib/utils'

function StoryReaderContent() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  const { preferences } = useReaderTheme()

  const story = getMockStory(slug)
  const chapters = getMockChapters(story?.id || '')

  const [currentChapter, setCurrentChapter] = useState(0)
  const [startTime] = useState(Date.now())
  const [showCompletion, setShowCompletion] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  // Check for prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mediaQuery.matches)
    
    const handleChange = () => setReducedMotion(mediaQuery.matches)
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // Track story started on mount
  useEffect(() => {
    if (story) {
      trackEvent('story_started', {
        storyId: story.id,
        storyTitle: story.title,
        storyGenre: story.genre,
        storyVirtue: story.primaryVirtue,
        readingLevel: story.readingLevel,
      })
    }
  }, [story])

  // Track chapter completion when chapter changes
  useEffect(() => {
    if (story && currentChapter > 0) {
      trackReadingProgress(
        story.id,
        story.title,
        currentChapter,
        chapters.length,
        {
          storyGenre: story.genre,
          readingLevel: story.readingLevel,
        }
      )
    }
  }, [currentChapter, story, chapters.length])

  // Show completion screen when reaching last chapter
  useEffect(() => {
    if (currentChapter === chapters.length - 1 && chapters.length > 0) {
      // Delay showing completion screen until user scrolls to bottom or clicks next
      setShowCompletion(false)
    }
  }, [currentChapter, chapters.length])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && currentChapter > 0) {
        e.preventDefault()
        handlePrevChapter()
      } else if (e.key === 'ArrowRight' && currentChapter < chapters.length - 1) {
        e.preventDefault()
        handleNextChapter()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentChapter, chapters.length])

  // Touch/swipe gestures for mobile
  useEffect(() => {
    let touchStartX = 0
    let touchEndX = 0

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.changedTouches[0].screenX
    }

    const handleTouchEnd = (e: TouchEvent) => {
      touchEndX = e.changedTouches[0].screenX
      handleSwipe()
    }

    const handleSwipe = () => {
      const swipeThreshold = 75
      if (touchEndX < touchStartX - swipeThreshold && currentChapter < chapters.length - 1) {
        handleNextChapter()
      } else if (touchEndX > touchStartX + swipeThreshold && currentChapter > 0) {
        handlePrevChapter()
      }
    }

    document.addEventListener('touchstart', handleTouchStart)
    document.addEventListener('touchend', handleTouchEnd)

    return () => {
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [currentChapter, chapters.length])

  if (!story || chapters.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-charcoal mb-4">Story Not Found</h1>
          <Button onClick={() => router.push('/library')}>
            Back to Library
          </Button>
        </div>
      </div>
    )
  }

  const chapter = chapters[currentChapter]
  const isFirstChapter = currentChapter === 0
  const isLastChapter = currentChapter === chapters.length - 1

  const handlePrevChapter = useCallback(() => {
    if (currentChapter > 0) {
      setCurrentChapter(currentChapter - 1)
      window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' })
    }
  }, [currentChapter, reducedMotion])

  const handleNextChapter = useCallback(() => {
    if (currentChapter < chapters.length - 1) {
      setCurrentChapter(currentChapter + 1)
      window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' })
    } else if (isLastChapter && !showCompletion) {
      // Show completion screen
      setShowCompletion(true)
      const readingTimeMinutes = Math.round((Date.now() - startTime) / 1000 / 60)
      trackEvent('story_completed', {
        storyId: story.id,
        storyTitle: story.title,
        readingTimeMinutes,
      })
    }
  }, [currentChapter, chapters.length, isLastChapter, showCompletion, story, startTime])

  const handleChapterSelect = (index: number) => {
    setCurrentChapter(index)
    window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' })
  }

  // Calculate estimated time remaining
  const wordsRemaining = chapters
    .slice(currentChapter + 1)
    .reduce((sum, ch) => sum + ch.wordCount, 0)
  const estimatedMinutesRemaining = Math.ceil(wordsRemaining / 200) // Assuming 200 words per minute

  // Get theme values
  const currentTheme = THEMES[preferences.theme]
  const currentFontSize = FONT_SIZES[preferences.fontSize]

  // Get story recommendations (mock for now)
  const recommendations = [
    getMockStory('the-secret-garden-club'),
    getMockStory('the-dragon-who-couldnt-fly'),
    getMockStory('the-kindness-ripple'),
  ].filter(Boolean) as any[]

  const readingTimeMinutes = Math.round((Date.now() - startTime) / 1000 / 60)

  return (
    <div
      className={cn(
        'min-h-screen transition-colors',
        reducedMotion ? '' : 'duration-300'
      )}
      style={
        {
          backgroundColor: currentTheme.bg,
          color: currentTheme.text,
          '--theme-bg': currentTheme.bg,
          '--theme-text': currentTheme.text,
          '--theme-muted': currentTheme.muted,
          '--theme-border': currentTheme.border,
          '--toolbar-bg': currentTheme.toolbar,
          '--line-height': currentFontSize.lineHeight,
          fontSize: currentFontSize.base,
        } as React.CSSProperties
      }
    >
      {/* Screen reader announcements */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        id="screen-reader-announcements"
      />

      {/* Floating Toolbar */}
      <ReaderToolbar
        chapters={chapters.map((ch, idx) => ({
          id: ch.id,
          chapterNumber: ch.chapterNumber,
          title: ch.title,
          wordCount: ch.wordCount,
        }))}
        currentChapter={currentChapter}
        onChapterSelect={handleChapterSelect}
      />

      {/* Main Content */}
      <div className="container mx-auto px-6 py-24 max-w-[680px]">
        {/* Story Header (only on first chapter) */}
        {isFirstChapter && (
          <div className="mb-12">
            <h1
              className="text-4xl md:text-5xl font-bold mb-4"
              style={{ color: currentTheme.text }}
            >
              {story.title}
            </h1>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge className="bg-teal text-white">{story.genre}</Badge>
              <Badge variant="outline">{story.primaryVirtue}</Badge>
              <Badge variant="outline">{story.chapterCount} Chapters</Badge>
              <Badge variant="outline">{story.estimatedReadMinutes} min read</Badge>
            </div>
            <p
              className="text-lg italic leading-relaxed"
              style={{ color: currentTheme.muted }}
            >
              {story.blurb}
            </p>
          </div>
        )}

        {/* Progress Indicator */}
        {!isFirstChapter && (
          <ReaderProgress
            currentChapter={currentChapter}
            totalChapters={chapters.length}
            estimatedMinutesRemaining={estimatedMinutesRemaining}
          />
        )}

        {/* Chapter Content */}
        <ChapterContent
          title={chapter.title}
          content={chapter.content}
          chapterNumber={chapter.chapterNumber}
          isFirstChapter={isFirstChapter}
          className={preferences.fontFamily === 'serif' ? 'font-serif' : 'font-sans'}
        />

        {/* Chapter Navigation */}
        <div className="mt-12 pt-8 flex justify-between items-center" style={{ borderTop: `1px solid ${currentTheme.border}` }}>
          <Button
            onClick={handlePrevChapter}
            disabled={isFirstChapter}
            variant="outline"
            style={{
              borderColor: currentTheme.border,
              color: currentTheme.text,
            }}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <div className="text-sm" style={{ color: currentTheme.muted }}>
            Chapter {currentChapter + 1} of {chapters.length}
          </div>

          <Button
            onClick={handleNextChapter}
            className="bg-teal hover:bg-teal/90 text-white"
          >
            {isLastChapter ? (showCompletion ? 'Finish' : 'Complete') : 'Next'}
            {!isLastChapter && <ChevronRight className="h-4 w-4 ml-2" />}
          </Button>
        </div>

        {/* Completion Screen */}
        {isLastChapter && showCompletion && (
          <CompletionScreen
            storyId={story.id}
            storyTitle={story.title}
            readingTimeMinutes={readingTimeMinutes}
            recommendations={recommendations}
          />
        )}

        {/* Report Problem */}
        {!showCompletion && (
          <div className="mt-6 text-center">
            <Button variant="ghost" size="sm" style={{ color: currentTheme.muted }}>
              <Flag className="h-4 w-4 mr-2" />
              Report a Problem
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function StoryReaderPage() {
  return (
    <ReaderThemeProvider>
      <StoryReaderContent />
    </ReaderThemeProvider>
  )
}
