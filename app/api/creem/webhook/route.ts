import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { handleWebhookEvent, verifyWebhookSignature } from '@/lib/creem';
import { createClient } from '@/lib/supabase/server';

// Disable body parsing for webhook (we need raw body for signature verification)
export const runtime = 'nodejs';

/**
 * Creem Webhook Handler
 * Processes subscription events from Creem
 * POST /api/creem/webhook
 */
export async function POST(req: NextRequest) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get('x-api-key');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing authentication header' },
      { status: 400 }
    );
  }

  // Verify webhook signature
  if (!verifyWebhookSignature(signature, body)) {
    console.error('Webhook signature verification failed');
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }

  // Parse the webhook payload
  let payload: any;
  try {
    payload = JSON.parse(body);
  } catch (err) {
    console.error('Failed to parse webhook payload:', err);
    return NextResponse.json(
      { error: 'Invalid JSON payload' },
      { status: 400 }
    );
  }

  // Process the event
  try {
    const eventType = payload.type;
    const eventData = payload.data;

    const processedEvent = await handleWebhookEvent(eventType, eventData);

    if (!processedEvent) {
      // Event type not handled
      return NextResponse.json({ received: true });
    }

    // Get Supabase client with service role key (bypasses RLS)
    const supabase = await createClient();

    switch (processedEvent.type) {
      case 'checkout_completed': {
        // User completed checkout - update their profile with subscription info
        const { customer_id, subscription_id, product_id } = processedEvent;

        // Map product_id to plan type
        const plan = product_id.includes('annual') ? 'annual' : 'family';

        // Find user by email or create new subscription record
        // Note: Creem webhooks don't include user ID, so we need to track this during checkout
        // In production, store the mapping during checkout session creation

        await supabase
          .from('profiles')
          .update({
            plan,
            creem_customer_id: customer_id,
            creem_subscription_id: subscription_id,
            subscription_status: 'active',
            trial_ends_at: null, // Clear trial when they subscribe
            updated_at: new Date().toISOString(),
          })
          .eq('creem_customer_id', customer_id);

        console.log(`✅ Subscription activated for customer ${customer_id}`);
        break;
      }

      case 'subscription_active': {
        // Subscription is now active (after trial or renewal)
        const { customer_id, current_period_end } = processedEvent;

        await supabase
          .from('profiles')
          .update({
            subscription_status: 'active',
            subscription_period_end: new Date(current_period_end).toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('creem_customer_id', customer_id);

        console.log(`✅ Subscription active for customer ${customer_id}`);
        break;
      }

      case 'subscription_cancelled': {
        // Subscription cancelled
        const { customer_id } = processedEvent;

        await supabase
          .from('profiles')
          .update({
            plan: 'free',
            subscription_status: 'cancelled',
            creem_subscription_id: null,
            updated_at: new Date().toISOString(),
          })
          .eq('creem_customer_id', customer_id);

        console.log(`✅ Subscription cancelled for customer ${customer_id}`);
        break;
      }

      case 'subscription_paused': {
        // Subscription paused
        const { customer_id } = processedEvent;

        await supabase
          .from('profiles')
          .update({
            subscription_status: 'paused',
            updated_at: new Date().toISOString(),
          })
          .eq('creem_customer_id', customer_id);

        console.log(`✅ Subscription paused for customer ${customer_id}`);
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
