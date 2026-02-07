/**
 * Cover Generator — Generate cover art via Nano Banana (kie.ai)
 * Per PRD requirements and TOOLS.md documentation
 */

import { StoryDNA, CoverGenerationResult } from '../types';
import { PipelineLogger } from '../utils/logger';
import { writeFile, mkdir } from 'fs/promises';
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
      timestamp: new Date().toISOString(),
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
  const dir = join(process.cwd(), 'public', 'covers');
  await mkdir(dir, { recursive: true });
  const localPath = join(dir, filename);
  
  await writeFile(localPath, Buffer.from(buffer));
  
  return `/covers/${filename}`;
}

/**
 * Art direction for consistent library aesthetic
 */
const ART_DIRECTION = `Style: Modern children's book illustration, clean digital art with soft textures.
Color palette: warm and inviting, with rich saturated colors.
Composition: character-focused with environmental storytelling.
Mood: whimsical, welcoming, safe.
NO text, NO words, NO letters on the image.
Style reference: modern Pixar-meets-picture-book aesthetic, NOT anime, NOT photorealistic.`

/**
 * Build cover prompt from story DNA with consistent art direction
 */
function buildCoverPrompt(dna: StoryDNA): string {
  const characters = Object.entries(dna.characters).slice(0, 2)
    .map(([name, char]) => {
      const appearance = char.appearance?.look || 'a young person'
      return `${name} (${appearance})`
    })
    .join(' and ')
  
  const setting = dna.worldBible.setting
  const mood = dna.worldBible.atmosphere
  const genre = dna.meta.genre
  
  // Genre-specific scene suggestions
  const genreScenes: Record<string, string> = {
    adventure: 'standing at the threshold of discovery, looking ahead with determination',
    fantasy: 'surrounded by subtle magical elements, wonder on their face',
    mystery: 'examining a curious clue, spotlight of discovery',
    friendship: 'together sharing a meaningful moment',
    'sci-fi': 'in a futuristic environment with glowing technology',
    animal: 'alongside their animal companion in nature',
    sports: 'in an active, dynamic pose showing determination',
    nature: 'immersed in a beautiful natural landscape',
    humor: 'in a playful, lighthearted scene with visual comedy',
    historical: 'in a richly detailed period setting',
    'fairy-tale': 'in an enchanted, storybook-perfect scene',
    'everyday-hero': 'doing something brave in an ordinary setting'
  }
  
  const scene = genreScenes[genre] || 'in the middle of their adventure'
  
  return `Children's book cover illustration: ${characters} ${scene}, set in ${setting}. ${mood} atmosphere. ${ART_DIRECTION}`
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
    timestamp: new Date().toISOString(),
  };
}
