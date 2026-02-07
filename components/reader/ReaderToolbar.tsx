'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Type, Palette, Menu, Flag, Sun, Moon, Book } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { useReaderTheme, FONT_SIZES } from './ReaderThemeProvider'
import { cn } from '@/lib/utils'

interface Chapter {
  id: string
  chapterNumber: number
  title: string
  wordCount: number
}

interface ReaderToolbarProps {
  chapters: Chapter[]
  currentChapter: number
  onChapterSelect: (index: number) => void
  className?: string
}

export function ReaderToolbar({
  chapters,
  currentChapter,
  onChapterSelect,
  className,
}: ReaderToolbarProps) {
  const router = useRouter()
  const { preferences, cycleFontSize, cycleTheme } = useReaderTheme()
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [showChapterList, setShowChapterList] = useState(false)

  // Auto-hide toolbar on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      if (currentScrollY < 10) {
        // Near top, always show
        setIsVisible(true)
      } else if (currentScrollY > lastScrollY) {
        // Scrolling down, hide
        setIsVisible(false)
      } else {
        // Scrolling up, show
        setIsVisible(true)
      }
      
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  const handleChapterClick = (index: number) => {
    onChapterSelect(index)
    setShowChapterList(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const getFontSizeLabel = () => {
    return preferences.fontSize.charAt(0).toUpperCase() + preferences.fontSize.slice(1)
  }

  const getThemeIcon = () => {
    switch (preferences.theme) {
      case 'light':
        return <Sun className="h-5 w-5" />
      case 'dark':
        return <Moon className="h-5 w-5" />
      case 'sepia':
        return <Book className="h-5 w-5" />
    }
  }

  const getThemeLabel = () => {
    switch (preferences.theme) {
      case 'light':
        return 'Light'
      case 'dark':
        return 'Dark'
      case 'sepia':
        return 'Sepia'
    }
  }

  return (
    <div
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-transform duration-300',
        isVisible ? 'translate-y-0' : '-translate-y-full',
        className
      )}
      style={{
        backgroundColor: 'var(--toolbar-bg)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
      }}
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between max-w-4xl">
        {/* Left: Back button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/library')}
          className="hover:bg-black/5"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Library
        </Button>

        {/* Right: Controls */}
        <div className="flex items-center gap-2">
          {/* Font Size */}
          <Button
            variant="ghost"
            size="icon"
            onClick={cycleFontSize}
            title={`Font size: ${getFontSizeLabel()}`}
            className="hover:bg-black/5"
          >
            <Type className="h-5 w-5" />
          </Button>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={cycleTheme}
            title={`Theme: ${getThemeLabel()}`}
            className="hover:bg-black/5"
          >
            {getThemeIcon()}
          </Button>

          {/* Chapter List */}
          <Sheet open={showChapterList} onOpenChange={setShowChapterList}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                title="Chapters"
                className="hover:bg-black/5"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              className="w-[300px] sm:w-[400px]"
              style={{
                backgroundColor: 'var(--theme-bg)',
                color: 'var(--theme-text)',
                borderLeft: '1px solid var(--theme-border)',
              }}
            >
              <SheetHeader>
                <SheetTitle style={{ color: 'var(--theme-text)' }}>
                  Chapters
                </SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-2">
                {chapters.map((chapter, index) => (
                  <button
                    key={chapter.id}
                    onClick={() => handleChapterClick(index)}
                    className={cn(
                      'w-full text-left p-3 rounded-lg transition-colors',
                      index === currentChapter
                        ? 'bg-teal/20 font-medium'
                        : 'hover:bg-black/5'
                    )}
                    style={{
                      color: index === currentChapter ? '#135C5E' : 'var(--theme-text)',
                    }}
                  >
                    <div className="font-medium">
                      Chapter {chapter.chapterNumber}: {chapter.title}
                    </div>
                    <div
                      className="text-sm"
                      style={{ color: 'var(--theme-muted)' }}
                    >
                      {chapter.wordCount} words
                    </div>
                  </button>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Thin progress bar at bottom of toolbar */}
      <div
        className="h-0.5 bg-black/5"
        style={{
          background: `linear-gradient(to right, #135C5E ${((currentChapter + 1) / chapters.length) * 100}%, transparent ${((currentChapter + 1) / chapters.length) * 100}%)`,
        }}
      />
    </div>
  )
}
