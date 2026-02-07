/**
 * Main Pipeline Orchestrator
 * Runs the full story generation workflow: Brief → DNA → Chapters → QA → Review
 */

import { StoryBrief, PipelineRunLog } from './types';
import { PipelineLogger, generateRunId } from './utils/logger';
import { getSupabaseClient } from './utils/supabase';
import {
  getNextBrief,
  markBriefGenerating,
  markBriefCompleted,
  markBriefFailed,
} from './lib/brief-manager';
import { generateStoryDNA } from './lib/story-creator';
import { generateChapters } from './lib/chapter-generator';
import { runAIEditor } from './lib/ai-editor';
import { runQualityCheck } from './lib/quality-check';
import { runSafetyScan } from './lib/safety-scan';
import { runValuesCheck } from './lib/values-check';
import { generateCover } from './lib/cover-generator';
import { getTokenUsage, resetTokenUsage, parseJSONSafely, executeCompletion } from './utils/openai';
import type { StageLog } from './types';

/**
 * Helper to create a stage log entry
 */
function createStageLog(stageName: string, startTime: number, status: 'success' | 'failed' = 'success', error?: string): StageLog {
  const endTime = Date.now();
  return {
    stageName,
    status,
    startTime: new Date(startTime).toISOString(),
    endTime: new Date(endTime).toISOString(),
    duration: endTime - startTime,
    retryCount: 0,
    tokensUsed: 0,
    error,
  };
}

/**
 * Quick safety pre-check on DNA before spending tokens on chapters
 * Catches obvious issues early (~$0.001 vs wasting ~$0.50 on chapters)
 */
async function dnaSafetyPreCheck(dna: any, logger: PipelineLogger): Promise<boolean> {
  const prompt = `Quick safety check on this children's story plan.
Title: ${dna.meta.title}
Genre: ${dna.meta.genre}
Age range: ${dna.meta.targetAgeRange}
Setting: ${dna.worldBible.setting}
Conflict: ${dna.plotStructure.centralConflict}
Characters: ${Object.entries(dna.characters).map(([n, c]: [string, any]) => `${n}: ${c.dominantTrait}, flaw: ${c.flaw}`).join('; ')}
Themes: ${dna.meta.coreThemes.join(', ')}

Is this plan safe and appropriate for children ages ${dna.meta.targetAgeRange}? 
Check for: violence, scary content, mature themes, inappropriate conflict.
Return JSON: {"safe": true/false, "concern": "description if not safe"}`

  try {
    const response = await executeCompletion({
      model: 'gpt-5-mini',
      messages: [
        { role: 'developer', content: 'You are a children\'s content safety reviewer. Be conservative.' },
        { role: 'user', content: prompt }
      ],
      // NO temperature for gpt-5-mini!
      response_format: { type: 'json_object' },
      max_completion_tokens: 100
    })
    
    const result = parseJSONSafely<any>(response, 'Pipeline')
    
    if (!result.safe) {
      logger.error('PIPELINE', `DNA failed safety pre-check: ${result.concern}`)
    }
    
    return result.safe !== false
  } catch (error) {
    logger.warn('PIPELINE', 'DNA safety pre-check failed, proceeding anyway', error)
    return true // Fail open for pre-check (full safety scan comes later)
  }
}

/**
 * Run the full pipeline for a single story brief
 */
export async function runPipeline(brief: StoryBrief): Promise<PipelineRunLog> {
  const runId = generateRunId();
  const logger = new PipelineLogger(runId);
  const startTime = Date.now();
  
  logger.log('PIPELINE', 'Starting pipeline', { briefId: brief.id });
  
  const log: PipelineRunLog = {
    runId,
    storyId: '', // Will be set after DNA generation
    briefId: brief.id,
    startTime: new Date().toISOString(),
    stages: {} as PipelineRunLog['stages'],
    tokenUsage: { dnaTokens: 0, chapterTokens: 0, editorTokens: 0, qaTokens: 0, total: 0 },
    status: 'running',
    finalStatus: 'generating',
    errors: [],
  };
  
  try {
    // Reset token usage tracker at start of run
    resetTokenUsage();
    
    // Mark brief as generating
    await markBriefGenerating(brief.id, logger);
    
    // Stage 1: DNA Generation
    logger.log('PIPELINE', 'Stage 1: DNA Generation');
    const dnaStart = Date.now();
    const dna = await generateStoryDNA(brief, logger);
    log.stages.dnaGeneration = createStageLog('DNA Generation', dnaStart);
    
    // Pre-check DNA safety before spending tokens on chapters
    const dnaSafe = await dnaSafetyPreCheck(dna, logger);
    if (!dnaSafe) {
      await markBriefFailed(brief.id, 'DNA failed safety pre-check', logger);
      log.status = 'failed';
      log.errors.push('DNA failed safety pre-check');
      log.endTime = new Date().toISOString();
      log.duration = Date.now() - startTime;
      return log;
    }
    
    // Stage 2: Chapter Drafting with V3 Continuity Tracking
    logger.log('PIPELINE', 'Stage 2: Chapter Drafting with Continuity Tracking');
    const chapterStart = Date.now();
    const chapters = await generateChapters(dna, {
      reading_level: brief.reading_level,
      genre: brief.genre,
      primary_virtue: brief.primary_virtue,
      avoid_content: brief.avoid_content || []
    }, logger);
    log.stages.chapterDrafting = createStageLog('Chapter Drafting', chapterStart);
    
    // Stage 3: AI Editor Polish
    logger.log('PIPELINE', 'Stage 3: AI Editor');
    const editorStart = Date.now();
    const { editedChapters, result: editorResult } = await runAIEditor(dna, chapters, logger);
    log.stages.polishPass = createStageLog('AI Editor', editorStart);
    
    // Stage 4: Quality Check
    logger.log('PIPELINE', 'Stage 4: Quality Check');
    const qualityStart = Date.now();
    const qualityResult = await runQualityCheck(dna, editedChapters, logger);
    log.stages.qualityCheck = createStageLog('Quality Check', qualityStart);
    
    // Stage 5: Safety Scan
    logger.log('PIPELINE', 'Stage 5: Safety Scan');
    const safetyStart = Date.now();
    const safetyResult = await runSafetyScan(dna, editedChapters, logger);
    log.stages.safetyCheck = createStageLog('Safety Scan', safetyStart);
    
    // Stage 6: Values Check
    logger.log('PIPELINE', 'Stage 6: Values Check');
    const valuesStart = Date.now();
    const valuesResult = await runValuesCheck(dna, editedChapters, logger);
    log.stages.valuesCheck = createStageLog('Values Check', valuesStart);
    
    // Stage 7: Cover Art
    logger.log('PIPELINE', 'Stage 7: Cover Generation');
    const coverStart = Date.now();
    const coverResult = await generateCover(dna, logger);
    log.stages.coverArt = createStageLog('Cover Generation', coverStart, coverResult.success ? 'success' : 'failed');
    
    // Determine story status based on QA results
    const status = determineStoryStatus(qualityResult, safetyResult, valuesResult);
    
    // Generate AI-powered blurb (FIX 3)
    logger.log('PIPELINE', 'Generating story blurb...');
    const blurb = await generateBlurb(dna, editedChapters, logger);
    
    // Save story to database
    const storyId = await saveStory(dna, editedChapters, status, qualityResult, safetyResult, valuesResult, coverResult, blurb, logger);
    log.storyId = storyId;
    
    // Mark brief as completed
    await markBriefCompleted(brief.id, storyId, logger);
    
    // Get final token usage
    const tokenUsage = getTokenUsage();
    log.tokenUsage = {
      dnaTokens: tokenUsage.input + tokenUsage.output, // Rough estimate per stage
      chapterTokens: tokenUsage.input + tokenUsage.output,
      editorTokens: 0,
      qaTokens: 0,
      total: tokenUsage.total
    };
    
    log.status = 'success';
    log.endTime = new Date().toISOString();
    log.duration = Date.now() - startTime;
    
    logger.log('PIPELINE', 'Pipeline completed successfully', {
      storyId,
      status,
      duration: log.duration,
      tokensUsed: tokenUsage.total,
    });
    
    return log;
  } catch (error: any) {
    logger.error('PIPELINE', 'Pipeline failed', error);
    
    // Mark brief as failed
    await markBriefFailed(brief.id, error.message, logger);
    
    log.errors.push(error.message);
    log.status = 'failed';
    log.endTime = new Date().toISOString();
    log.duration = Date.now() - startTime;
    
    return log;
  }
}

/**
 * Generate AI-powered story blurb (FIX 3)
 */
async function generateBlurb(dna: any, chapters: any[], logger: PipelineLogger): Promise<string> {
  try {
    const firstChapter = chapters[0]?.content?.substring(0, 500) || '';
    
    const blurbResponse = await executeCompletion({
      model: 'gpt-5-mini',
      messages: [
        { 
          role: 'developer', 
          content: 'Write a 2-sentence blurb for this children\'s story. Make it enticing for parents browsing a library. No spoilers. Return JSON: {"blurb": "..."}' 
        },
        { 
          role: 'user', 
          content: `Title: ${dna.meta.title}\nGenre: ${dna.meta.genre}\nCharacters: ${Object.keys(dna.characters).join(', ')}\nSetting: ${dna.worldBible.setting}\nOpening: ${firstChapter}` 
        }
      ],
      // NO temperature for gpt-5-mini!
      response_format: { type: 'json_object' },
      max_completion_tokens: 150
    });
    
    const result = parseJSONSafely<any>(blurbResponse, 'Pipeline');
    return result.blurb || dna.hook || `A ${dna.meta.genre} story about ${Object.keys(dna.characters).slice(0, 2).join(' and ')}.`;
  } catch (error) {
    logger.warn('PIPELINE', 'Blurb generation failed, using fallback');
    return dna.hook || `A ${dna.meta.genre} story about ${Object.keys(dna.characters).slice(0, 2).join(' and ')}.`;
  }
}

/**
 * Determine story status based on QA results
 * Per PRD Section 9.5 (Editor Review Tiers)
 */
function determineStoryStatus(
  quality: any,
  safety: any,
  values: any
): 'approved' | 'editor_queue' | 'rejected' {
  // Auto-reject if safety fails
  if (!safety.passed) {
    return 'rejected';
  }
  
  // Auto-reject if quality < 70
  if (quality.score < 70) {
    return 'rejected';
  }
  
  // Auto-approve if quality >= 85 AND safety passed AND values >= 3.0
  if (quality.score >= 85 && safety.passed && values.score >= 3.0) {
    return 'approved';
  }
  
  // Otherwise, queue for editor review
  return 'editor_queue';
}

/**
 * Save story and chapters to Supabase
 */
async function saveStory(
  dna: any,
  chapters: any[],
  status: string,
  quality: any,
  safety: any,
  values: any,
  cover: any,
  blurb: string,
  logger: PipelineLogger
): Promise<string> {
  logger.log('PIPELINE', 'Saving story to database');
  
  const supabase = getSupabaseClient();
  
  // Generate unique slug
  const slug = await generateUniqueSlug(dna.meta.title, logger);
  
  // FIX 5: Schema pre-validation - validate BEFORE expensive insert
  const storyData = {
    title: dna.meta.title,
    slug,
    blurb,
    reading_level: dna.meta.readingLevel,
    genre: dna.meta.genre,
    primary_virtue: dna.meta.coreThemes[0],
    secondary_virtues: dna.meta.coreThemes.slice(1),
    content_tags: [],
    chapter_count: chapters.length,
    total_word_count: chapters.reduce((sum, ch) => sum + ch.wordCount, 0),
    estimated_read_minutes: Math.ceil(chapters.reduce((sum, ch) => sum + ch.wordCount, 0) / 200),
    cover_image_url: cover.localPath || cover.imageUrl || null,
    status,
    quality_score: quality.score,
    safety_passed: safety.passed,
    values_score: values.score,
    published_at: status === 'approved' ? new Date().toISOString() : null,
  };
  
  // Validate required string fields
  const requiredStrings: (keyof typeof storyData)[] = ['title', 'slug', 'reading_level', 'genre', 'primary_virtue', 'status'];
  for (const field of requiredStrings) {
    if (typeof storyData[field] !== 'string' || !storyData[field]) {
      throw new Error(`Schema validation failed BEFORE insert: ${field} must be a non-empty string (got: ${typeof storyData[field]})`);
    }
  }
  
  // Validate required number fields
  const requiredNumbers: (keyof typeof storyData)[] = ['chapter_count', 'total_word_count', 'quality_score', 'values_score'];
  for (const field of requiredNumbers) {
    if (typeof storyData[field] !== 'number' || isNaN(storyData[field] as number)) {
      throw new Error(`Schema validation failed BEFORE insert: ${field} must be a valid number (got: ${typeof storyData[field]})`);
    }
  }
  
  // Validate required boolean
  if (typeof storyData.safety_passed !== 'boolean') {
    throw new Error(`Schema validation failed BEFORE insert: safety_passed must be a boolean (got: ${typeof storyData.safety_passed})`);
  }
  
  logger.log('PIPELINE', 'Schema validation passed, proceeding with insert');
  
  // Insert story
  const { data: story, error: storyError } = await supabase
    .from('stories')
    .insert(storyData)
    .select()
    .single();
  
  if (storyError) {
    throw new Error(`Failed to save story: ${storyError.message}`);
  }
  
  const storyId = story.id;
  
  try {
    // Insert chapters
    const chaptersToInsert = chapters.map(ch => ({
      story_id: storyId,
      chapter_number: ch.chapterNumber,
      title: ch.workingTitle,
      content: ch.content,
      word_count: ch.wordCount,
    }));
    
    const { error: chaptersError } = await supabase
      .from('chapters')
      .insert(chaptersToInsert);
    
    if (chaptersError) {
      throw new Error(`Failed to save chapters: ${chaptersError.message}`);
    }
    
    // Insert DNA
    const { error: dnaError } = await supabase
      .from('story_dna')
      .insert({
        story_id: storyId,
        dna_data: dna,
        generation_version: dna.version,
      });
    
    if (dnaError) {
      throw new Error(`Failed to save DNA: ${dnaError.message}`);
    }
    
    logger.log('PIPELINE', 'Story saved', { storyId });
    
    return storyId;
  } catch (error) {
    // Cleanup: delete the story if chapters/DNA fail
    logger.error('PIPELINE', 'Partial save failed, cleaning up story', error);
    await supabase.from('stories').delete().eq('id', storyId);
    throw error;
  }
}

/**
 * Generate unique slug with collision detection
 */
async function generateUniqueSlug(title: string, logger: PipelineLogger): Promise<string> {
  const supabase = getSupabaseClient()
  let baseSlug = (title || 'untitled-story')
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
    .substring(0, 80) // Limit length
  
  // Ensure slug is never empty
  if (!baseSlug) baseSlug = 'untitled-story'
  
  let slug = baseSlug
  let suffix = 1
  
  // Check for collisions
  while (true) {
    const { data } = await supabase
      .from('stories')
      .select('id')
      .eq('slug', slug)
      .limit(1)
    
    if (!data || data.length === 0) break
    
    slug = `${baseSlug}-${suffix}`
    suffix++
    
    if (suffix > 100) {
      // Fallback to timestamp if too many collisions
      slug = `${baseSlug}-${Date.now()}`
      break
    }
  }
  
  logger.debug('PIPELINE', `Generated unique slug: ${slug}`)
  return slug
}
