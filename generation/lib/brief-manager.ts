/**
 * Brief Manager - Story brief queue management
 * Pulls briefs from Supabase, marks status, handles dead letter queue
 */

import { getSupabaseClient, executeQuery, updateRecord } from '../utils/supabase'
import type { PipelineLogger } from '../utils/logger'
import type { StoryBrief } from '../types/index'

/**
 * Variety matrix for auto-generating briefs
 * Expanded for greater story diversity
 */
const VARIETY_MATRIX = {
  readingLevels: ['early', 'independent', 'confident', 'advanced'] as const,
  genres: [
    'adventure', 'fantasy', 'mystery', 'friendship', 'sci-fi', 'animal',
    'sports', 'nature', 'humor', 'historical', 'fairy-tale', 'everyday-hero'
  ],
  virtues: [
    'courage', 'kindness', 'honesty', 'perseverance', 'gratitude', 'teamwork',
    'patience', 'forgiveness', 'generosity', 'responsibility', 'respect', 'compassion',
    'creativity', 'humility', 'self-discipline', 'empathy'
  ],
  themes: [
    'discovery and growth', 'facing fears', 'helping others', 'telling the truth',
    'never giving up', 'working together', 'standing up for others', 'learning from mistakes',
    'embracing differences', 'finding inner strength', 'the power of friendship',
    'believing in yourself', 'making amends', 'sharing and generosity',
    'respecting nature', 'family bonds', 'overcoming jealousy', 'building confidence'
  ]
}

/**
 * Get next queued story brief from database
 */
export async function getNextBrief(logger: PipelineLogger): Promise<StoryBrief | null> {
  logger.log('BriefManager', 'Fetching next queued brief...')

  const result = await executeQuery<StoryBrief>(async (client) => {
    return client
      .from('story_briefs')
      .select('*')
      .eq('status', 'queued')
      .order('created_at', { ascending: true })
      .limit(1)
      .single()
  })

  if (result.error) {
    logger.error('BriefManager', 'Failed to fetch next brief', result.error)
    return null
  }

  if (result.data) {
    logger.log('BriefManager', `Found brief: ${result.data.id}`)
  } else {
    logger.log('BriefManager', 'No queued briefs available')
  }

  return result.data
}

/**
 * Mark brief as currently generating
 */
export async function markBriefGenerating(briefId: string, logger: PipelineLogger): Promise<boolean> {
  logger.log('BriefManager', `Marking brief ${briefId} as generating...`)

  const result = await updateRecord<StoryBrief>(
    'story_briefs',
    briefId,
    {
      status: 'generating',
      updated_at: new Date().toISOString()
    }
  )

  if (result.error) {
    logger.error('BriefManager', `Failed to mark brief as generating`, result.error)
    return false
  }

  logger.log('BriefManager', `Brief ${briefId} marked as generating`)
  return true
}

/**
 * Mark brief as completed
 */
export async function markBriefCompleted(briefId: string, storyId: string, logger: PipelineLogger): Promise<boolean> {
  logger.log('BriefManager', `Marking brief ${briefId} as completed...`)

  const result = await updateRecord<StoryBrief>(
    'story_briefs',
    briefId,
    {
      status: 'completed',
      updated_at: new Date().toISOString()
    }
  )

  if (result.error) {
    logger.error('BriefManager', `Failed to mark brief as completed`, result.error)
    return false
  }

  logger.log('BriefManager', `Brief ${briefId} marked as completed with story ${storyId}`)
  return true
}

/**
 * Mark brief as failed (with dead letter queue logic)
 */
export async function markBriefFailed(
  briefId: string,
  reason: string,
  logger: PipelineLogger
): Promise<boolean> {
  logger.log('BriefManager', `Marking brief ${briefId} as failed: ${reason}`)

  // Fetch current brief to check attempt count
  const result = await executeQuery<StoryBrief>(async (client) => {
    return client.from('story_briefs').select('*').eq('id', briefId).single()
  })

  if (result.error || !result.data) {
    logger.error('BriefManager', `Failed to fetch brief ${briefId}`, result.error)
    return false
  }

  const currentAttempts = result.data.attempts || 0
  const nextAttempts = currentAttempts + 1
  const maxAttempts = 2

  // Determine status: if exceeded max attempts, go to dead letter queue
  const newStatus = nextAttempts >= maxAttempts ? 'failed' : 'queued'

  const updateResult = await updateRecord<StoryBrief>(
    'story_briefs',
    briefId,
    {
      status: newStatus,
      attempts: nextAttempts,
      updated_at: new Date().toISOString()
    }
  )

  if (updateResult.error) {
    logger.error('BriefManager', `Failed to update brief status`, updateResult.error)
    return false
  }

  if (newStatus === 'failed') {
    logger.warn('BriefManager', `Brief ${briefId} moved to dead letter queue after ${nextAttempts} attempts`)
  } else {
    logger.log('BriefManager', `Brief ${briefId} requeued (attempt ${nextAttempts}/${maxAttempts})`)
  }

  return true
}

/**
 * Helper: Pick least-used option from array, with random tiebreak
 */
function pickLeastUsed(options: string[] | readonly string[], counts: Record<string, number>): string {
  let minCount = Infinity
  let candidates: string[] = []
  
  for (const option of options) {
    const count = counts[option] || 0
    if (count < minCount) {
      minCount = count
      candidates = [option]
    } else if (count === minCount) {
      candidates.push(option)
    }
  }
  
  return candidates[Math.floor(Math.random() * candidates.length)]
}

/**
 * Auto-generate briefs with balanced distribution
 * Ensures even coverage across genres, virtues, and reading levels
 */
export async function autoGenerateBriefs(
  count: number,
  logger: PipelineLogger
): Promise<string[]> {
  logger.log('BriefManager', `Auto-generating ${count} balanced briefs...`)

  // Get existing briefs to avoid duplication
  const existing = await executeQuery<any[]>(async (client) => {
    return client.from('story_briefs').select('genre, primary_virtue, reading_level')
  })
  
  const existingCombos = new Set(
    (existing.data || []).map((b: any) => `${b.genre}|${b.primary_virtue}|${b.reading_level}`)
  )

  const generatedIds: string[] = []
  
  // Track what we generate in this batch for balance
  const batchGenres: Record<string, number> = {}
  const batchLevels: Record<string, number> = {}

  for (let i = 0; i < count; i++) {
    // Pick least-used genre and reading level in this batch
    const genre = pickLeastUsed(VARIETY_MATRIX.genres, batchGenres)
    const readingLevel = pickLeastUsed([...VARIETY_MATRIX.readingLevels], batchLevels)
    
    // Pick virtue that hasn't been combined with this genre
    let virtue: string
    let attempts = 0
    do {
      virtue = VARIETY_MATRIX.virtues[Math.floor(Math.random() * VARIETY_MATRIX.virtues.length)]
      attempts++
    } while (existingCombos.has(`${genre}|${virtue}|${readingLevel}`) && attempts < 20)
    
    const theme = VARIETY_MATRIX.themes[Math.floor(Math.random() * VARIETY_MATRIX.themes.length)]

    // Track balance
    batchGenres[genre] = (batchGenres[genre] || 0) + 1
    batchLevels[readingLevel] = (batchLevels[readingLevel] || 0) + 1
    existingCombos.add(`${genre}|${virtue}|${readingLevel}`)

    // Create brief
    const brief: Partial<StoryBrief> = {
      reading_level: readingLevel as any,
      genre,
      primary_virtue: virtue,
      themes: [theme],
      avoid_content: [],
      target_chapters: readingLevel === 'early' ? 3 : readingLevel === 'independent' ? 4 : 5,
      target_word_count: readingLevel === 'early' ? 1800 : readingLevel === 'independent' ? 3200 : readingLevel === 'confident' ? 5000 : 7000,
      status: 'queued',
      attempts: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    const result = await executeQuery<StoryBrief>(async (client) => {
      return client.from('story_briefs').insert(brief as any).select().single()
    })

    if (result.error || !result.data) {
      logger.error('BriefManager', `Failed to create brief ${i + 1}`, result.error)
      continue
    }

    generatedIds.push(result.data.id)
    logger.log('BriefManager', `Brief ${i + 1}/${count}: ${readingLevel} ${genre} — ${virtue}`)
  }

  logger.log('BriefManager', `Generated ${generatedIds.length} balanced briefs`)
  return generatedIds
}

/**
 * Get brief statistics
 */
export async function getBriefStats(logger: PipelineLogger): Promise<{
  queued: number
  generating: number
  completed: number
  failed: number
}> {
  const stats = {
    queued: 0,
    generating: 0,
    completed: 0,
    failed: 0
  }

  for (const status of ['queued', 'generating', 'completed', 'failed'] as const) {
    const result = await executeQuery<any>(async (client) => {
      return client
        .from('story_briefs')
        .select('id', { count: 'exact' })
        .eq('status', status)
    })

    if (result.error) {
      logger.error('BriefManager', `Failed to count ${status} briefs`, result.error)
      continue
    }

    stats[status] = result.data?.length || 0
  }

  logger.log('BriefManager', 'Brief statistics:', stats)
  return stats
}

/**
 * Check if a similar story already exists
 * Helps prevent duplicate stories in the library
 */
export async function checkForDuplicateStory(
  genre: string,
  virtue: string,
  readingLevel: string,
  logger: PipelineLogger
): Promise<boolean> {
  const result = await executeQuery<any[]>(async (client) => {
    return client
      .from('stories')
      .select('id, title, genre, primary_virtue')
      .eq('genre', genre)
      .eq('primary_virtue', virtue)
      .limit(3)
  })
  
  if (result.data && result.data.length >= 3) {
    logger.warn('BriefManager', `Already have ${result.data.length} ${genre}/${virtue} stories — skipping to avoid duplication`)
    return true // Duplicate detected
  }
  
  return false
}
