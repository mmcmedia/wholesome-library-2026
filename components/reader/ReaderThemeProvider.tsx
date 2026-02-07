'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export type ReaderTheme = 'light' | 'sepia' | 'dark'
export type FontSize = 'small' | 'medium' | 'large'
export type FontFamily = 'serif' | 'sans'

interface ReaderPreferences {
  theme: ReaderTheme
  fontSize: FontSize
  fontFamily: FontFamily
}

interface ReaderThemeContextType {
  preferences: ReaderPreferences
  setTheme: (theme: ReaderTheme) => void
  setFontSize: (size: FontSize) => void
  setFontFamily: (family: FontFamily) => void
  cycleFontSize: () => void
  cycleTheme: () => void
}

const ReaderThemeContext = createContext<ReaderThemeContextType | undefined>(undefined)

const STORAGE_KEY = 'wholesome-reader-preferences'

const DEFAULT_PREFERENCES: ReaderPreferences = {
  theme: 'light',
  fontSize: 'medium',
  fontFamily: 'serif',
}

export function ReaderThemeProvider({ children }: { children: React.ReactNode }) {
  const [preferences, setPreferences] = useState<ReaderPreferences>(DEFAULT_PREFERENCES)
  const [mounted, setMounted] = useState(false)

  // Load preferences from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setPreferences(parsed)
      } catch (e) {
        console.error('Failed to parse reader preferences:', e)
      }
    }
    setMounted(true)
  }, [])

  // Save preferences to localStorage whenever they change
  useEffect(() => {
    if (mounted) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences))
    }
  }, [preferences, mounted])

  const setTheme = (theme: ReaderTheme) => {
    setPreferences(prev => ({ ...prev, theme }))
  }

  const setFontSize = (fontSize: FontSize) => {
    setPreferences(prev => ({ ...prev, fontSize }))
  }

  const setFontFamily = (fontFamily: FontFamily) => {
    setPreferences(prev => ({ ...prev, fontFamily }))
  }

  const cycleFontSize = () => {
    const sizes: FontSize[] = ['small', 'medium', 'large']
    const currentIndex = sizes.indexOf(preferences.fontSize)
    const nextIndex = (currentIndex + 1) % sizes.length
    setFontSize(sizes[nextIndex])
  }

  const cycleTheme = () => {
    const themes: ReaderTheme[] = ['light', 'sepia', 'dark']
    const currentIndex = themes.indexOf(preferences.theme)
    const nextIndex = (currentIndex + 1) % themes.length
    setTheme(themes[nextIndex])
  }

  return (
    <ReaderThemeContext.Provider
      value={{
        preferences,
        setTheme,
        setFontSize,
        setFontFamily,
        cycleFontSize,
        cycleTheme,
      }}
    >
      {children}
    </ReaderThemeContext.Provider>
  )
}

export function useReaderTheme() {
  const context = useContext(ReaderThemeContext)
  if (!context) {
    throw new Error('useReaderTheme must be used within ReaderThemeProvider')
  }
  return context
}

// Theme configurations
export const THEMES = {
  light: {
    bg: '#ffffff',
    text: '#1a1a1a',
    muted: '#666666',
    border: '#e5e7eb',
    toolbar: 'rgba(255, 255, 255, 0.95)',
  },
  sepia: {
    bg: '#F5F1E8',
    text: '#3E2723',
    muted: '#5D4037',
    border: '#D7CCC8',
    toolbar: 'rgba(245, 241, 232, 0.95)',
  },
  dark: {
    bg: '#1a1a2e',
    text: '#e8e6e3',
    muted: '#a8a6a3',
    border: '#2d2d44',
    toolbar: 'rgba(26, 26, 46, 0.95)',
  },
} as const

// Font size configurations (base sizes, will scale with viewport)
export const FONT_SIZES = {
  small: {
    base: '16px',
    mobile: '16px',
    lineHeight: 1.8,
  },
  medium: {
    base: '18px',
    mobile: '17px',
    lineHeight: 1.9,
  },
  large: {
    base: '22px',
    mobile: '20px',
    lineHeight: 2.0,
  },
} as const
