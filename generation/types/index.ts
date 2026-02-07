/**
 * TypeScript Type Definitions for Wholesome Library Generation Pipeline
 * All types used throughout the pipeline orchestration and QA components
 */

/**
 * Reading level for target audience
 */
export type ReadingLevel = 'early' | 'independent' | 'confident' | 'advanced'

/**
 * Story brief - input to the pipeline
 */
export interface StoryBrief {
  id: string
  reading_level: ReadingLevel
  genre: string
  primary_virtue: string
  themes: string[]
  avoid_content: string[]
  target_chapters: number
  target_word_count: number
  status: 'queued' | 'generating' | 'completed' | 'failed'
  attempts: number
  created_at: string
  updated_at: string
}

/**
 * Story DNA - Enhanced 3-stage structure (foundation, characters, chapters)
 */
export interface StoryDNA {
  version: string
  storyId: string
  meta: {
    genre: string
    title: string
    targetAgeRange: string
    coreThemes: string[]
    totalChapters: number
    [key: string]: any
  }
  worldBible: {
    setting: string
    atmosphere: string
    magicalRules: string[]
    sensorySignatures: {
      sight: string
      sound: string
      smell: string
      taste: string
      touch: string
    }
    worldHistory: string
    ruleConsequences: {
      [key: string]: string
    }
    [key: string]: any
  }
  plotStructure: {
    centralConflict: string
    centralTheme: string
    storyQuestion: string
    resolution: string
    conflictReversalPlan: {
      [key: string]: {
        chapter: number
        description: string
      }
    }
    [key: string]: any
  }
  characters: {
    [characterName: string]: {
      name: string
      age: number
      gender: string
      pronouns: string
      archetype: 'protagonist' | 'foil' | 'mentor' | 'ally' | 'rival'
      dominantTrait: string
      flaw: string
      secretFear: string
      personalGoal: string
      growthArc: string
      speechStyle: {
        patterns: string[]
        phrases: string[]
        emotionalTells: string
      }
      appearance: {
        look: string
        body: string
        quirk: string
      }
      [key: string]: any
    }
  }
  characterTensions: Array<{
    characterPair: string[]
    tensionType: 'value_clash' | 'hidden_jealousy' | 'misunderstanding' | 'competing_goals' | 'personality_friction'
    tensionPoint: string
    description: string
    resolutionPath: string
    triggerChapters: number[]
  }>
  chapterSpecs: Chapter[]
  emotionalStakes: {
    core: string
    quartiles: Array<{
      quartile: number
      act: string
      external: string
      internal: string
      chapters: number[]
      friendshipStressor: string
      failureConsequence: string
    }>
  }
  editorialChecklist: {
    [key: string]: boolean
  }
  hook?: string
  [key: string]: any
}

/**
 * Chapter specification from DNA
 */
export interface Chapter {
  id?: string
  storyId?: string
  chapterNumber: number
  workingTitle: string
  coreObjective: string
  mainObstacle: string
  emotionalStakesLink: string
  emotionalTransition: string
  dominantEmotion: string
  secondaryEmotion: string
  characterTensionBeats: string[]
  worldRuleSpotlight: string
  sensoryMotifFocus: string
  sceneType: 'action' | 'dialogue' | 'reflection' | 'discovery' | 'balanced'
  targetWordCount: {
    min: number
    max: number
    target: number
  }
  cliffhanger: {
    type: 'discovery' | 'danger' | 'revelation' | 'decision' | 'promise'
    intensity: number
    question: string
    specificElement: string
    resolutionPlan: {
      resolveInChapter: number
      resolutionMethod: 'immediate' | 'delayed' | 'partial' | 'misdirection'
      resolutionDescription: string
      openingBeat: string
    }
  }
  content?: string
  wordCount?: number
  [key: string]: any
}

/**
 * Quality check result (0-100 score)
 */
export interface QualityScore {
  overallScore: number
  narrativeCoherence: {
    score: number
    feedback: string
  }
  characterConsistency: {
    score: number
    feedback: string
  }
  ageAppropriateness: {
    score: number
    feedback: string
  }
  engagement: {
    score: number
    feedback: string
  }
  technicalQuality: {
    score: number
    feedback: string
  }
  timestamp: string
}

/**
 * Safety scan result (binary pass/fail)
 */
export interface SafetyScanResult {
  passed: boolean
  timestamp: string
  checks: Array<{
    name: string
    passed: boolean
    issue?: string
  }>
  issues?: string[]
}

/**
 * Values check result (1-5 scale per dimension)
 */
export interface ValuesCheckResult {
  averageScore: number
  dimensions: {
    positiveRoleModels: {
      score: 1 | 2 | 3 | 4 | 5
      feedback: string
    }
    consequenceLogic: {
      score: 1 | 2 | 3 | 4 | 5
      feedback: string
    }
    conflictResolution: {
      score: 1 | 2 | 3 | 4 | 5
      feedback: string
    }
    authorityRespect: {
      score: 1 | 2 | 3 | 4 | 5
      feedback: string
    }
    virtueIntegration: {
      score: 1 | 2 | 3 | 4 | 5
      feedback: string
    }
    hopefulEnding: {
      score: 1 | 2 | 3 | 4 | 5
      feedback: string
    }
  }
  timestamp: string
}

/**
 * Cover generation result
 */
export interface CoverGenerationResult {
  success: boolean
  imageUrl?: string
  taskId?: string
  fallbackTemplate?: string
  timestamp: string
  error?: string
}

/**
 * AI editor result
 */
export interface AIEditorResult {
  success: boolean
  editedContent?: string
  changesApplied: string[]
  flaggedConcerns: string[]
  timestamp: string
}

/**
 * Story status after all checks
 */
export type StoryStatus = 'approved' | 'editor_queue' | 'rejected' | 'generating'

/**
 * Pipeline run log - comprehensive logging per stage (PRD 8.7)
 */
export interface PipelineRunLog {
  runId: string
  storyId: string
  briefId: string
  startTime: string
  endTime?: string
  duration?: number
  status: 'running' | 'success' | 'failed' | 'partial'
  stages: {
    dnaGeneration?: StageLog
    chapterDrafting?: StageLog
    aiEditor?: StageLog
    qualityCheck?: StageLog
    safetyScan?: StageLog
    valuesCheck?: StageLog
    coverGeneration?: StageLog
    databaseSave?: StageLog
  }
  finalStatus: StoryStatus
  errors: string[]
  tokenUsage: {
    dnaTokens: number
    chapterTokens: number
    editorTokens: number
    qaTokens: number
    total: number
  }
}

/**
 * Individual stage log
 */
export interface StageLog {
  stageName: string
  status: 'success' | 'failed' | 'retried' | 'skipped'
  startTime: string
  endTime: string
  duration: number
  error?: string
  retryCount: number
  tokensUsed: number
  details?: {
    [key: string]: any
  }
}

/**
 * Supabase query result wrapper
 */
export interface DatabaseResult<T> {
  data: T | null
  error: Error | null
}

/**
 * OpenAI completion request/response wrapper
 */
export interface CompletionRequest {
  model: string
  messages: Array<{
    role: 'system' | 'user' | 'assistant'
    content: string
  }>
  temperature?: number
  max_tokens?: number
  response_format?: {
    type: 'json_object' | 'text'
  }
}

/**
 * Pipeline context passed between stages
 */
export interface PipelineContext {
  brief: StoryBrief
  dna?: StoryDNA
  chapters?: Chapter[]
  editedChapters?: Chapter[]
  qualityScore?: QualityScore
  safetyResult?: SafetyScanResult
  valuesResult?: ValuesCheckResult
  coverResult?: CoverGenerationResult
  logger: any // PipelineLogger instance
  runLog: PipelineRunLog
}
