/**
 * SEO utilities for Wholesome Library
 * Provides helpers for structured data, Open Graph tags, and slug generation
 */

export interface Story {
  id: string
  title: string
  slug: string
  blurb: string
  genre: string
  primaryVirtue: string
  readingLevel: string
  chapterCount: number
  totalWordCount?: number
  estimatedReadMinutes: number
  coverImageUrl?: string
  publishedAt?: Date
}

/**
 * Generate a URL-friendly slug from a story title
 * Examples:
 *   "The Brave Little Fox" → "the-brave-little-fox"
 *   "Max's Amazing Adventure!" → "maxs-amazing-adventure"
 */
export function generateStorySlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/['']/g, '') // Remove apostrophes
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
    .substring(0, 60) // Limit length
}

/**
 * Generate Schema.org structured data for a story (Book type)
 * This helps search engines understand the content and can lead to rich snippets
 */
export function generateStoryStructuredData(story: Story, baseUrl: string = 'https://wholesomelibrary.com') {
  return {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: story.title,
    description: story.blurb,
    genre: story.genre,
    bookFormat: 'EBook',
    inLanguage: 'en-US',
    numberOfPages: story.chapterCount,
    keywords: [
      story.genre,
      story.primaryVirtue,
      story.readingLevel,
      'children\'s story',
      'wholesome content',
      'family-friendly',
    ].join(', '),
    url: `${baseUrl}/story/${story.slug}`,
    image: story.coverImageUrl || `${baseUrl}/default-story-cover.png`,
    datePublished: story.publishedAt?.toISOString(),
    publisher: {
      '@type': 'Organization',
      name: 'Wholesome Library',
      url: baseUrl,
    },
    audience: {
      '@type': 'Audience',
      audienceType: 'Children',
    },
    // Additional metadata for educational/children's content
    educationalLevel: mapReadingLevelToGrade(story.readingLevel),
    teaches: story.primaryVirtue,
  }
}

/**
 * Generate Open Graph metadata for a story page
 * Used by social media platforms when sharing
 */
export function generateStoryOpenGraph(story: Story, baseUrl: string = 'https://wholesomelibrary.com') {
  return {
    title: `${story.title} — Wholesome Library`,
    description: story.blurb,
    url: `${baseUrl}/story/${story.slug}`,
    siteName: 'Wholesome Library',
    type: 'article' as const,
    images: [
      {
        url: story.coverImageUrl || `${baseUrl}/default-story-cover.png`,
        width: 1200,
        height: 630,
        alt: story.title,
      },
    ],
    // Article-specific metadata
    publishedTime: story.publishedAt?.toISOString(),
    section: story.genre,
    tags: [
      story.genre,
      story.primaryVirtue,
      story.readingLevel,
      'children\'s stories',
      'wholesome content',
    ],
  }
}

/**
 * Generate Twitter Card metadata for a story page
 */
export function generateStoryTwitterCard(story: Story, baseUrl: string = 'https://wholesomelibrary.com') {
  return {
    card: 'summary_large_image' as const,
    title: `${story.title} — Wholesome Library`,
    description: story.blurb,
    images: [story.coverImageUrl || `${baseUrl}/default-story-cover.png`],
  }
}

/**
 * Map internal reading levels to grade equivalents for Schema.org
 */
function mapReadingLevelToGrade(level: string): string {
  const levelMap: Record<string, string> = {
    early: 'Preschool/Kindergarten (Ages 4-6)',
    independent: 'Grade 1-2 (Ages 7-8)',
    confident: 'Grade 3-4 (Ages 9-10)',
    advanced: 'Grade 5-6 (Ages 11-12)',
  }
  return levelMap[level] || 'Elementary School'
}

/**
 * Generate meta description for a story preview page
 * Optimized for search snippets (155-160 chars)
 */
export function generateStoryMetaDescription(story: Story): string {
  const baseDesc = story.blurb.substring(0, 120)
  const suffix = ` ${story.genre} story teaching ${story.primaryVirtue}.`
  const combined = baseDesc + suffix
  
  // Truncate to ~155 chars if needed
  return combined.length > 160 
    ? combined.substring(0, 157) + '...'
    : combined
}

/**
 * Generate canonical URL for a story
 */
export function generateStoryCanonicalUrl(slug: string, baseUrl: string = 'https://wholesomelibrary.com'): string {
  return `${baseUrl}/story/${slug}`
}

/**
 * Generate breadcrumb structured data for story pages
 */
export function generateBreadcrumbStructuredData(story: Story, baseUrl: string = 'https://wholesomelibrary.com') {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: baseUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Library',
        item: `${baseUrl}/library`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: story.title,
        item: `${baseUrl}/story/${story.slug}`,
      },
    ],
  }
}
