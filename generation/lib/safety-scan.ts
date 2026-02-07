/**
 * Safety Scan — Binary pass/fail safety checks
 * Per PRD Section 9.2
 */

import { StoryDNA, Chapter, SafetyScanResult } from '../types';
import { executeCompletion, parseJSONSafely } from '../utils/openai';
import { PipelineLogger } from '../utils/logger';

const SAFETY_CRITERIA = [
  'No violence beyond age level',
  'No death of main characters (for early/independent readers)',
  'No mature romantic content',
  'No substance references',
  'No self-harm or dangerous behavior',
  'No discriminatory content',
  'No horror or extreme fear elements',
  'No profanity or crude language',
];

/**
 * Run binary safety scan
 * Any fail = auto-reject
 */
export async function runSafetyScan(
  dna: StoryDNA,
  chapters: Chapter[],
  logger: PipelineLogger
): Promise<SafetyScanResult> {
  logger.log('SAFETY_SCAN', 'Running safety assessment');
  
  const fullText = chapters.map(ch => ch.content).join('\n\n');
  
  const prompt = `Perform a safety scan on this children's story for ages ${dna.meta.targetAgeRange}.

**Reading Level:** ${dna.meta.readingLevel}
**Story Title:** ${dna.meta.title}

**Safety Criteria (ALL must pass):**
${SAFETY_CRITERIA.map((c, i) => `${i + 1}. ${c}`).join('\n')}

**Full Story Text:**
${fullText}

For each criterion, check if the story passes. Report ANY violations.

Return JSON:
{
  "passed": <true/false>,
  "issues": [
    {
      "type": "<criterion violated>",
      "severity": "critical" | "warning",
      "description": "<what was found>",
      "location": "<chapter number or section>"
    }
  ]
}`;

  const response = await executeCompletion({
    model: 'gpt-5-mini',
    messages: [
      { role: 'developer', content: 'You are a children\'s content safety expert.' },
      { role: 'user', content: prompt }
    ],
    response_format: { type: 'json_object' },
  });
  
  const result = parseJSONSafely<any>(response, 'Safety Scan');
  
  const passed = result.passed && result.issues.length === 0;
  
  logger.log('SAFETY_SCAN', 'Safety scan complete', {
    passed,
    issues: result.issues?.length || 0,
  });
  
  return {
    passed,
    flags: result.issues?.map((i: any) => `${i.type}: ${i.description}`) || [],
    timestamp: new Date().toISOString(),
    checks: SAFETY_CRITERIA.map((criterion, i) => ({
      name: criterion,
      passed: !result.issues.some((issue: any) => issue.criterion === i + 1),
      issue: result.issues.find((issue: any) => issue.criterion === i + 1)?.description,
    })),
    issues: result.issues?.map((i: any) => `${i.type}: ${i.description}`) || [],
  };
}
