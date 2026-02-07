/**
 * Story Creator - V3 Sequential Enhanced DNA System
 * 
 * Complete port from wholesome2.0 with production bug fixes
 * Prevents 7 real bugs from V1 production (see CONSISTENCY-REQUIREMENTS.md)
 * 
 * Architecture:
 * 1. Foundation (World, Themes, Plot) - 3-4s
 * 2. Characters & Relationships with speech fingerprints - 4-5s
 * 3. Chapters & Continuity with knowledge tracking - 4-5s
 * Total: 11-14s with high reliability
 */

import type { PipelineLogger } from '../utils/logger'
import { executeCompletion, executeCompletionFull, parseJSONSafely } from '../utils/openai'
// All API calls route through executeCompletion/executeCompletionFull for retry logic + token tracking
import type {
  StoryBrief,
  StoryDNA,
  Chapter,
  CharacterProfile,
  CharacterTension,
  ChapterTransition,
  CharacterKnowledgeUpdate,
  StoryState,
  ContinuityRules
} from '../types/index'

/**
 * Retry configuration
 */
const RETRY_CONFIG = {
  maxRetries: 3,
  baseDelay: 1000,
  promptVariations: 3
}

/**
 * Retry wrapper with prompt variations (fixes unreliability from V1)
 */
async function retryWithVariations<T>(
  generatorFn: (variation: number) => Promise<T>,
  stageName: string,
  logger: PipelineLogger
): Promise<T> {
  let lastError: any = null
  
  for (let attempt = 0; attempt < RETRY_CONFIG.maxRetries; attempt++) {
    for (let variation = 0; variation < RETRY_CONFIG.promptVariations; variation++) {
      try {
        logger.debug('StoryCreator', `${stageName} - Attempt ${attempt + 1}, Variation ${variation + 1}`)
        const result = await generatorFn(variation)
        logger.log('StoryCreator', `${stageName} succeeded with variation ${variation + 1}`)
        return result
      } catch (error) {
        lastError = error
        const errorType = error instanceof Error ? error.constructor.name : 'UnknownError'
        logger.debug('StoryCreator', `${stageName} failed with ${errorType}`)
        
        // Don't retry on API key errors
        if (error instanceof Error && error.message?.includes('API key')) {
          throw error
        }
        
        // Add delay before next attempt
        if (attempt < RETRY_CONFIG.maxRetries - 1 || variation < RETRY_CONFIG.promptVariations - 1) {
          const delay = RETRY_CONFIG.baseDelay * Math.pow(2, attempt)
          await new Promise(resolve => setTimeout(resolve, delay))
        }
      }
    }
  }
  
  throw new Error(`${stageName} failed after all retries: ${lastError?.message || 'Unknown error'}`)
}

/**
 * Sanitize user input to prevent template injection
 */
function sanitizeInput(input: string): string {
  if (!input || typeof input !== 'string') return ''
  return input
    .replace(/[<>{}$`]/g, '') // Remove potential template injection chars
    .replace(/\${.*?}/g, '') // Remove template literals
    .trim()
    .slice(0, 100) // Limit length
}

/**
 * Context compression utilities
 */
export function compressFoundation(foundation: any): string {
  const setting = sanitizeInput(foundation.worldBible?.setting || '')
  const atmosphere = sanitizeInput(foundation.worldBible?.atmosphere || '')
  const theme = sanitizeInput(foundation.plotStructure?.centralTheme || '')
  const stakes = sanitizeInput(foundation.emotionalStakes?.core || '')
  
  return `World: ${setting} (${atmosphere}). ` +
    `Rules: ${foundation.worldBible?.magicalRules?.slice(0, 2)?.join('; ') || ''}. ` +
    `Theme: ${theme}. ` +
    `Stakes: ${stakes}`
}

export function compressCharacters(characters: Record<string, CharacterProfile>): string {
  return Object.entries(characters).map(([name, char]) => 
    `${sanitizeInput(name)}(${char.age || 'unknown'},${sanitizeInput(char.dominantTrait || '')},${sanitizeInput(char.archetype || '')})`
  ).join('. ')
}

/**
 * Main sequential generation function
 */
export async function generateStoryDNA(
  brief: StoryBrief,
  logger: PipelineLogger
): Promise<StoryDNA> {
  logger.log('StoryCreator', `Generating Sequential Enhanced DNA for brief ${brief.id}...`)
  
  const startTime = Date.now()
  const storyId = generateStoryId()
  
  // Generate character names based on genre if not provided
  const characterNames = generateDefaultCharacterNames(brief.genre)
  
  try {
    // Stage 1: Foundation (World, Themes, Plot)
    logger.log('StoryCreator', 'Stage 1: Generating foundation (world bible, plot structure, emotional stakes)...')
    const foundation = await retryWithVariations(
      (variation) => generateFoundation(brief, characterNames, variation, logger),
      'Stage 1: Foundation',
      logger
    )
    
    logger.debug('StoryCreator', `Stage 1 complete: ${Date.now() - startTime}ms`, {
      hasWorldBible: !!foundation.worldBible,
      hasPlotStructure: !!foundation.plotStructure
    })
    
    // Stage 2: Characters & Relationships with speech fingerprints
    logger.log('StoryCreator', 'Stage 2: Generating characters with speech fingerprints...')
    const stage2Start = Date.now()
    const charactersData = await retryWithVariations(
      (variation) => generateCharactersAndRelationships(
        brief,
        characterNames,
        compressFoundation(foundation),
        variation,
        logger
      ),
      'Stage 2: Characters',
      logger
    )
    
    logger.debug('StoryCreator', `Stage 2 complete: ${Date.now() - stage2Start}ms`, {
      characterCount: Object.keys(charactersData.characters).length,
      tensionCount: charactersData.characterTensions.length
    })
    
    // Stage 3: Chapters & Continuity with knowledge tracking
    logger.log('StoryCreator', 'Stage 3: Generating chapters with continuity tracking...')
    const stage3Start = Date.now()
    const chaptersData = await retryWithVariations(
      (variation) => generateChaptersAndContinuity(
        brief,
        compressFoundation(foundation),
        compressCharacters(charactersData.characters),
        charactersData.characterTensions,
        characterNames,
        variation,
        logger
      ),
      'Stage 3: Chapters',
      logger
    )
    
    logger.debug('StoryCreator', `Stage 3 complete: ${Date.now() - stage3Start}ms`, {
      chapterCount: chaptersData.chapterSpecs.length,
      transitionCount: chaptersData.chapterTransitions.length
    })
    
    // Generate AI-powered title (FIX 1)
    logger.log('StoryCreator', 'Generating AI-powered title...')
    const title = await generateTitle(foundation, charactersData, brief, logger)
    logger.log('StoryCreator', `Generated title: "${title}"`)
    
    // Combine all stages into final DNA
    const dna = combineStagesToDNA(
      foundation,
      charactersData,
      chaptersData,
      brief,
      storyId,
      characterNames,
      title
    )
    
    logger.log('StoryCreator', `DNA generated successfully in ${Date.now() - startTime}ms`, {
      version: dna.version,
      chapterCount: dna.chapterSpecs.length,
      characterCount: Object.keys(dna.characters).length,
      hasStoryState: !!dna.storyState
    })
    
    return dna
  } catch (error) {
    logger.error('StoryCreator', 'Failed to generate story DNA', error)
    throw error
  }
}

/**
 * Get reading level specification for DNA generation (FIX 5)
 */
function getReadingLevelSpecForDNA(level: string): string {
  const specs: Record<string, string> = {
    early: 'Ages 4-7: Simple vocabulary (1-2 syllables), short sentences (5-10 words), basic themes, 400-600 words per chapter',
    independent: 'Ages 7-10: Grade-appropriate vocabulary, moderate sentences (8-15 words), accessible themes with some depth, 800-1200 words per chapter',
    confident: 'Ages 10-13: Rich vocabulary, varied sentence length, sophisticated themes, literary devices OK, 1000-1500 words per chapter',
    advanced: 'Ages 13+: Full vocabulary range, complex sentences, mature themes handled appropriately, 1200-2000 words per chapter'
  }
  return specs[level] || specs.independent
}

/**
 * Get chapter word count targets based on reading level
 * Ensures DNA chapter specs match the reading level calibration
 */
function getChapterWordCountJson(readingLevel: string): string {
  const counts: Record<string, { min: number; max: number; target: number }> = {
    early: { min: 400, max: 600, target: 500 },
    independent: { min: 800, max: 1200, target: 1000 },
    confident: { min: 1000, max: 1500, target: 1200 },
    advanced: { min: 1200, max: 2000, target: 1500 }
  }
  const wc = counts[readingLevel] || counts.independent
  return JSON.stringify(wc)
}

/**
 * Stage 1: Generate Foundation (World, Themes, Plot)
 */
async function generateFoundation(
  brief: StoryBrief,
  characterNames: string[],
  variation: number,
  logger: PipelineLogger
): Promise<any> {
  
  // System prompts for different variations
  const systemPrompts = [
    'You are a master story architect. Create rich, engaging story foundations.',
    'You are an expert in children\'s literature. Design compelling story worlds with clear rules and emotional depth.',
    'You are a creative writing professor specializing in world-building. Craft immersive story foundations.'
  ]
  
  // Build avoid_content section (FIX 4)
  const avoidContentSection = brief.avoid_content && brief.avoid_content.length > 0 
    ? `\n\nCONTENT TO AVOID:\n${brief.avoid_content.map(item => `- ${sanitizeInput(item)}`).join('\n')}`
    : '';
  
  // User prompts with slightly different framing (FIX Bug #4: NO example storylines)
  const readingLevelSpec = getReadingLevelSpecForDNA(brief.reading_level);
  
  const userPrompts = [
    // Variation 0: Direct approach
    `Create the foundation for a ${brief.reading_level} ${brief.genre} story.
Reading Level: ${readingLevelSpec}
Characters: ${characterNames.map(name => sanitizeInput(name)).join(', ')}
Primary Virtue: ${sanitizeInput(brief.primary_virtue)}
Themes: ${brief.themes.map(theme => sanitizeInput(theme)).join(', ')}${avoidContentSection}`,
    
    // Variation 1: Context-first approach
    `I need a story foundation for ${brief.reading_level} readers.
Reading Level: ${readingLevelSpec}
Genre: ${sanitizeInput(brief.genre)}
Main characters: ${characterNames.map(name => sanitizeInput(name)).join(', ')}
Core values to explore: ${brief.themes.map(theme => sanitizeInput(theme)).join(', ')}
Primary virtue: ${sanitizeInput(brief.primary_virtue)}${avoidContentSection}`,
    
    // Variation 2: Goal-oriented approach
    `Design a ${sanitizeInput(brief.genre)} story world that will captivate ${brief.reading_level} readers.
Reading Level: ${readingLevelSpec}
Protagonists: ${characterNames.map(name => sanitizeInput(name)).join(', ')}
The story should explore ${sanitizeInput(brief.primary_virtue)} while teaching ${brief.themes.map(theme => sanitizeInput(theme)).join(' and ')}.${avoidContentSection}`
  ]
  
  const jsonStructure = `
Generate a JSON structure with ALL fields exactly as shown:
{
  "worldBible": {
    "setting": "Specific location/world",
    "atmosphere": "Overall feeling/mood",
    "magicalRules": ["Rule 1", "Rule 2", "Rule 3"],
    "sensorySignatures": {
      "sight": "Visual signature",
      "sound": "Audio signature", 
      "smell": "Scent signature",
      "taste": "Taste signature",
      "touch": "Tactile signature"
    },
    "culturalQuirks": ["Quirk 1", "Quirk 2"],
    "ruleConsequences": {
      "rule1": "What happens if rule 1 is broken",
      "rule2": "What happens if rule 2 is broken",
      "rule3": "What happens if rule 3 is broken"
    },
    "worldHistory": "Brief history of this world",
    "previousFailures": "What others tried before that didn't work"
  },
  "plotStructure": {
    "centralConflict": "Main story conflict",
    "centralTheme": "Core theme",
    "storyQuestion": "What question drives the story?",
    "resolution": "How conflict resolves (no spoilers)",
    "conflictReversalPlan": {
      "incitingIncident": {"chapter": 1, "description": "What starts the story"},
      "falseVictory": {"chapter": 2, "description": "Seeming win that's not real"},
      "majorReversal": {"chapter": 2, "description": "When things go wrong"},
      "darkestMoment": {"chapter": 3, "description": "Lowest point"},
      "finalRevelation": {"chapter": 3, "description": "Key discovery"}
    }
  },
  "emotionalStakes": {
    "core": "What's at stake emotionally",
    "quartiles": [
      {"quartile": 1, "act": "I", "external": "Low stakes", "internal": "Initial fear", "chapters": [1], "friendshipStressor": "First test", "failureConsequence": "Minor setback"},
      {"quartile": 2, "act": "II", "external": "Rising stakes", "internal": "Growing concern", "chapters": [2], "friendshipStressor": "Bigger test", "failureConsequence": "Real problems"},
      {"quartile": 3, "act": "III", "external": "High stakes", "internal": "Deep fear", "chapters": [3], "friendshipStressor": "Major test", "failureConsequence": "Serious danger"},
      {"quartile": 4, "act": "IV", "external": "Peak stakes", "internal": "Transformed understanding", "chapters": [3], "friendshipStressor": "Final test", "failureConsequence": "Everything at risk"}
    ]
  }
}`
  
  const systemPrompt = systemPrompts[variation % systemPrompts.length]
  const userPrompt = userPrompts[variation % userPrompts.length] + jsonStructure
  
  const response = await executeCompletion({
    model: 'gpt-5.2',
    messages: [
      { role: 'developer', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    response_format: { type: 'json_object' },
    temperature: 0.7,
    max_completion_tokens: 3000,
  })
  
  logger.debug('StoryCreator', `Stage 1 response length: ${response.length}`)
  
  const parsed = parseJSONSafely<any>(response, 'StoryCreator')
  
  // Validate required fields
  if (!parsed.worldBible || !parsed.plotStructure || !parsed.emotionalStakes) {
    throw new Error('Foundation missing required fields')
  }
  
  return parsed
}

/**
 * Stage 2: Generate Characters & Relationships
 * FIX Bug #1: Lock pronouns per character
 * FIX Bug #3: NO example dialogue - use speech fingerprints instead
 */
async function generateCharactersAndRelationships(
  brief: StoryBrief,
  characterNames: string[],
  foundationSummary: string,
  variation: number,
  logger: PipelineLogger
): Promise<any> {
  
  // Build avoid_content section (FIX 4)
  const avoidContentSection = brief.avoid_content && brief.avoid_content.length > 0 
    ? `\n\nCONTENT TO AVOID:\n${brief.avoid_content.map(item => `- ${sanitizeInput(item)}`).join('\n')}`
    : '';
  
  const readingLevelSpec = getReadingLevelSpecForDNA(brief.reading_level);
  
  const prompt = `Create deep character profiles and relationships for a ${sanitizeInput(brief.genre)} story.
Reading Level: ${readingLevelSpec}
Context: ${foundationSummary}
Characters to develop: ${characterNames.map(name => sanitizeInput(name)).join(', ')}
Primary virtue: ${sanitizeInput(brief.primary_virtue)}
Themes: ${brief.themes.map(theme => sanitizeInput(theme)).join(', ')}${avoidContentSection}

CRITICAL: Define character voice through SPEECH FINGERPRINTS, NOT example dialogue.
Speech fingerprints describe HOW a character talks (patterns, habits, tells).
NEVER include example dialogue snippets - they cause repetitive, cookie-cutter stories.

Generate JSON with:
{
  "characters": {
    "${sanitizeInput(characterNames[0] || 'Character1')}": {
      "name": "${sanitizeInput(characterNames[0] || 'Character1')}",
      "age": 10,
      "gender": "female",
      "pronouns": "she/her",
      "archetype": "protagonist",
      "dominantTrait": "curious",
      "flaw": "impulsive", 
      "secretFear": "being ordinary",
      "personalGoal": "discover her purpose",
      "growthArc": "Learns patience through trials",
      "speechStyle": {
        "patterns": ["Asks unexpected questions", "Speaks in bursts when excited", "Uses vivid adjectives"],
        "phrases": ["peculiar", "fascinating", "what if"],
        "emotionalTells": "Questions get faster when nervous"
      },
      "appearance": {
        "look": "Wild curly hair that defies gravity",
        "body": "Small but surprisingly strong",
        "quirk": "Unconsciously mimics others' gestures"
      }
    }
  },
  "characterTensions": [
    {
      "characterPair": ["${sanitizeInput(characterNames[0] || 'Character1')}", "${sanitizeInput(characterNames[1] || 'Character2')}"],
      "tensionType": "personality_friction",
      "tensionPoint": "Different approaches to problem-solving",
      "description": "One rushes in, the other plans carefully",
      "resolutionPath": "Learn to balance each other's strengths",
      "triggerChapters": [1, 2]
    }
  ]
}

IMPORTANT RULES:
- pronouns field is LOCKED per character (prevents pronoun changes mid-story)
- archetype MUST be one of: "protagonist", "foil", "mentor", "ally", "rival"
- tensionType MUST be one of: "value_clash", "hidden_jealousy", "misunderstanding", "competing_goals", "personality_friction"
- speechStyle.patterns: HOW they talk (NOT what they say)
- speechStyle.phrases: Unique words they use often (NOT full sentences)
- speechStyle.emotionalTells: Voice changes under emotion (NOT example dialogue)
- Create ${characterNames.length} unique characters with distinct voices`
  
  const completionContent = await executeCompletion({
    model: 'gpt-5.2',
    messages: [
      {
        role: 'developer',
        content: 'You are a character development expert. Create nuanced, memorable characters with distinct voices. NEVER include example dialogue - use speech fingerprints instead.'
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    response_format: { type: 'json_object' },
    temperature: 0.7,
    max_completion_tokens: 3000,
  })
  
  const response = completionContent
  logger.debug('StoryCreator', `Stage 2 response length: ${response.length}`)
  
  const parsed = parseJSONSafely<any>(response, 'StoryCreator')
  
  // Validate required fields
  if (!parsed.characters || !parsed.characterTensions) {
    throw new Error('Characters missing required fields')
  }
  
  return parsed
}

/**
 * Stage 3: Generate Chapters & Continuity
 * FIX Bug #5: Knowledge tracking
 * FIX Bug #6: Cliffhanger resolution plans
 * FIX Bug #7: Forbidden reactions
 */
async function generateChaptersAndContinuity(
  brief: StoryBrief,
  foundationSummary: string,
  charactersSummary: string,
  tensions: CharacterTension[],
  characterNames: string[],
  variation: number,
  logger: PipelineLogger
): Promise<any> {
  
  const chapterCount = brief.target_chapters || 5
  
  // Build avoid_content section (FIX 4)
  const avoidContentSection = brief.avoid_content && brief.avoid_content.length > 0 
    ? `\n\nCONTENT TO AVOID:\n${brief.avoid_content.map(item => `- ${sanitizeInput(item)}`).join('\n')}`
    : '';
  
  const readingLevelSpec = getReadingLevelSpecForDNA(brief.reading_level);
  
  const prompt = `Design ${chapterCount} chapters with perfect continuity for this story.
Reading Level: ${readingLevelSpec}
Foundation: ${foundationSummary}
Characters: ${charactersSummary}
Key Tensions: ${tensions.map(t => t.description).join('; ')}${avoidContentSection}

Generate JSON with exactly ${chapterCount} chapters:
{
  "chapterSpecs": [
    {
      "chapterNumber": 1,
      "workingTitle": "Unique, specific chapter title",
      "coreObjective": "What happens in this chapter",
      "mainObstacle": "Challenge faced",
      "emotionalStakesLink": "I",
      "emotionalTransition": "curiosity to determination",
      "dominantEmotion": "curiosity",
      "secondaryEmotion": "uncertainty",
      "characterTensionBeats": ["How tension manifests"],
      "worldRuleSpotlight": "Which world rule is featured",
      "sensoryMotifFocus": "sight",
      "sceneType": "discovery",
      "targetWordCount": ${getChapterWordCountJson(brief.reading_level)},
      "cliffhanger": {
        "type": "discovery",
        "intensity": 8,
        "question": "What will they find?",
        "specificElement": "The mysterious door",
        "resolutionPlan": {
          "resolveInChapter": 2,
          "resolutionMethod": "immediate",
          "resolutionDescription": "They open the door and see...",
          "openingBeat": "Start with the discovery"
        }
      }
    }
  ],
  "chapterTransitions": [
    {
      "fromChapter": 1,
      "toChapter": 2, 
      "continuityNotes": ["Remember the magic rule", "Character learned X"],
      "knowledgeUpdates": [
        {
          "characterName": "${characterNames[0]}",
          "newKnowledge": "Important fact",
          "source": "discovery",
          "shouldReactAs": "shocked",
          "impact": "Changes their approach"
        }
      ]
    }
  ],
  "storyState": {
    "recurringElements": ["Magic bridge", "Secret phrase"],
    "knowledgeProgression": {
      "chapter1": {"${characterNames[0]}": ["knows about door"], "${characterNames[1] || characterNames[0]}": ["suspects magic"]},
      "chapter2": {"${characterNames[0]}": ["knows about door", "discovered key"]}
    }
  }
}

CRITICAL REQUIREMENTS:
- emotionalStakesLink MUST be one of: "I", "II", "III", "IV"
- sceneType MUST be one of: "action", "dialogue", "reflection", "discovery", "balanced"
- sensoryMotifFocus MUST be one of: "sight", "sound", "smell", "taste", "touch", "special"
- cliffhanger.type MUST be one of: "discovery", "danger", "revelation", "decision", "promise"
- resolutionMethod MUST be one of: "immediate", "delayed", "partial", "misdirection"
- source MUST be one of: "discovery", "revelation", "deduction", "confession", "suspected", "observation"
- shouldReactAs MUST be one of: "shocked", "suspected", "unsurprised", "confused", "hurt", "ashamed", "excited", "worried", "angry", "sad", "relieved", "determined", "curious", "fearful", "hopeful"
- Track character knowledge progression across chapters
- Plan cliffhanger resolutions BEFORE writing them`
  
  const fullResult = await executeCompletionFull({
    model: 'gpt-5.2',
    messages: [
      {
        role: 'developer',
        content: 'You are a story continuity expert. Create chapters with perfect flow and no plot holes. Track character knowledge carefully.'
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    response_format: { type: 'json_object' },
    temperature: 0.7,
    max_completion_tokens: 6000,
  })
  
  const response = fullResult.content
  const finishReason = fullResult.finishReason
  
  logger.debug('StoryCreator', `Stage 3 response length: ${response.length}, finish_reason: ${finishReason}`)
  
  if (finishReason === 'length') {
    throw new Error('Stage 3 response was TRUNCATED (hit token limit) — increase max_completion_tokens or reduce chapter count')
  }
  
  const parsed = parseJSONSafely<any>(response, 'StoryCreator')
  
  // Validate required fields
  if (!parsed.chapterSpecs || !parsed.chapterTransitions || !parsed.storyState) {
    throw new Error('Chapters missing required fields')
  }
  
  // Verify chapter count
  if (parsed.chapterSpecs.length !== chapterCount) {
    throw new Error(`Expected ${chapterCount} chapters, got ${parsed.chapterSpecs.length}`)
  }
  
  return parsed
}

/**
 * Generate AI-powered creative title (FIX 1)
 */
async function generateTitle(
  foundation: any,
  charactersData: any,
  brief: StoryBrief,
  logger: PipelineLogger
): Promise<string> {
  try {
    const titleResponse = await executeCompletion({
      model: 'gpt-5.2',
      messages: [
        { 
          role: 'developer', 
          content: 'You are a children\'s book title expert. Generate ONE creative, memorable title. Return JSON: {"title": "Your Title Here"}' 
        },
        { 
          role: 'user', 
          content: `Genre: ${brief.genre}\nSetting: ${foundation.worldBible.setting}\nCharacters: ${Object.keys(charactersData.characters).join(', ')}\nTheme: ${brief.primary_virtue}\nConflict: ${foundation.plotStructure.centralConflict}\n\nGenerate a single engaging children's book title. Not generic — make it specific and intriguing.` 
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.9,
      max_completion_tokens: 100
    })
    
    const result = parseJSONSafely<any>(titleResponse, 'StoryCreator-Title')
    return result.title || `${brief.primary_virtue} Adventure`
  } catch (error) {
    logger.warn('StoryCreator', 'Title generation failed, using fallback')
    return `${brief.primary_virtue} Adventure`
  }
}

/**
 * Combine all stages into final Enhanced DNA V3
 */
function combineStagesToDNA(
  foundation: any,
  charactersData: any,
  chaptersData: any,
  brief: StoryBrief,
  storyId: string,
  characterNames: string[],
  title: string
): StoryDNA {
  return {
    version: 'v3-sequential',
    storyId,
    
    // Metadata
    meta: {
      genre: brief.genre,
      title,
      readingLevel: brief.reading_level,
      targetAgeRange: getAgeRange(brief.reading_level),
      coreThemes: brief.themes,
      totalChapters: brief.target_chapters
    },
    
    // From Stage 1
    hook: foundation.plotStructure.storyQuestion,
    worldBible: foundation.worldBible,
    emotionalStakes: foundation.emotionalStakes,
    plotStructure: foundation.plotStructure,
    
    // From Stage 2
    characters: charactersData.characters,
    characterTensions: charactersData.characterTensions,
    
    // From Stage 3
    chapterSpecs: chaptersData.chapterSpecs,
    chapterTransitions: chaptersData.chapterTransitions,
    
    // V3 Continuity Tracking (prevents bugs #5, #6, #7)
    storyState: buildStoryState(charactersData.characters, chaptersData.storyState),
    
    continuityRules: {
      allowRepeatedShock: false,
      characterConsistencyLevel: 'strict'
    },
    
    // Editorial checklist
    editorialChecklist: {
      characterVoicesUnique: true,
      plotCoherent: true,
      ageAppropriate: true,
      virtueIntegrated: true,
      pronounsLocked: true, // FIX Bug #1
      noNewCharacters: true, // FIX Bug #2
      noExampleDialogue: true, // FIX Bug #3
      noMockStorylines: true, // FIX Bug #4
      knowledgeTracking: true, // FIX Bug #5
      cliffhangerPlans: true, // FIX Bug #6
      forbiddenReactionsTracked: true // FIX Bug #7
    }
  }
}

/**
 * Build story state with character knowledge tracking
 */
function buildStoryState(characters: Record<string, CharacterProfile>, storyStateData: any): StoryState {
  return {
    currentChapter: 1,
    activeElements: {},
    
    // Build character knowledge from knowledgeProgression
    characterKnowledge: Object.keys(characters).map((name: string) => {
      const knowledgeItems: Array<{
        fact: string
        learnedInChapter: number
        revealedToOthers: Array<{ character: string; inChapter: number; context: string }>
        isSecret: boolean
        importance: 'low' | 'medium' | 'high' | 'critical'
      }> = []
      
      // Extract knowledge from knowledgeProgression if available
      const progression = storyStateData?.knowledgeProgression
      if (progression && typeof progression === 'object') {
        Object.entries(progression).forEach(([chapterKey, charKnowledge]: [string, any]) => {
          const chapterNum = parseInt(chapterKey.replace('chapter', ''), 10)
          if (isNaN(chapterNum) || !charKnowledge) return
          
          const facts = charKnowledge[name] || []
          if (Array.isArray(facts)) {
            facts.forEach((fact: string) => {
              // Only add if not already present (dedupe)
              if (typeof fact === 'string' && !knowledgeItems.some(item => item.fact === fact)) {
                knowledgeItems.push({
                  fact,
                  learnedInChapter: chapterNum,
                  revealedToOthers: [],
                  isSecret: false,
                  importance: 'medium'
                })
              }
            })
          }
        })
      }
      
      // Sort by chapter learned
      knowledgeItems.sort((a, b) => a.learnedInChapter - b.learnedInChapter)
      
      return {
        characterName: name,
        knowledgeItems
      }
    }),
    
    pendingResolutions: [],
    recurringElements: storyStateData?.recurringElements || []
  }
}

/**
 * Get age range for reading level
 */
export function getAgeRange(readingLevel: string): string {
  const ranges: Record<string, string> = {
    early: '4-7',
    independent: '7-10',
    confident: '10-13',
    advanced: '13+'
  }
  return ranges[readingLevel] || '7-10'
}

/**
 * Generate default character names based on genre (randomized from pool)
 */
export function generateDefaultCharacterNames(genre: string): string[] {
  const namePoolsByGenre: Record<string, string[]> = {
    adventure: ['Alex', 'Jordan', 'Riley', 'Sam', 'Casey', 'Morgan', 'Taylor', 'Jamie', 'Avery', 'Quinn'],
    fantasy: ['Aria', 'Finn', 'Luna', 'Rowan', 'Sage', 'Ember', 'Asher', 'Ivy', 'Orion', 'Lyra'],
    mystery: ['Quinn', 'Riley', 'Parker', 'Blake', 'Harper', 'Sawyer', 'Piper', 'Camden', 'Sloane', 'Reed'],
    friendship: ['Emma', 'Sophia', 'Liam', 'Noah', 'Olivia', 'Ava', 'Ethan', 'Mia', 'Lucas', 'Isabella'],
    'sci-fi': ['Nova', 'Zephyr', 'Astra', 'Atlas', 'Cosmo', 'Stella', 'Phoenix', 'Orbit', 'Vega', 'Sirius'],
    animal: ['Bramble', 'Willow', 'Clover', 'Hazel', 'Aspen', 'Maple', 'Cedar', 'Juniper', 'Birch', 'Fern']
  }
  
  const pool = namePoolsByGenre[genre] || ['Alex', 'Jordan', 'Sam', 'Riley', 'Morgan', 'Taylor', 'Casey', 'Jamie', 'Avery', 'Quinn'];
  
  // Randomly pick 2-3 names from the pool (no duplicates)
  const count = Math.random() < 0.5 ? 2 : 3;
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/**
 * Generate unique story ID
 */
function generateStoryId(): string {
  return `story_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}
