# Story Consistency Requirements - V1 Production Bugs to Fix

**Context:** These are REAL bugs from Wholesome Library V1 production that led to poor story quality. The V3 consistency engine MUST prevent all of these.

---

## Bug #1: Pronoun Chaos
**Symptom:** Characters' pronouns changed mid-story  
**Example:** Jordan started as "she/her" but became "he/him" in Chapter 3

**Root Cause:** Prompts didn't explicitly lock pronouns per character

**V3 Fix Required:**
- Include character roster with LOCKED pronouns in EVERY chapter prompt
- Format: "Characters: Jordan (she/her), Alex (he/him), Riley (they/them)"
- Chapter generator must validate pronouns before accepting output

---

## Bug #2: Spontaneous New Characters
**Symptom:** New named characters appeared out of nowhere in later chapters  
**Example:** Story about Emma & Jack suddenly introduced "their friend Sarah" in Chapter 4

**Root Cause:** No explicit rule preventing AI from inventing new characters

**V3 Fix Required:**
- System prompt must include: "ONLY use these characters: [full list]. Do NOT introduce new named characters."
- Chapter generator validates no new proper nouns appear (except place names from worldBible)
- Track character presence per chapter in DNA

---

## Bug #3: Cookie-Cutter Stories from Example Dialogue
**Symptom:** Stories had repetitive, formulaic dialogue patterns  
**Example:** Every story had characters saying "Let's do this together!" and "I believe in you!"

**Root Cause:** Prompts included example dialogue snippets that AI mimicked too closely

**V3 Fix Required:**
- **NEVER include example dialogue in prompts**
- Define character voice through FINGERPRINTS only:
  - Vocabulary level (simple/moderate/rich)
  - Sentence structure (short/balanced/complex)
  - Speech habits (questions, exclamations, pauses)
- Let AI generate unique dialogue based on fingerprints, not examples

---

## Bug #4: Generic Mock Storylines
**Symptom:** Stories felt templated and predictable  
**Example:** Every mystery story followed exact same "find clue → red herring → real discovery" pattern

**Root Cause:** Prompts included example storylines that AI copied structure from

**V3 Fix Required:**
- **NEVER include example/mock storylines in prompts**
- Define story structure through:
  - World rules (what's possible/impossible)
  - Character tensions (what drives conflict)
  - Emotional stakes (what matters)
- Let AI create unique plot events within those constraints

---

## Bug #5: Knowledge Amnesia
**Symptom:** Characters forgot important information they learned earlier  
**Example:** In Chapter 2, Max discovered the magic door. In Chapter 4, he acts surprised it exists.

**Root Cause:** No tracking of what each character knows and when they learned it

**V3 Fix Required:**
- Character knowledge state machine in DNA:
  ```typescript
  characterKnowledge: {
    characterName: string
    knowledgeItems: [
      {
        fact: string
        learnedInChapter: number
        revealedToOthers: Array<{character, inChapter, context}>
        isSecret: boolean
      }
    ]
  }
  ```
- Chapter prompts include: "Max knows: [list]. Max does NOT know: [list]."
- After each chapter: extract new knowledge, update state

---

## Bug #6: Cliffhanger Amnesia
**Symptom:** Chapter ended with dramatic cliffhanger but next chapter ignored it  
**Example:** Chapter 2 ended "The door burst open!" Chapter 3 started talking about breakfast.

**Root Cause:** No explicit plan for how cliffhangers would be resolved

**V3 Fix Required:**
- Every cliffhanger needs resolution plan:
  ```typescript
  cliffhanger: {
    type: 'discovery' | 'danger' | 'revelation'
    specificElement: "The mysterious door"
    resolutionPlan: {
      resolveInChapter: 3
      resolutionMethod: 'immediate' | 'delayed' | 'misdirection'
      resolutionDescription: "Door opens to reveal..."
      openingBeat: "Start Chapter 3 with door opening scene"
    }
  }
  ```
- Chapter N+1 prompt MUST include cliffhanger from Chapter N and its resolution plan

---

## Bug #7: Forbidden Reactions
**Symptom:** Characters reacted to secrets they shouldn't know yet  
**Example:** Riley showed shock at the revelation in Chapter 4, but they already knew it from Chapter 2

**Root Cause:** No tracking of who should/shouldn't react to information

**V3 Fix Required:**
- Continuity requirements per chapter:
  ```typescript
  continuityRequirements: {
    mustResolve: ["door cliffhanger", "missing key"]
    forbiddenReactions: [
      {
        character: "Riley"
        toEvent: "magic door discovery"
        reason: "Riley already knows - saw it in Ch2"
        correctReaction: "unsurprised" | "pretends shock to hide knowledge"
      }
    ]
    characterKnowledgeState: [
      {character: "Max", knows: ["door exists"], doesNotKnow: ["door's purpose"]}
    ]
  }
  ```
- Validate chapter output against forbidden reactions before accepting

---

## Inter-Chapter Validation (NEW)

**Requirement:** Before generating Chapter N, run quick gpt-5-mini check:

**System prompt:**
```
You are a continuity checker. Review this chapter draft for violations.
Check:
1. Are pronouns consistent with character roster?
2. Are there any new named characters not in the original cast?
3. Do characters react to things they don't know yet?
4. Does the chapter resolve previous cliffhangers properly?
5. Does the chapter contradict any established world rules?

Return JSON: { violations: [{type, description}], passed: boolean }
```

**User prompt:**
```
Character roster: [locked pronouns]
World rules: [from worldBible]
Character knowledge states: [from DNA]
Previous chapter ending: [last 2-3 sentences]
Cliffhanger resolution plan: [from DNA]
Chapter draft: [full content]
```

**Action:** If violations found, regenerate with violations as additional constraints.

---

## Model Configuration (CRITICAL)

**Generation model:** `gpt-5.2` (NOT gpt-4o)  
**QA check model:** `gpt-5-mini` (fast, cheap validation)  
**Response format:** `{ type: 'json_object' }` for all structured output

**WHY gpt-5.2:**
- Better at following complex constraints
- More creative within boundaries
- Handles longer context better
- Consistent character voices

**NEVER use gpt-4o for generation** - produces flatter, more repetitive output.

---

## Testing Checklist

Before declaring V3 consistency engine complete, verify:

- [ ] Character pronouns never change mid-story
- [ ] No new characters appear unless in original DNA
- [ ] Each story has unique dialogue (no "I believe in you!" repetition)
- [ ] Each story has unique plot (no cookie-cutter patterns)
- [ ] Characters remember what they learned (knowledge tracking works)
- [ ] Cliffhangers are properly resolved in next chapter
- [ ] Characters never react to secrets they shouldn't know
- [ ] Inter-chapter validation catches continuity violations
- [ ] Running chapter summaries maintain continuity
- [ ] Character roster with pronouns appears in every prompt

---

*These requirements are based on REAL production failures from V1. Each one caused user complaints and story quality issues. V3 MUST solve all of them.*
