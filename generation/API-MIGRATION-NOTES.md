# GPT-5.2 / GPT-5-mini API Migration Notes

**CRITICAL: These are NOT simple string swaps from gpt-4o-mini!**

## GPT-5.2 (generation model — $1.75/$14 per 1M tokens)

- **400K context window** (vs 128K for gpt-4o-mini)
- **128K max output tokens** (vs 16K for gpt-4o-mini)
- `temperature`, `top_p`, `logprobs` — ONLY supported when reasoning effort = "none"
- Default reasoning effort IS "none", so temperature works by default
- `response_format: { type: 'json_object' }` — SUPPORTED ✅
- `max_tokens` — still works in Chat Completions API
- Structured outputs — SUPPORTED ✅

### Usage pattern:
```typescript
const completion = await openai.chat.completions.create({
  model: 'gpt-5.2',
  messages: [...],
  temperature: 0.8,      // ✅ Works (reasoning default is "none")
  max_tokens: 4000,      // ✅ Works
  response_format: { type: 'json_object' },  // ✅ Works
})
```

## GPT-5-mini (QA/validation model — $0.25/$2 per 1M tokens)

- **400K context window**
- **128K max output tokens**
- ⚠️ **temperature is NOT SUPPORTED — will raise an error!**
- ⚠️ **top_p is NOT SUPPORTED — will raise an error!**
- ⚠️ **logprobs is NOT SUPPORTED — will raise an error!**
- `response_format: { type: 'json_object' }` — SUPPORTED ✅
- `max_tokens` — still works

From the OpenAI docs:
> "Requests to GPT-5.2 or GPT-5.1 with any other reasoning effort setting, 
> or to older GPT-5 models (e.g., gpt-5, gpt-5-mini, gpt-5-nano) that 
> include these [temperature, top_p, logprobs] fields will raise an error."

### Usage pattern:
```typescript
const completion = await openai.chat.completions.create({
  model: 'gpt-5-mini',
  messages: [...],
  // ❌ NO temperature!
  // ❌ NO top_p!
  max_tokens: 1000,      // ✅ Works
  response_format: { type: 'json_object' },  // ✅ Works
})
```

## Files that need temperature REMOVED for gpt-5-mini:

1. `generation/lib/quality-check.ts` — has `temperature: 0.3`
2. `generation/lib/safety-scan.ts` — has `temperature: 0.2`
3. `generation/lib/values-check.ts` — uses executeCompletion (check if temp is passed)
4. `generation/lib/chapter-generator.ts` → `validateChapterContinuity()` — has `temperature: 0.3`
5. `generation/utils/openai.ts` → `runQACheck()` — has `temperature: 0.2`

## Recommended: Smart parameter builder in openai.ts

```typescript
function buildCompletionParams(
  model: string,
  messages: any[],
  options: { temperature?: number; max_tokens?: number; response_format?: any }
) {
  const params: any = { model, messages, max_tokens: options.max_tokens };
  
  // Only add temperature for models that support it
  const supportsTemperature = model.startsWith('gpt-5.2') || model.startsWith('gpt-4');
  if (options.temperature !== undefined && supportsTemperature) {
    params.temperature = options.temperature;
  }
  
  if (options.response_format) {
    params.response_format = options.response_format;
  }
  
  return params;
}
```
