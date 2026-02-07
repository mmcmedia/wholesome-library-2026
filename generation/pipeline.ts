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
import { getTokenUsage, resetTokenUsage } from './utils/openai';
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
    
    // Stage 2: Chapter Drafting with V3 Continuity Tracking
    logger.log('PIPELINE', 'Stage 2: Chapter Drafting with Continuity Tracking');
    const chapterStart = Date.now();
    const chapters = await generateChapters(dna, brief, logger);
    log.stages.chapterDrafting = createStageLog('Chapter Drafting', chapterStart);
    
    // Stage 3: AI Editor Polish
    logger.log('PIPELINE', 'Stage 3: AI Editor');
    const editorStart = Date.now();
    const { editedChapters, result: editorResult } = await runAIEditor(dna, chapters, logger);
    log.stages.polishPass = createStageLog('AI Editor', editorStart);
    
    // Stage 4: Quality Check
    logger.log('PIPELINE', 'Stage 4: Quality Check');
    const qualityResult = await runQualityCheck(dna, editedChapters, logger);
    const qualityStart = Date.now();
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
    
    // Save story to database
    const storyId = await saveStory(dna, editedChapters, status, qualityResult, safetyResult, valuesResult, coverResult, logger);
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
  logger: PipelineLogger
): Promise<string> {
  logger.log('PIPELINE', 'Saving story to database');
  
  const supabase = getSupabaseClient();
  
  // Insert story
  const { data: story, error: storyError } = await supabase
    .from('stories')
    .insert({
      title: dna.meta.title,
      slug: slugify(dna.meta.title),
      blurb: dna.hook,
      reading_level: dna.meta.readingLevel,
      genre: dna.meta.genre,
      primary_virtue: dna.meta.coreThemes[0],
      secondary_virtues: dna.meta.coreThemes.slice(1),
      content_tags: [],
      chapter_count: chapters.length,
      total_word_count: chapters.reduce((sum, ch) => sum + ch.wordCount, 0),
      estimated_read_minutes: Math.ceil(chapters.reduce((sum, ch) => sum + ch.wordCount, 0) / 200),
      cover_image_url: cover.imageUrl,
      status,
      quality_score: quality.score,
      safety_passed: safety.passed,
      values_score: values.score,
      published_at: status === 'approved' ? new Date().toISOString() : null,
    })
    .select()
    .single();
  
  if (storyError) {
    throw new Error(`Failed to save story: ${storyError.message}`);
  }
  
  const storyId = story.id;
  
  // Insert chapters
  const chaptersToInsert = chapters.map(ch => ({
    story_id: storyId,
    chapter_number: ch.chapterNumber,
    title: ch.title,
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
}

/**
 * Simple slug generator
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}
