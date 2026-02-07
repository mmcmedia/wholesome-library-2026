/**
 * Output Validator — Local text scanning for consistency violations
 * Catches issues that AI validation might miss
 */

export interface ValidationResult {
  passed: boolean
  violations: Array<{
    type: 'pronoun_mismatch' | 'unknown_character' | 'word_count' | 'reading_level'
    description: string
    severity: 'error' | 'warning'
  }>
}

/**
 * Validate chapter output against DNA constraints
 */
export function validateChapterOutput(
  content: string,
  characters: Record<string, { name: string; pronouns: string }>,
  chapterSpec: { targetWordCount: { min: number; max: number; target: number } },
  readingLevel: string
): ValidationResult {
  const violations: ValidationResult['violations'] = []
  
  // 1. Pronoun consistency check
  // Strategy: For each character, find sentences where they're the SUBJECT
  // (name appears early in sentence) and check if the NEXT pronoun matches.
  // Skip sentences with multiple character names (ambiguous reference).
  const allCharNames = Object.keys(characters)
  
  for (const [name, char] of Object.entries(characters)) {
    const pronounParts = char.pronouns.split('/')
    const subjectPronoun = pronounParts[0] // "she", "he", "they"
    
    const sentences = content.split(/[.!?]+/)
    for (const sentence of sentences) {
      if (!sentence.includes(name)) continue
      
      // Skip sentences mentioning multiple characters (pronoun could refer to either)
      const otherCharsInSentence = allCharNames.filter(n => n !== name && sentence.includes(n))
      if (otherCharsInSentence.length > 0) continue
      
      // Only flag if the character is the SUBJECT (name appears in first half of sentence)
      const nameIndex = sentence.indexOf(name)
      if (nameIndex > sentence.length * 0.6) continue
      
      // Check pronouns AFTER the name mention
      const afterName = sentence.substring(nameIndex + name.length)
      const wrongPronouns = getWrongPronouns(subjectPronoun)
      for (const wrong of wrongPronouns) {
        const regex = new RegExp(`\\b${wrong}\\b`, 'i')
        if (regex.test(afterName)) {
          violations.push({
            type: 'pronoun_mismatch',
            description: `Possible pronoun mismatch for ${name} (${char.pronouns}): found "${wrong}" after their name (sole character in sentence)`,
            severity: 'warning'
          })
        }
      }
    }
  }
  
  // 2. Unknown character check
  const knownNames = new Set(Object.keys(characters).map(n => n.toLowerCase()))
  // Extract capitalized words that look like names (2+ occurrences)
  const namePattern = /\b([A-Z][a-z]{2,})\b/g
  const foundNames: Record<string, number> = {}
  let match
  while ((match = namePattern.exec(content)) !== null) {
    const word = match[1]
    // Skip common words that are capitalized (sentence starts, etc.)
    if (isCommonWord(word)) continue
    foundNames[word] = (foundNames[word] || 0) + 1
  }
  
  for (const [foundName, count] of Object.entries(foundNames)) {
    if (count >= 2 && !knownNames.has(foundName.toLowerCase())) {
      // Check if it's a place name from worldBible (skip those)
      violations.push({
        type: 'unknown_character',
        description: `Possible unknown character "${foundName}" appears ${count} times (not in roster)`,
        severity: 'warning'
      })
    }
  }
  
  // 3. Word count check
  const wordCount = content.split(/\s+/).filter(w => w.length > 0).length
  if (wordCount < chapterSpec.targetWordCount.min) {
    violations.push({
      type: 'word_count',
      description: `Chapter is ${wordCount} words (minimum: ${chapterSpec.targetWordCount.min})`,
      severity: 'error'
    })
  }
  if (wordCount > chapterSpec.targetWordCount.max * 1.5) {
    violations.push({
      type: 'word_count',
      description: `Chapter is ${wordCount} words (maximum: ${chapterSpec.targetWordCount.max})`,
      severity: 'error'
    })
  }
  
  // 4. Reading level check (basic)
  if (readingLevel === 'early') {
    const avgWordLength = content.replace(/\s+/g, '').length / wordCount
    if (avgWordLength > 5.5) {
      violations.push({
        type: 'reading_level',
        description: `Average word length ${avgWordLength.toFixed(1)} chars is too high for early readers (target: <5.5)`,
        severity: 'warning'
      })
    }
    
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0)
    const avgSentenceLength = wordCount / sentences.length
    if (avgSentenceLength > 12) {
      violations.push({
        type: 'reading_level',
        description: `Average sentence length ${avgSentenceLength.toFixed(1)} words is too long for early readers (target: <12)`,
        severity: 'warning'
      })
    }
  }
  
  return {
    passed: !violations.some(v => v.severity === 'error'),
    violations
  }
}

function getWrongPronouns(correctSubject: string): string[] {
  const pronounSets: Record<string, string[]> = {
    'she': ['he', 'him', 'his', 'himself'],
    'he': ['she', 'her', 'hers', 'herself'],
    'they': ['he', 'him', 'his', 'himself', 'she', 'hers', 'herself']
  }
  return pronounSets[correctSubject.toLowerCase()] || []
}

function isCommonWord(word: string): boolean {
  const common = new Set([
    'The', 'But', 'And', 'Then', 'When', 'Where', 'What', 'How', 'Why',
    'After', 'Before', 'During', 'While', 'Once', 'Still', 'Just',
    'Maybe', 'Perhaps', 'Finally', 'Suddenly', 'Slowly', 'Quickly',
    'Chapter', 'Part', 'Inside', 'Outside', 'Above', 'Below'
  ])
  return common.has(word)
}
