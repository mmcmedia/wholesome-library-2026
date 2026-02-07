'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { trackEvent, trackReadingProgress } from '@/lib/analytics'
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Moon,
  Sun,
  Type,
  Menu,
  X,
  ThumbsUp,
  ThumbsDown,
  Flag,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { getMockStory, getMockChapters } from '@/lib/mock-data'

export default function StoryReaderPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string

  const story = getMockStory(slug)
  const chapters = getMockChapters(story?.id || '')

  const [currentChapter, setCurrentChapter] = useState(0)
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium')
  const [darkMode, setDarkMode] = useState(false)
  const [showChapterList, setShowChapterList] = useState(false)

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

  const fontSizeClasses = {
    small: 'text-base md:text-lg',
    medium: 'text-lg md:text-xl',
    large: 'text-xl md:text-2xl',
  }

  const bgClass = darkMode ? 'bg-charcoal' : 'bg-white'
  const textClass = darkMode ? 'text-white/90' : 'text-charcoal'
  const mutedTextClass = darkMode ? 'text-white/60' : 'text-charcoal/60'

  const handlePrevChapter = () => {
    if (!isFirstChapter) {
      setCurrentChapter(currentChapter - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleNextChapter = () => {
    if (!isLastChapter) {
      setCurrentChapter(currentChapter + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleChapterSelect = (index: number) => {
    setCurrentChapter(index)
    setShowChapterList(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${bgClass}`}>
      {/* Header with Controls */}
      <div className={`sticky top-16 z-40 border-b ${darkMode ? 'border-white/10 bg-charcoal' : 'border-charcoal/10 bg-white'} shadow-sm`}>
        <div className="container mx-auto px-4 py-3 flex items-center justify-between max-w-4xl">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/library')}
            className={darkMode ? 'text-white hover:text-white/80' : ''}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Library
          </Button>

          <div className="flex items-center gap-2">
            {/* Font Size */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                const sizes: Array<'small' | 'medium' | 'large'> = ['small', 'medium', 'large']
                const currentIndex = sizes.indexOf(fontSize)
                setFontSize(sizes[(currentIndex + 1) % sizes.length])
              }}
              className={darkMode ? 'text-white hover:text-white/80' : ''}
              title="Change font size"
            >
              <Type className="h-5 w-5" />
            </Button>

            {/* Dark Mode */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDarkMode(!darkMode)}
              className={darkMode ? 'text-white hover:text-white/80' : ''}
              title="Toggle dark mode"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            {/* Chapter List */}
            <Sheet open={showChapterList} onOpenChange={setShowChapterList}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={darkMode ? 'text-white hover:text-white/80' : ''}
                  title="Chapters"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent className={darkMode ? 'bg-charcoal border-white/10' : ''}>
                <SheetHeader>
                  <SheetTitle className={darkMode ? 'text-white' : ''}>
                    Chapters
                  </SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-2">
                  {chapters.map((ch, index) => (
                    <button
                      key={ch.id}
                      onClick={() => handleChapterSelect(index)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        index === currentChapter
                          ? darkMode
                            ? 'bg-teal/20 text-white'
                            : 'bg-teal/10 text-teal'
                          : darkMode
                          ? 'hover:bg-white/5 text-white/80'
                          : 'hover:bg-charcoal/5 text-charcoal/80'
                      }`}
                    >
                      <div className="font-medium">
                        Chapter {ch.chapterNumber}: {ch.title}
                      </div>
                      <div className={`text-sm ${mutedTextClass}`}>
                        {ch.wordCount} words
                      </div>
                    </button>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Story Content */}
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Story Title (only on first chapter) */}
        {currentChapter === 0 && (
          <div className="mb-8">
            <h1 className={`text-3xl md:text-4xl font-bold mb-4 ${textClass}`}>
              {story.title}
            </h1>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge className="bg-teal text-white">{story.genre}</Badge>
              <Badge variant="outline">{story.primaryVirtue}</Badge>
              <Badge variant="outline">{story.chapterCount} Chapters</Badge>
              <Badge variant="outline">{story.estimatedReadMinutes} min read</Badge>
            </div>
            <p className={`text-lg ${mutedTextClass} italic`}>
              {story.blurb}
            </p>
          </div>
        )}

        {/* Chapter Title */}
        <div className="mb-6">
          <div className={`text-sm font-medium mb-2 ${mutedTextClass}`}>
            Chapter {chapter.chapterNumber} of {chapters.length}
          </div>
          <h2 className={`text-2xl md:text-3xl font-bold ${textClass}`}>
            {chapter.title}
          </h2>
        </div>

        {/* Chapter Content */}
        <div
          className={`prose prose-lg max-w-none ${fontSizeClasses[fontSize]} ${textClass} leading-relaxed`}
          style={{ fontFamily: 'var(--font-poppins)' }}
        >
          {chapter.content.split('\n\n').map((paragraph, index) => (
            <p key={index} className="mb-4">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Chapter Navigation */}
        <div className="mt-12 pt-8 border-t border-charcoal/10 flex justify-between items-center">
          <Button
            onClick={handlePrevChapter}
            disabled={isFirstChapter}
            variant="outline"
            className={darkMode ? 'border-white/20 text-white hover:bg-white/5' : ''}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <div className={`text-sm ${mutedTextClass}`}>
            Chapter {currentChapter + 1} of {chapters.length}
          </div>

          <Button
            onClick={handleNextChapter}
            disabled={isLastChapter}
            className="bg-teal hover:bg-teal/90 text-white"
          >
            {isLastChapter ? 'Finish' : 'Next'}
            {!isLastChapter && <ChevronRight className="h-4 w-4 ml-2" />}
          </Button>
        </div>

        {/* End-of-Story Actions */}
        {isLastChapter && (
          <div className={`mt-8 p-6 rounded-xl border ${darkMode ? 'border-white/10 bg-white/5' : 'border-teal/20 bg-teal/5'}`}>
            <h3 className={`text-xl font-bold mb-4 ${textClass}`}>
              You finished "{story.title}"! 🎉
            </h3>
            <p className={`mb-6 ${mutedTextClass}`}>
              Was this story at the right level for your child?
            </p>
            <div className="flex gap-4 mb-6">
              <Button variant="outline" className="gap-2">
                <ThumbsDown className="h-4 w-4" />
                Too Hard
              </Button>
              <Button variant="outline" className="gap-2">
                <ThumbsUp className="h-4 w-4" />
                Just Right
              </Button>
              <Button variant="outline" className="gap-2">
                <ThumbsUp className="h-4 w-4" />
                Too Easy
              </Button>
            </div>
            <Button
              onClick={() => router.push('/library')}
              className="w-full bg-teal hover:bg-teal/90 text-white"
            >
              Find More Stories
            </Button>
          </div>
        )}

        {/* Report Problem */}
        <div className="mt-6 text-center">
          <Button variant="ghost" size="sm" className={mutedTextClass}>
            <Flag className="h-4 w-4 mr-2" />
            Report a Problem
          </Button>
        </div>
      </div>
    </div>
  )
}
