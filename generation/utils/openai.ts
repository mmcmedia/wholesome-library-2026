/**
 * OpenAI Client - Singleton with retry logic and exponential backoff
 * Uses GPT-5.2 for story generation, gpt-5-mini for QA checks
 */

import OpenAI from 'openai'
import type { ChatCompletionCreateParamsNonStreaming } from 'openai/resources/chat/completions'

let openaiClient: OpenAI | null = null

/**
 * Token usage tracker (accumulated across all calls in a session)
 */
const tokenTracker = {
  inputTokens: 0,
  outputTokens: 0,
  reset() {
    this.inputTokens = 0;
    this.outputTokens = 0;
  }
}

/**
 * Get or create OpenAI client
 */
export function getOpenAIClient(): OpenAI {
  if (openaiClient) {
    return openaiClient
  }

  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) {
    throw new Error('OPENAI_API_KEY environment variable is not set')
  }

  openaiClient = new OpenAI({
    apiKey,
    timeout: 60000,
    maxRetries: 3
  })

  return openaiClient
}

/**
 * Retry configuration
 */
const RETRY_CONFIG = {
  maxRetries: 3,
  baseDelayMs: 1000,
  maxDelayMs: 8000
}

/**
 * Execute a completion with retry logic and exponential backoff
 */
export async function executeCompletion(
  params: ChatCompletionCreateParamsNonStreaming
): Promise<string> {
  const client = getOpenAIClient()
  let lastError: Error | null = null

  for (let attempt = 0; attempt <= RETRY_CONFIG.maxRetries; attempt++) {
    try {
      const response = await client.chat.completions.create(params)
      const content = response.choices[0]?.message?.content

      if (!content) {
        throw new Error('Empty response from OpenAI API')
      }

      // Track token usage
      if (response.usage) {
        tokenTracker.inputTokens += response.usage.prompt_tokens || 0;
        tokenTracker.outputTokens += response.usage.completion_tokens || 0;
      }

      return content
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))

      // Don't retry on authentication errors
      if (
        error instanceof Error &&
        (error.message.includes('401') || 
         error.message.includes('authentication') ||
         error.message.includes('API key'))
      ) {
        throw error
      }

      // If this is the last attempt, throw the error
      if (attempt === RETRY_CONFIG.maxRetries) {
        throw lastError
      }

      // Calculate exponential backoff delay
      const delay = Math.min(
        RETRY_CONFIG.baseDelayMs * Math.pow(2, attempt),
        RETRY_CONFIG.maxDelayMs
      )

      console.warn(
        `OpenAI API request failed (attempt ${attempt + 1}/${RETRY_CONFIG.maxRetries + 1}), ` +
        `retrying in ${delay}ms...`,
        { error: lastError.message }
      )

      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }

  throw lastError || new Error('Unknown error in completion request')
}

/**
 * Execute a completion with retry logic, returning the full response object
 * Use when you need finish_reason or other metadata
 */
export async function executeCompletionFull(
  params: ChatCompletionCreateParamsNonStreaming
): Promise<{ content: string; finishReason: string | null; usage: { promptTokens: number; completionTokens: number } }> {
  const client = getOpenAIClient()
  let lastError: Error | null = null

  for (let attempt = 0; attempt <= RETRY_CONFIG.maxRetries; attempt++) {
    try {
      const response = await client.chat.completions.create(params)
      const content = response.choices[0]?.message?.content

      if (!content) {
        throw new Error('Empty response from OpenAI API')
      }

      // Track token usage
      const promptTokens = response.usage?.prompt_tokens || 0;
      const completionTokens = response.usage?.completion_tokens || 0;
      tokenTracker.inputTokens += promptTokens;
      tokenTracker.outputTokens += completionTokens;

      return {
        content,
        finishReason: response.choices[0]?.finish_reason || null,
        usage: { promptTokens, completionTokens }
      }
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))

      if (
        error instanceof Error &&
        (error.message.includes('401') || 
         error.message.includes('authentication') ||
         error.message.includes('API key'))
      ) {
        throw error
      }

      if (attempt === RETRY_CONFIG.maxRetries) {
        throw lastError
      }

      const delay = Math.min(
        RETRY_CONFIG.baseDelayMs * Math.pow(2, attempt),
        RETRY_CONFIG.maxDelayMs
      )

      console.warn(
        `OpenAI API request failed (attempt ${attempt + 1}/${RETRY_CONFIG.maxRetries + 1}), ` +
        `retrying in ${delay}ms...`,
        { error: lastError.message }
      )

      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }

  throw lastError || new Error('Unknown error in completion request')
}

/**
 * Parse JSON safely with fallback
 */
export function parseJSONSafely<T>(
  content: string,
  stageName: string
): T {
  try {
    // Try direct parsing first
    return JSON.parse(content) as T
  } catch (parseError) {
    console.error(`Failed to parse JSON from ${stageName}:`, parseError)

    // Try to extract JSON object from the response
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]) as T
      } catch (extractError) {
        console.error(`Failed to parse extracted JSON from ${stageName}:`, extractError)
      }
    }

    throw new Error(
      `Failed to parse JSON response from ${stageName}. ` +
      `Response: ${content.substring(0, 200)}...`
    )
  }
}

/**
 * Generate story DNA with gpt-5.2
 */
export async function generateStoryDNA(
  systemPrompt: string,
  userPrompt: string,
  model: string = 'gpt-5.2'
): Promise<string> {
  return executeCompletion({
    model,
    messages: [
      {
        role: 'developer',
        content: systemPrompt
      },
      {
        role: 'user',
        content: userPrompt
      }
    ],
    temperature: 0.7,
    max_completion_tokens: 4000,
    response_format: { type: 'json_object' }
  })
}

/**
 * Generate chapter content with gpt-5.2
 */
export async function generateChapterContent(
  systemPrompt: string,
  userPrompt: string,
  model: string = 'gpt-5.2'
): Promise<string> {
  return executeCompletion({
    model,
    messages: [
      {
        role: 'developer',
        content: systemPrompt
      },
      {
        role: 'user',
        content: userPrompt
      }
    ],
    temperature: 0.8,
    max_completion_tokens: 2000
  })
}

/**
 * Run QA check with gpt-5-mini (cheaper)
 */
export async function runQACheck(
  systemPrompt: string,
  userPrompt: string,
  jsonMode: boolean = true
): Promise<string> {
  const params: ChatCompletionCreateParamsNonStreaming = {
    model: 'gpt-5-mini',
    messages: [
      {
        role: 'developer',
        content: systemPrompt
      },
      {
        role: 'user',
        content: userPrompt
      }
    ],
    max_completion_tokens: 1000
  }

  if (jsonMode) {
    params.response_format = { type: 'json_object' }
  }

  return executeCompletion(params)
}

/**
 * Get accumulated token usage for current session
 */
export function getTokenUsage(): { input: number; output: number; total: number } {
  return {
    input: tokenTracker.inputTokens,
    output: tokenTracker.outputTokens,
    total: tokenTracker.inputTokens + tokenTracker.outputTokens
  };
}

/**
 * Reset token usage tracker (call at start of pipeline run)
 */
export function resetTokenUsage(): void {
  tokenTracker.reset();
}

/**
 * Get token usage estimate (rough approximation)
 * 1 token ≈ 4 characters
 */
export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4)
}
