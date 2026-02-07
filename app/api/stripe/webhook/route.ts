import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { stripe, handleWebhookEvent } from '@/lib/stripe';
import { createClient } from '@/lib/supabase/server';

// Disable body parsing for webhook (we need raw body for signature verification)
export const runtime = 'nodejs';

/**
 * Stripe Webhook Handler
 * Processes subscription events from Stripe
 */
export async function POST(req: NextRequest) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }

  // Verify webhook signature
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }

  // Process the event
  try {
    const eventData = await handleWebhookEvent(event);

    if (!eventData) {
      // Event type not handled
      return NextResponse.json({ received: true });
    }

    // Get Supabase client with service role key (bypasses RLS)
    const supabase = await createClient();

    switch (eventData.type) {
      case 'checkout_completed': {
        // User completed checkout - update their profile with subscription info
        const { userId, customerId, subscriptionId, plan } = eventData;

        if (!userId) {
          console.error('No userId in checkout.session.completed event');
          break;
        }

        await supabase
          .from('profiles')
          .update({
            plan: plan === 'annual' ? 'annual' : 'family',
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
            subscription_status: 'active',
            trial_ends_at: null, // Clear trial when they subscribe
            updated_at: new Date().toISOString(),
          })
          .eq('id', userId);

        console.log(`✅ Subscription activated for user ${userId}`);
        break;
      }

      case 'subscription_updated': {
        // Subscription status changed (renewal, payment method update, etc.)
        const { customerId, status, currentPeriodEnd, cancelAtPeriodEnd } = eventData;

        await supabase
          .from('profiles')
          .update({
            subscription_status: status,
            subscription_period_end: currentPeriodEnd.toISOString(),
            cancel_at_period_end: cancelAtPeriodEnd,
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_customer_id', customerId);

        console.log(`✅ Subscription updated for customer ${customerId}: ${status}`);
        break;
      }

      case 'subscription_deleted': {
        // Subscription cancelled/expired
        const { customerId } = eventData;

        await supabase
          .from('profiles')
          .update({
            plan: 'free',
            subscription_status: 'cancelled',
            stripe_subscription_id: null,
            cancel_at_period_end: false,
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_customer_id', customerId);

        console.log(`✅ Subscription cancelled for customer ${customerId}`);
        break;
      }

      case 'payment_succeeded': {
        // Payment succeeded - log for analytics
        console.log(`✅ Payment succeeded for subscription ${eventData.subscriptionId}`);
        break;
      }

      case 'payment_failed': {
        // Payment failed - update subscription status
        const { customerId } = eventData;

        await supabase
          .from('profiles')
          .update({
            subscription_status: 'past_due',
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_customer_id', customerId);

        console.log(`⚠️ Payment failed for customer ${customerId}`);
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
