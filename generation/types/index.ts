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
 * with V3 continuity tracking
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
    culturalQuirks?: string[]
    previousFailures?: string
    [key: string]: any
  }
  plotStructure: {
    centralConflict: string
    centralTheme: string
    storyQuestion: string
    resolution: string
    conflictReversalPlan: {
      incitingIncident?: { chapter: number; description: string }
      falseVictory?: { chapter: number; description: string }
      majorReversal?: { chapter: number; description: string }
      darkestMoment?: { chapter: number; description: string }
      finalRevelation?: { chapter: number; description: string }
      [key: string]: { chapter: number; description: string } | undefined
    }
    [key: string]: any
  }
  characters: {
    [characterName: string]: CharacterProfile
  }
  characterTensions: CharacterTension[]
  chapterSpecs: Chapter[]
  chapterTransitions: ChapterTransition[]
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
  // V3 Continuity Tracking (prevents bugs #5, #6, #7)
  storyState: StoryState
  continuityRules: ContinuityRules
  editorialChecklist: {
    [key: string]: boolean
  }
  hook?: string
  [key: string]: any
}

/**
 * Character profile with speech fingerprints (prevents Bug #3 - cookie-cutter dialogue)
 */
export interface CharacterProfile {
  name: string
  age: number
  gender: string
  pronouns: string // LOCKED per character (prevents Bug #1)
  archetype: 'protagonist' | 'foil' | 'mentor' | 'ally' | 'rival'
  dominantTrait: string
  flaw: string
  secretFear: string
  personalGoal: string
  growthArc: string
  speechStyle: {
    patterns: string[]  // "Asks questions when nervous", "Speaks in short bursts"
    phrases: string[]   // Unique catch phrases (NOT example dialogue!)
    emotionalTells: string  // "Voice gets quiet when lying"
  }
  appearance: {
    look: string
    body: string
    quirk: string
  }
  [key: string]: any
}

/**
 * Character tension definition
 */
export interface CharacterTension {
  characterPair: string[]
  tensionType: 'value_clash' | 'hidden_jealousy' | 'misunderstanding' | 'competing_goals' | 'personality_friction'
  tensionPoint: string
  description: string
  resolutionPath: string
  triggerChapters: number[]
}

/**
 * Chapter transition with knowledge updates (prevents Bug #5 - knowledge amnesia)
 */
export interface ChapterTransition {
  fromChapter: number
  toChapter: number
  continuityNotes: string[]
  knowledgeUpdates: CharacterKnowledgeUpdate[]
}

/**
 * Character knowledge update (tracks what each character learns and when)
 */
export interface CharacterKnowledgeUpdate {
  characterName: string
  newKnowledge: string
  source: 'discovery' | 'revelation' | 'deduction' | 'confession' | 'suspected' | 'observation'
  shouldReactAs: 'shocked' | 'suspected' | 'unsurprised' | 'confused' | 'hurt' | 'ashamed' | 'excited' | 'worried' | 'angry' | 'sad' | 'relieved' | 'determined' | 'curious' | 'fearful' | 'hopeful'
  impact: string
}

/**
 * Story state tracking (prevents Bug #5 - knowledge amnesia)
 */
export interface StoryState {
  currentChapter?: number
  activeElements: {
    [elementName: string]: any
  }
  characterKnowledge: Array<{
    characterName: string
    knowledgeItems: Array<{
      fact: string
      learnedInChapter: number
      revealedToOthers: Array<{
        character: string
        inChapter: number
        context: string
      }>
      isSecret: boolean
      importance: 'low' | 'medium' | 'high' | 'critical'
    }>
  }>
  pendingResolutions: Array<{
    element: string
    introducedInChapter: number
    mustResolveByChapter: number
    resolutionPlan: string
  }>
  usageHistory?: {
    mistBridges?: any[]
    secretReveals?: any[]
    worldRuleDemonstrations?: any[]
  }
  recurringElements?: string[]
  [key: string]: any
}

/**
 * Continuity rules (strict character consistency)
 */
export interface ContinuityRules {
  maxMistBridgeUses?: number
  secretRevealSpacing?: number
  allowRepeatedShock: boolean
  characterConsistencyLevel: 'strict' | 'moderate' | 'flexible'
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
  cliffhanger?: {
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
  continuityRequirements?: ContinuityRequirements
  content?: string
  wordCount?: number
  [key: string]: any
}

/**
 * Continuity requirements per chapter (prevents Bug #7 - Forbidden Reactions)
 */
export interface ContinuityRequirements {
  mustResolve: string[]
  forbiddenReactions: Array<{
    character: string
    toEvent: string
    reason: string
    correctReaction: 'shocked' | 'suspected' | 'unsurprised' | 'confused' | 'hurt' | 'ashamed' | 'excited' | 'worried' | 'angry' | 'sad' | 'relieved' | 'determined' | 'curious' | 'fearful' | 'hopeful'
  }>
  characterKnowledgeState: Array<{
    character: string
    knows: string[]
    doesNotKnow: string[]
  }>
  referenceElements: string[]
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
  flags: string[]
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
  score: number
  passed: boolean
  averageScore: number
  dimensions: {
    positiveRoleModels: number
    consequenceLogic: number
    conflictResolution: number
    authorityRespect: number
    virtueIntegration: number
    hopefulEnding: number
  }
  timestamp: string
}

/**
 * Cover generation result
 */
export interface CoverGenerationResult {
  success: boolean
  imageUrl?: string
  localPath?: string
  taskId?: string
  fallbackTemplate?: string
  fallbackUsed?: boolean
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
 * Quality check result
 */
export interface QualityCheckResult {
  score: number
  dimensions: {
    narrativeCoherence: number
    characterConsistency: number
    ageAppropriateness: number
    engagement: number
    technicalQuality: number
  }
  passed: boolean
  flags: string[]
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
    dnaGeneration?: Partial<StageLog>
    chapterDrafting?: Partial<StageLog>
    aiEditor?: Partial<StageLog>
    polishPass?: Partial<StageLog>
    qualityCheck?: Partial<StageLog>
    safetyCheck?: Partial<StageLog>
    safetyScan?: Partial<StageLog>
    valuesCheck?: Partial<StageLog>
    coverGeneration?: Partial<StageLog>
    coverArt?: Partial<StageLog>
    databaseSave?: Partial<StageLog>
    [key: string]: Partial<StageLog> | undefined
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
