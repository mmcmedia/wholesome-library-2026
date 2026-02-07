'use client'

import React, { useEffect, useState } from 'react'
import { useReaderTheme } from './ReaderThemeProvider'
import { cn } from '@/lib/utils'

interface ChapterContentProps {
  title: string
  content: string
  chapterNumber: number
  isFirstChapter: boolean
  className?: string
}

export function ChapterContent({
  title,
  content,
  chapterNumber,
  isFirstChapter,
  className,
}: ChapterContentProps) {
  const { preferences } = useReaderTheme()
  const [isVisible, setIsVisible] = useState(false)

  // Fade in effect when chapter changes
  useEffect(() => {
    setIsVisible(false)
    const timer = setTimeout(() => setIsVisible(true), 50)
    return () => clearTimeout(timer)
  }, [chapterNumber])

  // Split content into paragraphs
  const paragraphs = content.split('\n\n').filter(p => p.trim().length > 0)

  return (
    <article
      className={cn(
        'transition-opacity duration-300',
        isVisible ? 'opacity-100' : 'opacity-0',
        className
      )}
    >
      {/* Chapter Title with hand-drawn underline effect */}
      <header className="mb-8">
        <h2
          className="text-3xl md:text-4xl font-bold mb-2 relative inline-block"
          style={{ color: 'var(--theme-text)' }}
        >
          {title}
          {/* Hand-drawn underline SVG */}
          <svg
            className="absolute -bottom-2 left-0 w-full"
            height="8"
            viewBox="0 0 200 8"
            preserveAspectRatio="none"
            style={{ opacity: 0.4 }}
          >
            <path
              d="M0,4 Q50,2 100,4 T200,4"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
        </h2>
      </header>

      {/* Chapter Content */}
      <div className="space-y-6">
        {paragraphs.map((paragraph, index) => {
          const isFirstParagraph = index === 0
          const trimmedParagraph = paragraph.trim()
          
          return (
            <p
              key={index}
              className={cn(
                'transition-all duration-300',
                isFirstParagraph && 'first-letter:text-5xl first-letter:font-bold first-letter:mr-1 first-letter:float-left first-letter:leading-none first-letter:mt-1',
                !isFirstParagraph && 'indent-8'
              )}
              style={{
                color: 'var(--theme-text)',
                lineHeight: 'var(--line-height)',
                marginBottom: '1.5em',
              }}
            >
              {trimmedParagraph}
            </p>
          )
        })}
      </div>
    </article>
  )
}
