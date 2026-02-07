import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createCheckoutSession } from '@/lib/creem';
import { PRODUCTS } from '@/lib/creem';

/**
 * Create Creem Checkout Session
 * POST /api/creem/checkout
 * Body: { plan: 'monthly' | 'annual' }
 */
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized - please log in' },
        { status: 401 }
      );
    }

    // Get user's email
    const email = user.email;
    if (!email) {
      return NextResponse.json(
        { error: 'No email found for user' },
        { status: 400 }
      );
    }

    // Parse request body
    const body = await req.json();
    const { plan } = body;

    if (!plan || (plan !== 'monthly' && plan !== 'annual')) {
      return NextResponse.json(
        { error: 'Invalid plan. Must be "monthly" or "annual"' },
        { status: 400 }
      );
    }

    // Get the product ID based on plan
    const productId = plan === 'monthly' ? PRODUCTS.MONTHLY : PRODUCTS.ANNUAL;

    // Get the base URL for redirect URLs
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const successUrl = `${baseUrl}/subscription/success`;

    // Create Creem checkout session
    const { url, sessionId } = await createCheckoutSession(
      productId,
      successUrl,
      email
    );

    if (!url) {
      return NextResponse.json(
        { error: 'Failed to create checkout session' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      url,
      sessionId,
    });
  } catch (error) {
    console.error('Checkout session creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
