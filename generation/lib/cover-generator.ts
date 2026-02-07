/**
 * Cover Generator — Generate cover art via Nano Banana (kie.ai)
 * Per PRD requirements and TOOLS.md documentation
 */

import { StoryDNA, CoverGenerationResult } from '../types';
import { PipelineLogger } from '../utils/logger';
import { writeFile } from 'fs/promises';
import { join } from 'path';

const KIE_API_KEY = process.env.KIE_AI_API_KEY;
const KIE_BASE_URL = 'https://api.kie.ai/api/v1/jobs';

/**
 * Generate cover art using Nano Banana
 * Async workflow: createTask → poll → download
 */
export async function generateCover(
  dna: StoryDNA,
  logger: PipelineLogger
): Promise<CoverGenerationResult> {
  logger.log('COVER_GENERATION', 'Starting cover art generation');
  
  if (!KIE_API_KEY) {
    logger.error('COVER_GENERATION', 'KIE_AI_API_KEY not configured');
    return useFallbackCover(dna, logger);
  }
  
  try {
    // Step 1: Create task
    const taskId = await createCoverTask(dna, logger);
    
    // Step 2: Poll for completion
    const imageUrl = await pollForCompletion(taskId, logger);
    
    // Step 3: Download image
    const localPath = await downloadCover(imageUrl, dna.storyId, logger);
    
    logger.log('COVER_GENERATION', 'Cover generated successfully', { localPath });
    
    return {
      success: true,
      imageUrl,
      localPath,
      fallbackUsed: false,
    };
  } catch (error: any) {
    logger.error('COVER_GENERATION', 'Cover generation failed', error);
    return useFallbackCover(dna, logger);
  }
}

/**
 * Create cover generation task
 */
async function createCoverTask(dna: StoryDNA, logger: PipelineLogger): Promise<string> {
  const prompt = buildCoverPrompt(dna);
  
  logger.log('COVER_GENERATION', 'Creating Nano Banana task');
  
  const response = await fetch(`${KIE_BASE_URL}/createTask`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${KIE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'google/nano-banana',
      input: {
        prompt,
        output_format: 'png',
        image_size: '3:4', // Portrait for book cover
      },
    }),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to create task: ${response.statusText}`);
  }
  
  const data = await response.json();
  const taskId = data.data?.taskId;
  
  if (!taskId) {
    throw new Error('No taskId in response');
  }
  
  logger.log('COVER_GENERATION', 'Task created', { taskId });
  return taskId;
}

/**
 * Poll for task completion
 */
async function pollForCompletion(taskId: string, logger: PipelineLogger): Promise<string> {
  const maxAttempts = 30; // 30 attempts × 2s = 60s max
  const pollInterval = 2000; // 2 seconds
  
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    await new Promise(resolve => setTimeout(resolve, pollInterval));
    
    const response = await fetch(`${KIE_BASE_URL}/recordInfo?taskId=${taskId}`, {
      headers: {
        'Authorization': `Bearer ${KIE_API_KEY}`,
      },
    });
    
    if (!response.ok) {
      throw new Error(`Poll failed: ${response.statusText}`);
    }
    
    const data = await response.json();
    const state = data.data?.state;
    
    if (state === 'success') {
      const resultJson = JSON.parse(data.data?.resultJson || '{}');
      const imageUrl = resultJson.resultUrls?.[0];
      
      if (!imageUrl) {
        throw new Error('No image URL in result');
      }
      
      logger.log('COVER_GENERATION', 'Task completed', { attempt: attempt + 1 });
      return imageUrl;
    } else if (state === 'failed') {
      throw new Error('Cover generation task failed');
    }
    
    // Still generating...
  }
  
  throw new Error('Cover generation timed out after 60 seconds');
}

/**
 * Download cover image to local storage
 */
async function downloadCover(imageUrl: string, storyId: string, logger: PipelineLogger): Promise<string> {
  logger.log('COVER_GENERATION', 'Downloading cover image');
  
  const response = await fetch(imageUrl);
  
  if (!response.ok) {
    throw new Error(`Download failed: ${response.statusText}`);
  }
  
  const buffer = await response.arrayBuffer();
  
  // Save to project public directory
  const filename = `cover-${storyId}.png`;
  const localPath = join(process.cwd(), 'public', 'covers', filename);
  
  await writeFile(localPath, Buffer.from(buffer));
  
  return `/covers/${filename}`;
}

/**
 * Build cover prompt from story DNA
 */
function buildCoverPrompt(dna: StoryDNA): string {
  const characters = Object.keys(dna.characters).slice(0, 2).join(' and ');
  const setting = dna.worldBible.setting;
  const mood = dna.worldBible.atmosphere;
  
  return `A whimsical children's book cover illustration featuring ${characters} in ${setting}. ${mood} atmosphere. ${dna.meta.genre} style. Colorful, friendly, age-appropriate for ${dna.meta.targetAgeRange} year-olds. Professional book cover quality.`;
}

/**
 * Use genre template as fallback
 */
function useFallbackCover(dna: StoryDNA, logger: PipelineLogger): CoverGenerationResult {
  logger.log('COVER_GENERATION', 'Using genre template fallback');
  
  const genreCovers: Record<string, string> = {
    adventure: '/covers/template-adventure.png',
    fantasy: '/covers/template-fantasy.png',
    mystery: '/covers/template-mystery.png',
    friendship: '/covers/template-friendship.png',
    'sci-fi': '/covers/template-scifi.png',
  };
  
  const fallbackPath = genreCovers[dna.meta.genre.toLowerCase()] || '/covers/template-default.png';
  
  return {
    success: true,
    localPath: fallbackPath,
    fallbackUsed: true,
  };
}
