/**
 * AI Editor — Polish pass before human review
 * Per PRD Section 9.6
 */

import { StoryDNA, Chapter, AIEditorResult } from '../types';
import { executeCompletion, parseJSONSafely } from '../utils/openai';
import { PipelineLogger } from '../utils/logger';

/**
 * Run AI editor pass on the full story
 * Fixes technical issues, flags values concerns
 */
export async function runAIEditor(
  dna: StoryDNA,
  chapters: Chapter[],
  logger: PipelineLogger
): Promise<{ editedChapters: Chapter[]; result: AIEditorResult }> {
  logger.log('AI_EDITOR', 'Running AI editor pass');
  
  const fullText = chapters.map((ch, idx) => 
    `# Chapter ${idx + 1}: ${ch.workingTitle}\n\n${ch.content}`
  ).join('\n\n---\n\n');
  
  const prompt = `Edit this children's story for technical quality. DO NOT change plot or voice.

**Story Title:** ${dna.meta.title}
**Reading Level:** ${dna.meta.readingLevel}

**What to FIX:**
- Grammar, spelling, punctuation errors
- AI artifacts (meta-instructions, brackets, formatting glitches)
- Awkward phrasing or repetitive sentence structures
- Chapter transitions that feel abrupt
- Character name inconsistencies
- Dialogue tag errors or formatting issues

**What to FLAG (don't fix):**
- Potential values concerns (preachiness, negative role models)
- Safety questions (content that might be borderline)
- Character inconsistencies (personality shifts)

**What NOT to change:**
- Plot or story arc
- Character voices or tone
- Core narrative choices

**Full Story:**
${fullText}

Return JSON:
{
  "editedText": "<full edited story with chapter markers>",
  "changes": [
    {"type": "grammar|spelling|artifact|transition|consistency|formatting", "description": "<what was fixed>", "location": "Chapter X"}
  ],
  "flags": [
    {"type": "values_concern|safety_question|character_inconsistency", "description": "<issue>", "location": "Chapter X"}
  ]
}`;

  const response = await executeCompletion({
    model: 'gpt-5.2',
    messages: [
      { role: 'developer', content: 'You are an expert children\'s book editor.' },
      { role: 'user', content: prompt }
    ],
    temperature: 0.3,
    max_completion_tokens: 8000,
    response_format: { type: 'json_object' },
  });
  
  const editorResult = parseJSONSafely<any>(response, 'AI Editor');
  
  // Parse edited text back into chapters
  const editedChapters = parseEditedText(editorResult.editedText, chapters);
  
  logger.log('AI_EDITOR', 'AI editor complete', {
    changes: editorResult.changes?.length || 0,
    flags: editorResult.flags?.length || 0,
  });
  
  return {
    editedChapters,
    result: {
      success: true,
      editedContent: editorResult.editedText,
      changesApplied: (editorResult.changes || []).map((c: any) => c.description || c),
      flaggedConcerns: (editorResult.flags || []).map((f: any) => f.description || f),
      timestamp: new Date().toISOString(),
    },
  };
}

/**
 * Parse edited text back into chapter objects
 */
function parseEditedText(editedText: string, originalChapters: Chapter[]): Chapter[] {
  // Split on chapter markers
  const chapterSections = editedText.split(/# Chapter \d+:/);
  
  const editedChapters: Chapter[] = [];
  
  for (let i = 0; i < originalChapters.length; i++) {
    const original = originalChapters[i];
    const rawContent = chapterSections[i + 1] || original.content || '';
    const editedContent = rawContent
      .split('\n\n---\n\n')[0] // Remove separator
      .trim();
    
    editedChapters.push({
      ...original,
      content: editedContent,
      wordCount: editedContent.split(/\s+/).length,
    });
  }
  
  return editedChapters;
}
