import { NextRequest, NextResponse } from 'next/server'
import { checkTrialEnding, checkInactivity, checkWinBack } from '@/lib/retention'

/**
 * Retention system cron endpoint
 * 
 * This endpoint should be called daily (via a cron job or scheduler like n8n)
 * to check for retention triggers and send appropriate emails:
 * - Trial ending (2 days before)
 * - Inactivity (7 days no reading)
 * - Win-back (30 days post-cancel)
 * 
 * Expected to be called like:
 * GET /api/retention/check?apiKey=<CRON_SECRET>
 */

// Simple auth: require an API key to prevent unauthorized cron calls
const CRON_SECRET = process.env.CRON_SECRET || 'dev-secret-key'

export async function GET(request: NextRequest) {
  // Verify API key
  const apiKey = request.nextUrl.searchParams.get('apiKey')

  if (!apiKey || apiKey !== CRON_SECRET) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    console.log('[Retention] Starting daily retention checks...')

    // Run all retention checks
    const results = {
      trialEnding: null as any,
      inactivity: null as any,
      winBack: null as any,
    }

    // Check for trial endings
    try {
      console.log('[Retention] Checking for trial endings...')
      await checkTrialEnding()
      results.trialEnding = { status: 'completed' }
    } catch (error) {
      console.error('[Retention] Trial ending check failed:', error)
      results.trialEnding = { status: 'failed', error: String(error) }
    }

    // Check for inactive users
    try {
      console.log('[Retention] Checking for inactive users...')
      await checkInactivity()
      results.inactivity = { status: 'completed' }
    } catch (error) {
      console.error('[Retention] Inactivity check failed:', error)
      results.inactivity = { status: 'failed', error: String(error) }
    }

    // Check for win-back opportunities
    try {
      console.log('[Retention] Checking for win-back opportunities...')
      await checkWinBack()
      results.winBack = { status: 'completed' }
    } catch (error) {
      console.error('[Retention] Win-back check failed:', error)
      results.winBack = { status: 'failed', error: String(error) }
    }

    console.log('[Retention] Daily retention checks completed', results)

    return NextResponse.json(
      {
        success: true,
        message: 'Retention checks completed',
        results,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[Retention] Unexpected error during retention checks:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Retention checks failed',
        details: String(error),
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}

/**
 * POST handler for manual trigger
 * Useful for testing or manual runs
 */
export async function POST(request: NextRequest) {
  const apiKey = request.headers.get('x-api-key')

  if (!apiKey || apiKey !== CRON_SECRET) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const body = await request.json()
    const checks = body.checks || ['trial', 'inactivity', 'winback']

    console.log('[Retention] Manual retention check triggered:', checks)

    const results = {
      trialEnding: null as any,
      inactivity: null as any,
      winBack: null as any,
    }

    if (checks.includes('trial')) {
      try {
        await checkTrialEnding()
        results.trialEnding = { status: 'completed' }
      } catch (error) {
        results.trialEnding = { status: 'failed', error: String(error) }
      }
    }

    if (checks.includes('inactivity')) {
      try {
        await checkInactivity()
        results.inactivity = { status: 'completed' }
      } catch (error) {
        results.inactivity = { status: 'failed', error: String(error) }
      }
    }

    if (checks.includes('winback')) {
      try {
        await checkWinBack()
        results.winBack = { status: 'completed' }
      } catch (error) {
        results.winBack = { status: 'failed', error: String(error) }
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Manual retention checks completed',
        results,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[Retention] Manual check failed:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Manual check failed',
        details: String(error),
      },
      { status: 500 }
    )
  }
}
