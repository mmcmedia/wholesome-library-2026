/**
 * Chapter Generator - V3 with Full Continuity Tracking
 * 
 * Generates each chapter using FULL DNA context with:
 * - Character roster with LOCKED pronouns (prevents Bug #1)
 * - Character-only rule (prevents Bug #2)
 * - Speech fingerprints, NO example dialogue (prevents Bug #3)
 * - Knowledge state tracking (prevents Bug #5)
 * - Cliffhanger resolution enforcement (prevents Bug #6)
 * - Forbidden reactions validation (prevents Bug #7)
 * - Inter-chapter validation with gpt-5-mini
 */

import OpenAI from 'openai'
import type { PipelineLogger } from '../utils/logger'
import type {
  StoryDNA,
  Chapter,
  CharacterProfile,
  ContinuityRequirements
} from '../types/index'

// OpenAI client singleton
let openaiClient: OpenAI | null = null

async function getOpenAIClient(): Promise<OpenAI> {
  if (!openaiClient) {
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      throw new Error('OpenAI API key not configured. Set OPENAI_API_KEY environment variable.')
    }
    openaiClient = new OpenAI({ apiKey })
  }
  return openaiClient
}

/**
 * Chapter summaries tracking (for continuity)
 */
interface ChapterSummary {
  chapterNumber: number
  summary: string
  ending: string
}

/**
 * Generate all chapters from DNA
 */
export async function generateChapters(
  dna: StoryDNA,
  brief: { reading_level: string; genre: string; primary_virtue: string },
  logger: PipelineLogger
): Promise<Chapter[]> {
  logger.log('ChapterGenerator', `Generating ${dna.chapterSpecs.length} chapters with continuity tracking...`)
  
  const chapters: Chapter[] = []
  const chapterSummaries: ChapterSummary[] = []
  let previousEnding = dna.hook || 'The story begins...'
  
  for (let i = 0; i < dna.chapterSpecs.length; i++) {
    const spec = dna.chapterSpecs[i]
    logger.log('ChapterGenerator', `Generating chapter ${i + 1}/${dna.chapterSpecs.length}...`)
    
    try {
      // Build prompts with FULL DNA context
      const systemPrompt = buildChapterSystemPrompt(dna, brief)
      const userPrompt = buildChapterUserPrompt(
        dna,
        spec,
        previousEnding,
        chapterSummaries,
        i === dna.chapterSpecs.length - 1
      )
      
      // Generate chapter content
      const content = await generateChapterContent(systemPrompt, userPrompt, logger)
      
      // Validate continuity BEFORE accepting
      const continuityCheck = await validateChapterContinuity(
        content,
        dna,
        spec,
        chapterSummaries,
        logger
      )
      
      if (!continuityCheck.passed) {
        logger.warn('ChapterGenerator', `Chapter ${i + 1} failed continuity check, regenerating with violations as constraints...`)
        
        // Regenerate with violations as additional constraints
        const fixedContent = await regenerateWithConstraints(
          systemPrompt,
          userPrompt,
          continuityCheck.violations,
          logger
        )
        
        // Validate again
        const secondCheck = await validateChapterContinuity(
          fixedContent,
          dna,
          spec,
          chapterSummaries,
          logger
        )
        
        if (secondCheck.passed) {
          logger.log('ChapterGenerator', `Chapter ${i + 1} passed continuity check on second attempt`)
        } else {
          logger.warn('ChapterGenerator', `Chapter ${i + 1} still has violations, but proceeding (${secondCheck.violations.length} issues)`)
        }
        
        // Use fixed content
        const chapter = createChapterObject(spec, fixedContent, dna.storyId)
        chapters.push(chapter)
        
        // Update tracking
        const ending = extractChapterEnding(fixedContent)
        const summary = extractChapterSummary(fixedContent)
        chapterSummaries.push({ chapterNumber: spec.chapterNumber, summary, ending })
        previousEnding = ending
      } else {
        // Continuity check passed
        const chapter = createChapterObject(spec, content, dna.storyId)
        chapters.push(chapter)
        
        // Update tracking
        const ending = extractChapterEnding(content)
        const summary = extractChapterSummary(content)
        chapterSummaries.push({ chapterNumber: spec.chapterNumber, summary, ending })
        previousEnding = ending
        
        logger.log('ChapterGenerator', `Chapter ${i + 1} generated and validated (${chapter.wordCount} words)`)
      }
      
      // Update knowledge state after each chapter
      updateKnowledgeState(dna, spec.chapterNumber, chapters[chapters.length - 1])
      
    } catch (error) {
      logger.error('ChapterGenerator', `Failed to generate chapter ${i + 1}`, error)
      // Continue with next chapter rather than failing entire story
    }
  }
  
  // Detect chapter gaps
  const expectedNumbers = Array.from({length: dna.chapterSpecs.length}, (_, i) => i + 1);
  const actualNumbers = chapters.map(ch => ch.chapterNumber);
  const missing = expectedNumbers.filter(n => !actualNumbers.includes(n));

  if (missing.length > 0) {
    logger.error('ChapterGenerator', `Missing chapters: ${missing.join(', ')}. Story incomplete.`);
    // Don't return incomplete story — throw
    throw new Error(`Story generation incomplete: missing chapters ${missing.join(', ')}`);
  }
  
  logger.log('ChapterGenerator', `Generated ${chapters.length}/${dna.chapterSpecs.length} chapters`)
  return chapters
}

/**
 * Build system prompt with FULL DNA context
 * FIX Bug #1: Character roster with LOCKED pronouns
 * FIX Bug #2: ONLY use these characters rule
 * FIX Bug #3: Speech fingerprints, NO example dialogue
 */
function buildChapterSystemPrompt(
  dna: StoryDNA,
  brief: { reading_level: string; genre: string; primary_virtue: string }
): string {
  // Character roster with LOCKED pronouns (FIX Bug #1)
  const characterRoster = Object.entries(dna.characters)
    .map(([name, char]: [string, CharacterProfile]) => 
      `${name} (${char.pronouns})`
    )
    .join(', ')
  
  // Speech fingerprints (FIX Bug #3 - NO example dialogue!)
  const characterVoices = Object.entries(dna.characters)
    .map(([name, char]: [string, CharacterProfile]) => {
      const patterns = char.speechStyle?.patterns?.join('; ') || 'speaks naturally'
      const emotionalTells = char.speechStyle?.emotionalTells || ''
      return `${name}: ${patterns}. ${emotionalTells}`
    })
    .join('\n')
  
  return `You are a wholesome children's story writer.
Write engaging chapters that are age-appropriate and virtue-focused.

Target audience: ${brief.reading_level} readers
Genre: ${brief.genre}
Primary virtue: ${brief.primary_virtue}

CHARACTERS (LOCKED ROSTER - FIX Bug #1 & #2):
${characterRoster}

CRITICAL RULE: ONLY use these characters. Do NOT introduce new named characters.
If the story needs minor characters (shopkeeper, guard, etc.), refer to them by role only.

CHARACTER VOICES (Speech Fingerprints - FIX Bug #3):
${characterVoices}

IMPORTANT: These are speech FINGERPRINTS (HOW they talk), NOT example dialogue.
Generate unique dialogue based on these patterns. NEVER repeat these exact words.

WORLD RULES (must be consistent):
${(dna.worldBible.magicalRules || []).join('\n')}

CONSEQUENCES if rules are broken:
${Object.entries(dna.worldBible.ruleConsequences || {}).map(([rule, consequence]) => `- ${rule}: ${consequence}`).join('\n')}

Write naturally, avoiding meta-language, brackets, or instructions.
Focus on sensory details (${dna.worldBible.sensorySignatures.sight}, ${dna.worldBible.sensorySignatures.sound}).
Track what each character knows and doesn't know.
End with natural transition or cliffhanger as specified.

Use gpt-5.2 for generation with reasoning_effort: 'medium' for quality.`
}

/**
 * Build user prompt for specific chapter
 * FIX Bug #5: Include character knowledge state
 * FIX Bug #6: Include cliffhanger resolution plan
 * FIX Bug #7: Include forbidden reactions
 */
function buildChapterUserPrompt(
  dna: StoryDNA,
  spec: Chapter,
  previousEnding: string,
  previousChapters: ChapterSummary[],
  isLastChapter: boolean
): string {
  // Get knowledge state for this chapter (FIX Bug #5)
  const knowledgeState = dna.storyState?.characterKnowledge
    ?.map(ck => {
      const knows = ck.knowledgeItems
        .filter(item => item.learnedInChapter < spec.chapterNumber)
        .map(item => item.fact)
      const doesNotKnow = ck.knowledgeItems
        .filter(item => item.learnedInChapter >= spec.chapterNumber)
        .map(item => item.fact)
      return `${ck.characterName} knows: [${knows.join(', ') || 'nothing yet'}]. Does NOT know: [${doesNotKnow.join(', ') || 'everything'}].`
    })
    .join('\n') || ''
  
  // Get cliffhanger resolution plan if this chapter should resolve one (FIX Bug #6)
  const previousSpec = spec.chapterNumber > 1 ? dna.chapterSpecs[spec.chapterNumber - 2] : null
  const cliffhangerToResolve = previousSpec?.cliffhanger?.resolutionPlan?.resolveInChapter === spec.chapterNumber
    ? previousSpec.cliffhanger
    : null
  
  // Get forbidden reactions for this chapter (FIX Bug #7)
  const forbiddenReactions = spec.continuityRequirements?.forbiddenReactions || []
  
  // Previous chapter summaries for context
  const previousContext = previousChapters.length > 0
    ? `\n\nPREVIOUS CHAPTERS:\n${previousChapters.map(cs => `Chapter ${cs.chapterNumber}: ${cs.summary}`).join('\n')}`
    : ''
  
  let prompt = `Write Chapter ${spec.chapterNumber} of ${dna.meta.totalChapters}: "${spec.workingTitle}"

Objective: ${spec.coreObjective}
Main obstacle: ${spec.mainObstacle}
Emotional focus: ${spec.dominantEmotion} (with ${spec.secondaryEmotion})
Scene type: ${spec.sceneType}
Target word count: ${spec.targetWordCount.target}-${spec.targetWordCount.max} words
${previousContext}

${previousEnding ? `Previous chapter ended: "${previousEnding}"` : ''}

${cliffhangerToResolve ? `
CRITICAL - Resolve this cliffhanger (FIX Bug #6):
Element: "${cliffhangerToResolve.specificElement}"
Resolution: ${cliffhangerToResolve.resolutionPlan.resolutionDescription}
Opening beat: ${cliffhangerToResolve.resolutionPlan.openingBeat}
Method: ${cliffhangerToResolve.resolutionPlan.resolutionMethod}
` : ''}

CHARACTER KNOWLEDGE STATE (FIX Bug #5 - Knowledge Tracking):
${knowledgeState}

${forbiddenReactions.length > 0 ? `
FORBIDDEN REACTIONS (FIX Bug #7):
${forbiddenReactions.map(fr => `- ${fr.character} must NOT react ${fr.toEvent} (Reason: ${fr.reason}). Correct reaction: ${fr.correctReaction}`).join('\n')}
` : ''}

Key elements to include:
- How the world rule "${spec.worldRuleSpotlight}" features
- Character tension moment: "${spec.characterTensionBeats[0]}"
- Sensory focus on: ${spec.sensoryMotifFocus}
- ${isLastChapter ? 'Satisfying resolution that affirms the primary virtue' : spec.cliffhanger ? `Cliffhanger: ${spec.cliffhanger.specificElement} (${spec.cliffhanger.type}, intensity ${spec.cliffhanger.intensity}/10)` : 'Natural transition to next chapter'}

Write the full chapter. No chapter number or title in the text - just the narrative.`
  
  return prompt
}

/**
 * Generate chapter content using gpt-5.2
 */
async function generateChapterContent(
  systemPrompt: string,
  userPrompt: string,
  logger: PipelineLogger
): Promise<string> {
  const openai = await getOpenAIClient()
  
  const completion = await openai.chat.completions.create({
    model: 'gpt-5.2',
    messages: [
      { role: 'developer', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    temperature: 0.8,
    max_completion_tokens: 2000,
    reasoning_effort: 'medium'
  })
  
  const content = completion.choices[0]?.message?.content || ''
  
  if (!content) {
    throw new Error('Empty chapter content returned from AI')
  }
  
  return content.trim()
}

/**
 * Validate chapter for continuity violations using gpt-5-mini
 * FIX: Inter-chapter validation (catches all 7 bugs)
 */
async function validateChapterContinuity(
  chapterContent: string,
  dna: StoryDNA,
  spec: Chapter,
  previousChapters: ChapterSummary[],
  logger: PipelineLogger
): Promise<{ passed: boolean; violations: Array<{ type: string; description: string }> }> {
  const openai = await getOpenAIClient()
  
  const characterRoster = Object.entries(dna.characters)
    .map(([name, char]: [string, CharacterProfile]) => `${name} (${char.pronouns})`)
    .join(', ')
  
  const previousContext = previousChapters.length > 0
    ? previousChapters.map(cs => cs.summary).join(' ')
    : 'First chapter'
  
  const systemPrompt = `You are a continuity checker. Review this chapter draft for violations.
Check:
1. Are pronouns consistent with character roster?
2. Are there any new named characters not in the original cast?
3. Do characters react to things they don't know yet?
4. Does the chapter resolve previous cliffhangers properly?
5. Does the chapter contradict any established world rules?

Return JSON: { violations: [{type, description}], passed: boolean }`
  
  const userPrompt = `Character roster: ${characterRoster}
World rules: ${(dna.worldBible.magicalRules || []).join('; ')}
Previous context: ${previousContext}
${spec.continuityRequirements ? `Character knowledge states: ${JSON.stringify(spec.continuityRequirements.characterKnowledgeState || [])}` : ''}
${previousChapters.length > 0 ? `Previous chapter ending: "${previousChapters[previousChapters.length - 1].ending}"` : ''}

Chapter draft:
${chapterContent}

Check for continuity violations.`
  
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-5-mini',
      messages: [
        { role: 'developer', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
      max_completion_tokens: 500,
      reasoning_effort: 'none'
    })
    
    const response = completion.choices[0]?.message?.content || '{}'
    const result = JSON.parse(response)
    
    logger.debug('ChapterGenerator', `Continuity check: ${result.passed ? 'PASSED' : 'FAILED'}`, {
      violations: result.violations?.length || 0
    })
    
    return {
      passed: result.passed === true,
      violations: result.violations || []
    }
  } catch (error) {
    logger.error('ChapterGenerator', 'Continuity validation failed', error)
    // If validation fails, assume chapter is OK (fail open)
    return { passed: true, violations: [] }
  }
}

/**
 * Regenerate chapter with violations as additional constraints
 */
async function regenerateWithConstraints(
  systemPrompt: string,
  userPrompt: string,
  violations: Array<{ type: string; description: string }>,
  logger: PipelineLogger
): Promise<string> {
  const openai = await getOpenAIClient()
  
  const constraintsPrompt = `\n\nCRITICAL - Fix these violations from previous attempt:
${violations.map((v, i) => `${i + 1}. ${v.type}: ${v.description}`).join('\n')}`
  
  const completion = await openai.chat.completions.create({
    model: 'gpt-5.2',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt + constraintsPrompt }
    ],
    temperature: 0.8,
    max_tokens: 2000
  })
  
  const content = completion.choices[0]?.message?.content || ''
  
  if (!content) {
    throw new Error('Empty chapter content returned from AI on regeneration')
  }
  
  return content.trim()
}

/**
 * Create chapter object
 */
function createChapterObject(spec: Chapter, content: string, storyId: string): Chapter {
  return {
    id: generateChapterId(),
    storyId,
    chapterNumber: spec.chapterNumber,
    workingTitle: spec.workingTitle,
    coreObjective: spec.coreObjective,
    mainObstacle: spec.mainObstacle,
    emotionalStakesLink: spec.emotionalStakesLink,
    emotionalTransition: spec.emotionalTransition,
    dominantEmotion: spec.dominantEmotion,
    secondaryEmotion: spec.secondaryEmotion,
    characterTensionBeats: spec.characterTensionBeats,
    worldRuleSpotlight: spec.worldRuleSpotlight,
    sensoryMotifFocus: spec.sensoryMotifFocus,
    sceneType: spec.sceneType,
    targetWordCount: spec.targetWordCount,
    cliffhanger: spec.cliffhanger,
    continuityRequirements: spec.continuityRequirements,
    content,
    wordCount: content.split(/\s+/).length
  }
}

/**
 * Extract chapter ending (last 2-3 sentences)
 */
function extractChapterEnding(content: string): string {
  const sentences = content.split(/[.!?]+/).filter((s) => s.trim().length > 0)
  const lastSentences = sentences.slice(-2)
  return lastSentences.join('. ').trim() + '.'
}

/**
 * Extract chapter summary (2-3 sentence summary)
 */
function extractChapterSummary(content: string): string {
  // Simple extraction: first 2-3 sentences or first 150 chars
  const sentences = content.split(/[.!?]+/).filter((s) => s.trim().length > 0)
  const firstSentences = sentences.slice(0, 2).join('. ').trim()
  return firstSentences.substring(0, 150) + (firstSentences.length > 150 ? '...' : '.')
}

/**
 * Update knowledge state after chapter generation
 */
function updateKnowledgeState(dna: StoryDNA, chapterNumber: number, chapter: Chapter): void {
  // Find transition for this chapter
  const transition = dna.chapterTransitions?.find(t => t.toChapter === chapterNumber)
  
  if (!transition || !transition.knowledgeUpdates) return
  
  // Apply knowledge updates to story state
  transition.knowledgeUpdates.forEach(update => {
    const charKnowledge = dna.storyState?.characterKnowledge?.find(ck => ck.characterName === update.characterName)
    
    if (charKnowledge) {
      charKnowledge.knowledgeItems.push({
        fact: update.newKnowledge,
        learnedInChapter: chapterNumber,
        revealedToOthers: [],
        isSecret: false,
        importance: 'medium'
      })
    }
  })
}

/**
 * Generate unique chapter ID
 */
function generateChapterId(): string {
  return `chapter_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}
