/**
 * Analytics event tracking for Wholesome Library
 * Tracks user behavior to improve product and content strategy
 */

export type AnalyticsEvent =
  // Core funnel events
  | 'page_view'
  | 'signup_started'
  | 'signup_completed'
  | 'child_added'
  // Discovery & browsing
  | 'library_browse'
  | 'filter_used'
  // Reading engagement
  | 'story_started'
  | 'chapter_completed'
  | 'story_completed'
  | 'story_abandoned'
  // Preference & level management
  | 'reading_level_changed'
  | 'preference_updated'
  // Subscription events
  | 'subscription_started'
  | 'subscription_cancelled'
  // Feedback events
  | 'too_easy_clicked'
  | 'too_hard_clicked'

export interface AnalyticsProperties {
  // User context
  userId?: string
  childId?: string
  
  // Story context
  storyId?: string
  storyTitle?: string
  storyGenre?: string
  storyVirtue?: string
  readingLevel?: string
  
  // Chapter context
  chapterNumber?: number
  totalChapters?: number
  
  // Filter context
  filterType?: 'genre' | 'level' | 'virtue' | 'content-tag'
  filterValue?: string
  
  // Subscription context
  planType?: 'free' | 'family' | 'annual'
  
  // Preference context
  preferenceType?: string
  preferenceValue?: string | boolean
  
  // Level change context
  oldLevel?: string
  newLevel?: string
  
  // Generic metadata
  [key: string]: unknown
}

/**
 * Track an analytics event
 * In development: logs to console
 * In production: sends to Supabase analytics_events table
 */
export function trackEvent(
  eventName: AnalyticsEvent,
  properties: AnalyticsProperties = {}
): void {
  const isDevelopment = process.env.NODE_ENV === 'development'
  
  const eventData = {
    event: eventName,
    timestamp: new Date().toISOString(),
    properties,
  }

  if (isDevelopment) {
    // Development: log to console with styled output
    console.group(`📊 Analytics Event: ${eventName}`)
    console.log('Timestamp:', eventData.timestamp)
    if (Object.keys(properties).length > 0) {
      console.log('Properties:', properties)
    }
    console.groupEnd()
  } else {
    // Production: send to analytics backend
    sendToAnalyticsBackend(eventData)
  }
}

/**
 * Send event to analytics backend (Supabase)
 * TODO: Implement when Supabase is connected
 */
async function sendToAnalyticsBackend(eventData: {
  event: string
  timestamp: string
  properties: AnalyticsProperties
}): Promise<void> {
  try {
    // TODO: Replace with actual Supabase call
    // const { error } = await supabase
    //   .from('analytics_events')
    //   .insert({
    //     event_name: eventData.event,
    //     user_id: eventData.properties.userId,
    //     child_id: eventData.properties.childId,
    //     story_id: eventData.properties.storyId,
    //     properties: eventData.properties,
    //     created_at: eventData.timestamp,
    //   })
    
    // if (error) {
    //   console.error('Analytics error:', error)
    // }
    
    // For now, just log that we would send it
    console.log('[Analytics] Would send to backend:', eventData)
  } catch (error) {
    // Fail silently - don't break the app if analytics fails
    console.error('Analytics error:', error)
  }
}

/**
 * Track page view (call from layout or page components)
 */
export function trackPageView(pagePath: string, properties: AnalyticsProperties = {}): void {
  trackEvent('page_view', {
    ...properties,
    pagePath,
    userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
  })
}

/**
 * Track story reading progress
 */
export function trackReadingProgress(
  storyId: string,
  storyTitle: string,
  chapterNumber: number,
  totalChapters: number,
  properties: AnalyticsProperties = {}
): void {
  const progressPercent = Math.round((chapterNumber / totalChapters) * 100)
  
  trackEvent('chapter_completed', {
    ...properties,
    storyId,
    storyTitle,
    chapterNumber,
    totalChapters,
    progressPercent,
  })
  
  // If this is the last chapter, also track story completion
  if (chapterNumber === totalChapters) {
    trackEvent('story_completed', {
      ...properties,
      storyId,
      storyTitle,
      totalChapters,
    })
  }
}

/**
 * Track filter usage in library
 */
export function trackFilterUsage(
  filterType: 'genre' | 'level' | 'virtue' | 'content-tag',
  filterValue: string,
  properties: AnalyticsProperties = {}
): void {
  trackEvent('filter_used', {
    ...properties,
    filterType,
    filterValue,
  })
}

/**
 * Track subscription events
 */
export function trackSubscription(
  action: 'started' | 'cancelled',
  planType: 'free' | 'family' | 'annual',
  properties: AnalyticsProperties = {}
): void {
  const eventName = action === 'started' ? 'subscription_started' : 'subscription_cancelled'
  
  trackEvent(eventName, {
    ...properties,
    planType,
  })
}

/**
 * Track reading level changes
 */
export function trackLevelChange(
  oldLevel: string,
  newLevel: string,
  childId?: string,
  properties: AnalyticsProperties = {}
): void {
  trackEvent('reading_level_changed', {
    ...properties,
    childId,
    oldLevel,
    newLevel,
  })
}

/**
 * React hook for tracking page views
 * Usage: usePageView('/library')
 */
export function usePageView(pagePath: string, properties: AnalyticsProperties = {}): void {
  if (typeof window !== 'undefined') {
    // Track on mount
    trackPageView(pagePath, properties)
  }
}
