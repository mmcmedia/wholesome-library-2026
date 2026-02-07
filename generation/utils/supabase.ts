/**
 * Supabase Client - Singleton pattern with service role key
 * Bypasses RLS for pipeline access
 */

import { createClient } from '@supabase/supabase-js'
import type { SupabaseClient } from '@supabase/supabase-js'

let supabaseClient: SupabaseClient | null = null

/**
 * Get or create Supabase client using service role key
 * Service role key bypasses RLS policies for pipeline operations
 */
export function getSupabaseClient(): SupabaseClient {
  if (supabaseClient) {
    return supabaseClient
  }

  const url = process.env.SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceKey) {
    throw new Error(
      'Supabase configuration missing. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.'
    )
  }

  supabaseClient = createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false
    }
  })

  return supabaseClient
}

/**
 * Execute a query with error handling
 */
export async function executeQuery<T>(
  queryFn: (client: SupabaseClient) => Promise<{ data: T | null; error: any }>
): Promise<{ data: T | null; error: Error | null }> {
  try {
    const client = getSupabaseClient()
    const result = await queryFn(client)

    if (result.error) {
      return {
        data: null,
        error: new Error(`Database error: ${result.error.message}`)
      }
    }

    return {
      data: result.data,
      error: null
    }
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err))
    return {
      data: null,
      error
    }
  }
}

/**
 * Helper to fetch a single record
 */
export async function fetchOne<T>(
  table: string,
  filter: Record<string, any>
): Promise<{ data: T | null; error: Error | null }> {
  return executeQuery<T>(async (client) => {
    let query = client.from(table).select('*')

    for (const [key, value] of Object.entries(filter)) {
      query = query.eq(key, value)
    }

    return query.single()
  })
}

/**
 * Helper to fetch multiple records
 */
export async function fetchMany<T>(
  table: string,
  filter?: Record<string, any>,
  limit?: number
): Promise<{ data: T[] | null; error: Error | null }> {
  return executeQuery<T[]>(async (client) => {
    let query = client.from(table).select('*')

    if (filter) {
      for (const [key, value] of Object.entries(filter)) {
        query = query.eq(key, value)
      }
    }

    if (limit) {
      query = query.limit(limit)
    }

    return query
  })
}

/**
 * Helper to insert a record
 */
export async function insertRecord<T>(
  table: string,
  data: any
): Promise<{ data: T | null; error: Error | null }> {
  return executeQuery<T>(async (client) => {
    return client.from(table).insert(data).select().single()
  })
}

/**
 * Helper to update a record
 */
export async function updateRecord<T>(
  table: string,
  id: string,
  data: any
): Promise<{ data: T | null; error: Error | null }> {
  return executeQuery<T>(async (client) => {
    return client.from(table).update(data).eq('id', id).select().single()
  })
}

/**
 * Helper to delete a record
 */
export async function deleteRecord(
  table: string,
  id: string
): Promise<{ error: Error | null }> {
  try {
    const client = getSupabaseClient()
    const result = await client.from(table).delete().eq('id', id)

    if (result.error) {
      return {
        error: new Error(`Database error: ${result.error.message}`)
      }
    }

    return { error: null }
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err))
    return { error }
  }
}
