import Stripe from 'stripe';

// Initialize Stripe with secret key
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-12-18.acacia',
  typescript: true,
});

// Product IDs and Price IDs (set these after creating products in Stripe Dashboard)
export const PLANS = {
  MONTHLY: {
    name: 'Family Monthly',
    price: 799, // $7.99 in cents
    interval: 'month' as const,
    priceId: process.env.STRIPE_PRICE_MONTHLY || 'price_monthly_placeholder',
  },
  ANNUAL: {
    name: 'Family Annual',
    price: 5999, // $59.99 in cents
    interval: 'year' as const,
    priceId: process.env.STRIPE_PRICE_ANNUAL || 'price_annual_placeholder',
  },
} as const;

/**
 * Create a Stripe Checkout session for subscription
 */
export async function createCheckoutSession({
  userId,
  userEmail,
  plan,
  successUrl,
  cancelUrl,
}: {
  userId: string;
  userEmail: string;
  plan: 'monthly' | 'annual';
  successUrl: string;
  cancelUrl: string;
}) {
  try {
    const priceId = plan === 'monthly' ? PLANS.MONTHLY.priceId : PLANS.ANNUAL.priceId;

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: userEmail,
      client_reference_id: userId, // Link session to our user
      allow_promotion_codes: true, // Enable promo codes (for WINBACK50, etc.)
      subscription_data: {
        trial_period_days: 7, // 7-day free trial
        metadata: {
          userId,
        },
      },
      metadata: {
        userId,
        plan,
      },
    });

    return { url: session.url, sessionId: session.id };
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
}

/**
 * Create a Stripe Customer Portal session for managing subscription
 */
export async function createBillingPortalSession({
  customerId,
  returnUrl,
}: {
  customerId: string;
  returnUrl: string;
}) {
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });

    return { url: session.url };
  } catch (error) {
    console.error('Error creating billing portal session:', error);
    throw error;
  }
}

/**
 * Handle Stripe webhook events
 * Called from the webhook route to process subscription events
 */
export async function handleWebhookEvent(event: Stripe.Event) {
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      
      // Return data to be processed by the webhook handler
      return {
        type: 'checkout_completed',
        userId: session.metadata?.userId || session.client_reference_id,
        customerId: session.customer as string,
        subscriptionId: session.subscription as string,
        plan: session.metadata?.plan,
      };
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription;
      
      return {
        type: 'subscription_updated',
        userId: subscription.metadata?.userId,
        customerId: subscription.customer as string,
        subscriptionId: subscription.id,
        status: subscription.status,
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
      };
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      
      return {
        type: 'subscription_deleted',
        userId: subscription.metadata?.userId,
        customerId: subscription.customer as string,
        subscriptionId: subscription.id,
      };
    }

    case 'invoice.payment_succeeded': {
      const invoice = event.data.object as Stripe.Invoice;
      
      return {
        type: 'payment_succeeded',
        customerId: invoice.customer as string,
        subscriptionId: invoice.subscription as string,
        amountPaid: invoice.amount_paid,
      };
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice;
      
      return {
        type: 'payment_failed',
        customerId: invoice.customer as string,
        subscriptionId: invoice.subscription as string,
        amountDue: invoice.amount_due,
      };
    }

    default:
      return null;
  }
}

/**
 * Get subscription details for a customer
 */
export async function getSubscription(subscriptionId: string) {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    return subscription;
  } catch (error) {
    console.error('Error fetching subscription:', error);
    throw error;
  }
}

/**
 * Cancel a subscription at period end
 */
export async function cancelSubscription(subscriptionId: string) {
  try {
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });
    return subscription;
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    throw error;
  }
}

/**
 * Reactivate a subscription that was set to cancel
 */
export async function reactivateSubscription(subscriptionId: string) {
  try {
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: false,
    });
    return subscription;
  } catch (error) {
    console.error('Error reactivating subscription:', error);
    throw error;
  }
}
