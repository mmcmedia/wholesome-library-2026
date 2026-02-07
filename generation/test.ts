#!/usr/bin/env node
/**
 * Quick test script to verify pipeline setup
 */

import { PipelineLogger, generateRunId } from './utils/logger.js';
import { getSupabaseClient } from './utils/supabase.js';
import { getOpenAIClient } from './utils/openai.js';
import { autoGenerateBriefs } from './lib/brief-manager.js';

async function test() {
  const logger = new PipelineLogger(generateRunId());
  
  console.log('🧪 Testing Wholesome Library Generation Pipeline...\n');
  
  // Test 1: Logger
  console.log('✓ Logger initialized');
  logger.log('TEST', 'Logger working');
  
  // Test 2: Supabase
  try {
    const supabase = getSupabaseClient();
    const { count, error } = await supabase
      .from('story_briefs')
      .select('*', { count: 'exact', head: true });
    
    if (error) throw error;
    console.log(`✓ Supabase connected (${count || 0} briefs in queue)`);
  } catch (error: any) {
    console.error('✗ Supabase failed:', error.message);
    process.exit(1);
  }
  
  // Test 3: OpenAI
  try {
    const openai = getOpenAIClient();
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: 'Say "test successful" in 2 words' }],
      max_tokens: 10,
    });
    
    const response = completion.choices[0]?.message?.content;
    console.log(`✓ OpenAI connected (response: "${response}")`);
  } catch (error: any) {
    console.error('✗ OpenAI failed:', error.message);
    process.exit(1);
  }
  
  // Test 4: Cover API (just check key exists)
  if (process.env.KIE_AI_API_KEY) {
    console.log('✓ kie.ai API key configured');
  } else {
    console.warn('⚠ kie.ai API key missing (covers will use fallback)');
  }
  
  console.log('\n✅ All tests passed! Pipeline is ready.\n');
  console.log('Next steps:');
  console.log('  1. Generate test briefs: npm run auto-generate');
  console.log('  2. Run pipeline: npm run generate');
}

test();
