/**
 * Values Check — Values alignment scoring (1-5 scale)
 * Per PRD Section 9.3
 */

import { StoryDNA, Chapter, ValuesCheckResult } from '../types';
import { executeCompletion, parseJSONSafely } from '../utils/openai';
import { PipelineLogger } from '../utils/logger';

const VALUES_DIMENSIONS = [
  'Positive Role Models',
  'Consequence Logic',
  'Conflict Resolution',
  'Authority Respect',
  'Virtue Integration',
  'Hopeful Ending',
];

/**
 * Run values alignment check
 * Average below 3.0 = flagged for review
 */
export async function runValuesCheck(
  dna: StoryDNA,
  chapters: Chapter[],
  logger: PipelineLogger
): Promise<ValuesCheckResult> {
  logger.log('VALUES_CHECK', 'Running values alignment assessment');
  
  const fullText = chapters.map(ch => ch.content).join('\n\n');
  
  const prompt = `Assess this children's story for values alignment. Score each dimension 1-5.

**Story Title:** ${dna.meta.title}
**Target Virtue:** ${dna.meta.coreThemes[0]}

**Full Story Text:**
${fullText}

**Score 1-5 for each dimension:**

1. **Positive Role Models** (1=poor, 5=excellent): Do protagonists demonstrate virtues? Are they relatable?
2. **Consequence Logic** (1=poor, 5=excellent): Do actions have natural, appropriate consequences?
3. **Conflict Resolution** (1=poor, 5=excellent): Resolved through positive means (not violence)?
4. **Authority Respect** (1=poor, 5=excellent): Parents/teachers/mentors portrayed positively?
5. **Virtue Integration** (1=preachy, 5=natural): Is the virtue (${dna.meta.coreThemes[0]}) woven naturally, not forced?
6. **Hopeful Ending** (1=negative, 5=uplifting): Does the story end on a positive, growth-oriented note?

Return JSON:
{
  "positiveRoleModels": <1-5>,
  "consequenceLogic": <1-5>,
  "conflictResolution": <1-5>,
  "authorityRespect": <1-5>,
  "virtueIntegration": <1-5>,
  "hopefulEnding": <1-5>,
  "flags": [<array of concerns>]
}`;

  const response = await executeCompletion({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'You are a children\'s values education expert.' },
      { role: 'user', content: prompt }
    ],
    temperature: 0.3,
    response_format: { type: 'json_object' },
  });
  
  const scores = parseJSONSafely<any>(response, 'Values Check');
  
  const average =
    (scores.positiveRoleModels +
      scores.consequenceLogic +
      scores.conflictResolution +
      scores.authorityRespect +
      scores.virtueIntegration +
      scores.hopefulEnding) / 6;
  
  const passed = average >= 3.0;
  
  logger.log('VALUES_CHECK', 'Values check complete', {
    score: average.toFixed(2),
    passed,
    flags: scores.flags?.length || 0,
  });
  
  return {
    averageScore: parseFloat(average.toFixed(2)),
    dimensions: {
      positiveRoleModels: scores.positiveRoleModels,
      consequenceLogic: scores.consequenceLogic,
      conflictResolution: scores.conflictResolution,
      authorityRespect: scores.authorityRespect,
      virtueIntegration: scores.virtueIntegration,
      hopefulEnding: scores.hopefulEnding,
    },
    timestamp: new Date().toISOString(),
  };
}
