#!/usr/bin/env node
/**
 * Entry point for story generation pipeline
 * Can be triggered manually or by cron
 * 
 * Usage:
 *   node run.ts                    # Process next queued brief
 *   node run.ts --auto-generate 10 # Generate 10 briefs first, then process one
 */

import { runPipeline } from './pipeline';
import { getNextBrief, autoGenerateBriefs } from './lib/brief-manager';
import { PipelineLogger, generateRunId } from './utils/logger';

async function main() {
  const logger = new PipelineLogger(generateRunId());
  
  try {
    // Parse command line args
    const args = process.argv.slice(2);
    
    if (args[0] === '--auto-generate') {
      const count = parseInt(args[1] || '10', 10);
      logger.log('MAIN', `Auto-generating ${count} briefs`);
      await autoGenerateBriefs(count, logger);
    }
    
    // Get next brief
    logger.log('MAIN', 'Fetching next queued brief');
    const brief = await getNextBrief(logger);
    
    if (!brief) {
      logger.log('MAIN', 'No queued briefs found - exiting');
      console.log('✓ No work to do');
      process.exit(0);
    }
    
    // Run pipeline
    logger.log('MAIN', 'Running pipeline', { briefId: brief.id });
    const result = await runPipeline(brief);
    
    // Log results
    if (result.status === 'success') {
      console.log('✓ Story generated successfully');
      console.log(`  Story ID: ${result.storyId}`);
      console.log(`  Duration: ${result.duration ? (result.duration / 1000).toFixed(1) : '?'}s`);
    } else {
      console.error('✗ Pipeline failed');
      console.error(`  Errors: ${result.errors.join(', ')}`);
      process.exit(1);
    }
  } catch (error: any) {
    logger.error('MAIN', 'Fatal error', error);
    console.error('✗ Fatal error:', error.message);
    process.exit(1);
  }
}

main();
