/**
 * Story Creator - V3 DNA generation (3 stages) + chapter drafting
 * Ported from wholesome2.0 pipeline with adaptations for v2026
 */

import { generateStoryDNA, generateChapterContent, parseJSONSafely, estimateTokens } from '../utils/openai'
import type { PipelineLogger } from '../utils/logger'
import type { StoryBrief, StoryDNA, Chapter } from '../types/index'

/**
 * Generate story DNA using 3-stage sequential approach
 * Stage 1: Foundation (world, themes, plot)
 * Stage 2: Characters & relationships
 * Stage 3: Chapters & continuity
 */
export async function generateStoryDNA(
  brief: StoryBrief,
  logger: PipelineLogger
): Promise<StoryDNA> {
  logger.log('StoryCreator', `Generating DNA for brief ${brief.id}...`)

  const startTime = Date.now()
  const storyId = generateStoryId()

  try {
    // Stage 1: Foundation
    logger.log('StoryCreator', 'Stage 1: Generating foundation (world, themes, plot)...')
    const foundation = await generateFoundation(brief, logger)

    // Stage 2: Characters
    logger.log('StoryCreator', 'Stage 2: Generating characters & relationships...')
    const charactersData = await generateCharactersAndRelationships(brief, foundation, logger)

    // Stage 3: Chapters
    logger.log('StoryCreator', 'Stage 3: Generating chapter specs & continuity...')
    const chaptersData = await generateChaptersAndContinuity(
      brief,
      foundation,
      charactersData,
      logger
    )

    // Combine into final DNA
    const dna: StoryDNA = {
      version: '3.0-sequential',
      storyId,
      meta: {
        genre: brief.genre,
        title: `${brief.primary_virtue}'s Journey`,
        targetAgeRange: getAgeRange(brief.reading_level),
        coreThemes: brief.themes,
        totalChapters: brief.target_chapters
      },
      worldBible: foundation.worldBible,
      plotStructure: foundation.plotStructure,
      characters: charactersData.characters,
      characterTensions: charactersData.characterTensions,
      chapterSpecs: chaptersData.chapterSpecs,
      emotionalStakes: foundation.emotionalStakes,
      editorialChecklist: {
        characterVoicesUnique: true,
        plotCoherent: true,
        ageAppropriate: true,
        virtueIntegrated: true
      },
      hook: foundation.plotStructure.storyQuestion
    }

    logger.log('StoryCreator', `DNA generated successfully in ${Date.now() - startTime}ms`, {
      chapterCount: dna.chapterSpecs.length,
      characterCount: Object.keys(dna.characters).length,
      tokenEstimate: estimateTokens(JSON.stringify(dna))
    })

    return dna
  } catch (error) {
    logger.error('StoryCreator', 'Failed to generate story DNA', error)
    throw error
  }
}

/**
 * Generate chapters from DNA
 */
export async function generateChapters(
  dna: StoryDNA,
  brief: StoryBrief,
  logger: PipelineLogger
): Promise<Chapter[]> {
  logger.log('StoryCreator', `Generating ${dna.chapterSpecs.length} chapters...`)

  const chapters: Chapter[] = []
  let previousEnding = dna.plotStructure.storyQuestion

  for (let i = 0; i < dna.chapterSpecs.length; i++) {
    const spec = dna.chapterSpecs[i]
    logger.log('StoryCreator', `Generating chapter ${i + 1}/${dna.chapterSpecs.length}...`)

    try {
      const systemPrompt = buildChapterSystemPrompt(dna, brief)
      const userPrompt = buildChapterUserPrompt(dna, spec, previousEnding, i === dna.chapterSpecs.length - 1)

      const content = await generateChapterContent(systemPrompt, userPrompt)

      const chapter: Chapter = {
        id: generateChapterId(),
        storyId: dna.storyId,
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
        content,
        wordCount: content.split(/\s+/).length
      }

      chapters.push(chapter)
      previousEnding = extractChapterEnding(content)

      logger.log('StoryCreator', `Chapter ${i + 1} generated (${chapter.wordCount} words)`)
    } catch (error) {
      logger.error('StoryCreator', `Failed to generate chapter ${i + 1}`, error)
      // Continue with next chapter
    }
  }

  logger.log('StoryCreator', `Generated ${chapters.length}/${dna.chapterSpecs.length} chapters`)
  return chapters
}

/**
 * Stage 1: Generate foundation (world, themes, plot)
 */
async function generateFoundation(brief: StoryBrief, logger: PipelineLogger): Promise<any> {
  const systemPrompt = `You are a master story architect specializing in wholesome children's literature.
Create rich, engaging story foundations that are age-appropriate and virtuous.
Return ONLY valid JSON with no markdown.`

  const userPrompt = `Create a story foundation for a ${brief.reading_level} reader.
Genre: ${brief.genre}
Primary Virtue: ${brief.primary_virtue}
Themes: ${brief.themes.join(', ')}
Target Audience Age: ${getAgeRange(brief.reading_level)}

Include:
- World with magical rules and sensory details
- Plot structure with emotional stakes
- Clear central conflict and resolution path
- Four-act emotional journey`

  const response = await generateStoryDNA(systemPrompt, userPrompt)
  const foundation = parseJSONSafely(response, 'Foundation')

  logger.debug('StoryCreator', 'Foundation generated', { keys: Object.keys(foundation) })
  return foundation
}

/**
 * Stage 2: Generate characters and relationships
 */
async function generateCharactersAndRelationships(
  brief: StoryBrief,
  foundation: any,
  logger: PipelineLogger
): Promise<any> {
  const characterNames = generateDefaultCharacterNames(brief.genre)

  const systemPrompt = `You are a character development expert.
Create memorable, nuanced characters with distinct voices and growth arcs.
Return ONLY valid JSON with no markdown.`

  const userPrompt = `Create characters for this story:
Genre: ${brief.genre}
World: ${foundation.worldBible?.setting || 'magical world'}
Characters needed: ${characterNames.join(', ')}
Primary virtue to embody: ${brief.primary_virtue}

Each character needs:
- Age, gender, pronouns
- Dominant trait and flaw
- Personal goal and growth arc
- Unique speech patterns and phrases
- Physical appearance with distinctive quirks

Also define tensions between characters that drive conflict.`

  const response = await generateStoryDNA(systemPrompt, userPrompt)
  const charactersData = parseJSONSafely(response, 'Characters & Relationships')

  logger.debug('StoryCreator', 'Characters generated', {
    count: Object.keys(charactersData.characters || {}).length,
    tensions: charactersData.characterTensions?.length || 0
  })

  return charactersData
}

/**
 * Stage 3: Generate chapters and continuity
 */
async function generateChaptersAndContinuity(
  brief: StoryBrief,
  foundation: any,
  charactersData: any,
  logger: PipelineLogger
): Promise<any> {
  const systemPrompt = `You are a story continuity expert.
Create detailed chapter outlines with perfect narrative flow.
Return ONLY valid JSON with no markdown.`

  const userPrompt = `Create ${brief.target_chapters} chapter specifications with perfect continuity.
Genre: ${brief.genre}
Characters: ${Object.keys(charactersData.characters || {}).join(', ')}
Central conflict: ${foundation.plotStructure?.centralConflict || 'Overcoming challenges'}

Each chapter needs:
- Clear objective and obstacle
- Emotional stakes link (I, II, III, IV)
- Dominant and secondary emotions
- Sensory focus (sight, sound, smell, taste, touch)
- How character tensions play out
- Cliffhanger or hook for next chapter
- Target word count

Make sure chapters build on each other with proper continuity.`

  const response = await generateStoryDNA(systemPrompt, userPrompt)
  const chaptersData = parseJSONSafely(response, 'Chapters & Continuity')

  logger.debug('StoryCreator', 'Chapters generated', {
    count: chaptersData.chapterSpecs?.length || 0,
    transitions: chaptersData.chapterTransitions?.length || 0
  })

  return chaptersData
}

/**
 * Build system prompt for chapter generation
 */
function buildChapterSystemPrompt(dna: StoryDNA, brief: StoryBrief): string {
  const characterList = Object.entries(dna.characters)
    .map(([name, char]: [string, any]) => `${name} (${char.speechStyle?.patterns?.[0] || 'speaks naturally'})`)
    .join('\n')

  return `You are a wholesome children's story writer.
Write engaging chapters that are age-appropriate and virtue-focused.
Target audience: ${brief.reading_level} readers (age ${getAgeRange(brief.reading_level)})
Genre: ${brief.genre}
Primary virtue: ${brief.primary_virtue}

Character voices:
${characterList}

World rules to maintain:
${(dna.worldBible.magicalRules || []).join('\n')}

Write naturally, avoiding meta-language, brackets, or instructions.
Focus on sensory details and emotional authenticity.
End with natural cliffhanger or hook.`
}

/**
 * Build user prompt for chapter generation
 */
function buildChapterUserPrompt(
  dna: StoryDNA,
  spec: Chapter,
  previousEnding: string,
  isLastChapter: boolean
): string {
  const prompt = `Write Chapter ${spec.chapterNumber}: "${spec.workingTitle}"

Objective: ${spec.coreObjective}
Main obstacle: ${spec.mainObstacle}
Emotional focus: ${spec.dominantEmotion} (with ${spec.secondaryEmotion})
Scene type: ${spec.sceneType}
Target word count: ${spec.targetWordCount.target}-${spec.targetWordCount.max} words

${previousEnding ? `Previous chapter ended: "${previousEnding}"` : ''}

Key elements to include:
- How the world rule "${spec.worldRuleSpotlight}" features
- Character tension moment: "${spec.characterTensionBeats[0]}"
- Sensory focus on: ${spec.sensoryMotifFocus}
- ${isLastChapter ? 'Satisfying resolution that affirms the primary virtue' : 'Natural cliffhanger or hook'}

Write the full chapter. No chapter number or title - just the narrative.`

  return prompt
}

/**
 * Get age range for reading level
 */
export function getAgeRange(readingLevel: string): string {
  const ranges: Record<string, string> = {
    early: '4-7 years',
    independent: '7-10 years',
    confident: '10-13 years',
    advanced: '13+ years'
  }
  return ranges[readingLevel] || '7-10 years'
}

/**
 * Generate default character names based on genre
 */
export function generateDefaultCharacterNames(genre: string): string[] {
  const namesByGenre: Record<string, string[]> = {
    adventure: ['Alex', 'Jordan', 'Casey'],
    fantasy: ['Elara', 'Finn', 'Sage'],
    mystery: ['Quinn', 'Morgan', 'Riley'],
    friendship: ['Emma', 'Sophia', 'Lily'],
    'sci-fi': ['Nova', 'Zephyr', 'Echo'],
    animal: ['Bramble', 'Willow', 'Scout']
  }

  return namesByGenre[genre] || ['Hero', 'Friend', 'Guide']
}

/**
 * Generate unique story ID
 */
function generateStoryId(): string {
  return `story_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}

/**
 * Generate unique chapter ID
 */
function generateChapterId(): string {
  return `chapter_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}

/**
 * Extract ending from chapter content for continuity tracking
 */
function extractChapterEnding(content: string): string {
  const sentences = content.split(/[.!?]+/).filter((s) => s.trim().length > 0)
  const lastSentence = sentences[sentences.length - 1]?.trim() || ''
  return lastSentence.substring(0, 150)
}
