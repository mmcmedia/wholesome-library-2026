/**
 * Brief Manager - Story brief queue management
 * Pulls briefs from Supabase, marks status, handles dead letter queue
 */

import { getSupabaseClient, executeQuery, updateRecord } from '../utils/supabase'
import type { PipelineLogger } from '../utils/logger'
import type { StoryBrief } from '../types/index'

/**
 * Variety matrix for auto-generating briefs
 */
const VARIETY_MATRIX = {
  readingLevels: ['early', 'independent', 'confident', 'advanced'] as const,
  genres: ['adventure', 'fantasy', 'mystery', 'friendship', 'sci-fi', 'animal'],
  virtues: ['courage', 'kindness', 'honesty', 'perseverance', 'gratitude', 'teamwork'],
  themes: [
    'discovery and growth',
    'facing fears',
    'helping others',
    'telling the truth',
    'never giving up',
    'working together'
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
 * Auto-generate briefs from variety matrix
 */
export async function autoGenerateBriefs(
  count: number,
  logger: PipelineLogger
): Promise<string[]> {
  logger.log('BriefManager', `Auto-generating ${count} briefs from variety matrix...`)

  const generatedIds: string[] = []

  for (let i = 0; i < count; i++) {
    // Randomly select from variety matrix
    const readingLevel =
      VARIETY_MATRIX.readingLevels[Math.floor(Math.random() * VARIETY_MATRIX.readingLevels.length)]
    const genre =
      VARIETY_MATRIX.genres[Math.floor(Math.random() * VARIETY_MATRIX.genres.length)]
    const virtue =
      VARIETY_MATRIX.virtues[Math.floor(Math.random() * VARIETY_MATRIX.virtues.length)]
    const theme =
      VARIETY_MATRIX.themes[Math.floor(Math.random() * VARIETY_MATRIX.themes.length)]

    // Create brief
    const brief: Partial<StoryBrief> = {
      reading_level: readingLevel,
      genre,
      primary_virtue: virtue,
      themes: [theme],
      avoid_content: [],
      target_chapters: readingLevel === 'early' ? 3 : readingLevel === 'independent' ? 4 : 5,
      target_word_count: readingLevel === 'early' ? 1800 : readingLevel === 'independent' ? 2500 : 3500,
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
    logger.log('BriefManager', `Generated brief ${i + 1}/${count}: ${result.data.id}`)
  }

  logger.log('BriefManager', `Auto-generation complete: ${generatedIds.length} briefs created`)
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
