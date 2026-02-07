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
import { generateStoryDNA, generateChapters } from './lib/story-creator';
import { runAIEditor } from './lib/ai-editor';
import { runQualityCheck } from './lib/quality-check';
import { runSafetyScan } from './lib/safety-scan';
import { runValuesCheck } from './lib/values-check';
import { generateCover } from './lib/cover-generator';

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
    briefId: brief.id,
    startedAt: new Date(),
    stages: {} as any,
    tokensUsed: { input: 0, output: 0, cost: 0 },
    result: 'failed',
  };
  
  try {
    // Mark brief as generating
    await markBriefGenerating(brief.id, logger);
    
    // Stage 1: DNA Generation
    logger.log('PIPELINE', 'Stage 1: DNA Generation');
    const dnaStart = Date.now();
    const dna = await generateStoryDNA(brief, logger);
    log.stages.dnaGeneration = {
      status: 'success',
      durationMs: Date.now() - dnaStart,
    };
    
    // Stage 2: Chapter Drafting
    logger.log('PIPELINE', 'Stage 2: Chapter Drafting');
    const chapterStart = Date.now();
    const chapters = await generateChapters(dna, logger);
    log.stages.chapterDrafting = {
      status: 'success',
      durationMs: Date.now() - chapterStart,
      chaptersGenerated: chapters.length,
    };
    
    // Stage 3: AI Editor Polish
    logger.log('PIPELINE', 'Stage 3: AI Editor');
    const editorStart = Date.now();
    const { editedChapters, result: editorResult } = await runAIEditor(dna, chapters, logger);
    log.stages.polishPass = {
      status: 'success',
      durationMs: Date.now() - editorStart,
    };
    
    // Stage 4: Quality Check
    logger.log('PIPELINE', 'Stage 4: Quality Check');
    const qualityResult = await runQualityCheck(dna, editedChapters, logger);
    log.stages.qualityCheck = {
      score: qualityResult.score,
      passed: qualityResult.passed,
    };
    
    // Stage 5: Safety Scan
    logger.log('PIPELINE', 'Stage 5: Safety Scan');
    const safetyResult = await runSafetyScan(dna, editedChapters, logger);
    log.stages.safetyCheck = {
      passed: safetyResult.passed,
      flags: safetyResult.flags,
    };
    
    // Stage 6: Values Check
    logger.log('PIPELINE', 'Stage 6: Values Check');
    const valuesResult = await runValuesCheck(dna, editedChapters, logger);
    log.stages.valuesCheck = {
      score: valuesResult.score,
      passed: valuesResult.passed,
    };
    
    // Stage 7: Cover Art
    logger.log('PIPELINE', 'Stage 7: Cover Generation');
    const coverStart = Date.now();
    const coverResult = await generateCover(dna, logger);
    log.stages.coverArt = {
      status: coverResult.success ? (coverResult.fallbackUsed ? 'fallback' : 'success') : 'failed',
      durationMs: Date.now() - coverStart,
    };
    
    // Determine story status based on QA results
    const status = determineStoryStatus(qualityResult, safetyResult, valuesResult);
    
    // Save story to database
    const storyId = await saveStory(dna, editedChapters, status, qualityResult, safetyResult, valuesResult, coverResult, logger);
    log.storyId = storyId;
    
    // Mark brief as completed
    await markBriefCompleted(brief.id, logger);
    
    log.result = 'success';
    log.completedAt = new Date();
    log.totalDurationMs = Date.now() - startTime;
    
    logger.log('PIPELINE', 'Pipeline completed successfully', {
      storyId,
      status,
      duration: log.totalDurationMs,
    });
    
    return log;
  } catch (error: any) {
    logger.error('PIPELINE', 'Pipeline failed', error);
    
    // Mark brief as failed
    await markBriefFailed(brief.id, error.message, logger);
    
    log.error = error.message;
    log.result = 'failed';
    log.completedAt = new Date();
    log.totalDurationMs = Date.now() - startTime;
    
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
