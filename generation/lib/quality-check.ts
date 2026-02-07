/**
 * Quality Check — Automated quality scoring (0-100)
 * Per PRD Section 9.1
 */

import { StoryDNA, Chapter, QualityCheckResult } from '../types';
import { executeCompletion, parseJSONSafely } from '../utils/openai';
import { PipelineLogger } from '../utils/logger';

/**
 * Run automated quality check on story
 * Returns score 0-100 with dimensional breakdown
 */
export async function runQualityCheck(
  dna: StoryDNA,
  chapters: Chapter[],
  logger: PipelineLogger
): Promise<QualityCheckResult> {
  logger.log('QUALITY_CHECK', 'Running automated quality assessment');
  
  const fullText = chapters.map(ch => ch.content).join('\n\n');
  
  const prompt = `Assess this children's story for quality across 5 dimensions.

**Story Title:** ${dna.meta.title}
**Reading Level:** ${dna.meta.readingLevel} (ages ${dna.meta.targetAgeRange})
**Genre:** ${dna.meta.genre}

**Full Story Text:**
${fullText}

Score each dimension:

1. **Narrative Coherence (0-25)**: Does the plot make sense? Are transitions smooth? Is the story arc complete?
2. **Character Consistency (0-20)**: Same names/personalities across chapters? Clear character arcs?
3. **Age Appropriateness (0-20)**: Vocabulary, sentence complexity, themes match ${dna.meta.readingLevel} level?
4. **Engagement (0-20)**: Would a kid want to keep reading? Compelling hooks? Satisfying resolution?
5. **Technical Quality (0-15)**: Grammar, spelling, formatting correct? Proper word count (~${dna.meta.totalChapters * 600}-${dna.meta.totalChapters * 1000} words)?

Return JSON:
{
  "narrativeCoherence": <0-25>,
  "characterConsistency": <0-20>,
  "ageAppropriateness": <0-20>,
  "engagement": <0-20>,
  "technicalQuality": <0-15>,
  "flags": [<array of specific issues>]
}`;

  const response = await executeCompletion({
    model: 'gpt-5-mini',
    messages: [
      { role: 'developer', content: 'You are a children\'s literature quality assessor.' },
      { role: 'user', content: prompt }
    ],
    response_format: { type: 'json_object' },
  });
  
  const scores = parseJSONSafely<any>(response, 'Quality Check');
  
  // Clamp each dimension to its max before summing
  const clampedNarrative = Math.min(Math.max(scores.narrativeCoherence || 0, 0), 25);
  const clampedCharacter = Math.min(Math.max(scores.characterConsistency || 0, 0), 20);
  const clampedAge = Math.min(Math.max(scores.ageAppropriateness || 0, 0), 20);
  const clampedEngagement = Math.min(Math.max(scores.engagement || 0, 0), 20);
  const clampedTechnical = Math.min(Math.max(scores.technicalQuality || 0, 0), 15);
  
  const totalScore = clampedNarrative + clampedCharacter + clampedAge + clampedEngagement + clampedTechnical;
  const passed = totalScore >= 70;
  
  logger.log('QUALITY_CHECK', 'Quality check complete', {
    score: totalScore,
    passed,
    flags: scores.flags?.length || 0,
  });
  
  return {
    score: totalScore,
    dimensions: {
      narrativeCoherence: clampedNarrative,
      characterConsistency: clampedCharacter,
      ageAppropriateness: clampedAge,
      engagement: clampedEngagement,
      technicalQuality: clampedTechnical,
    },
    passed,
    flags: scores.flags || [],
  };
}
