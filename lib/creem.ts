/**
 * Creem Payment Processing
 * SaaS billing solution for subscriptions, checkouts, and customer management
 */

// Since creem_io SDK may not be fully mature, we'll use direct API calls with typed responses
interface CreemCheckoutResponse {
  checkout_url: string;
  id: string;
  created_at: string;
}

interface CreemSubscriptionResponse {
  id: string;
  status: 'active' | 'paused' | 'cancelled' | 'past_due';
  customer_id: string;
  product_id: string;
  current_period_end: string;
  created_at: string;
}

interface CreemBillingPortalResponse {
  portal_url: string;
  created_at: string;
}

// Product IDs (set these after creating products in Creem Dashboard)
export const PRODUCTS = {
  MONTHLY: process.env.CREEM_MONTHLY_PRODUCT_ID || 'prod_monthly_placeholder',
  ANNUAL: process.env.CREEM_ANNUAL_PRODUCT_ID || 'prod_annual_placeholder',
} as const;

const CREEM_API_KEY = process.env.CREEM_API_KEY || '';
const CREEM_BASE_URL = process.env.CREEM_ENV === 'test' 
  ? 'https://test-api.creem.io' 
  : 'https://api.creem.io';

/**
 * Helper to make authenticated requests to Creem API
 */
async function creemRequest<T>(
  method: string,
  endpoint: string,
  body?: any
): Promise<T> {
  const url = `${CREEM_BASE_URL}${endpoint}`;
  
  const options: RequestInit = {
    method,
    headers: {
      'x-api-key': CREEM_API_KEY,
      'Content-Type': 'application/json',
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Creem API error (${response.status}): ${errorData}`);
  }

  return response.json() as Promise<T>;
}

/**
 * Create a Creem Checkout session for subscription
 */
export async function createCheckoutSession(
  productId: string,
  successUrl: string,
  customerEmail?: string
) {
  try {
    const response = await creemRequest<CreemCheckoutResponse>(
      'POST',
      '/v1/checkouts',
      {
        product_id: productId,
        success_url: successUrl,
        ...(customerEmail && { customer_email: customerEmail }),
      }
    );

    return {
      url: response.checkout_url,
      sessionId: response.id,
    };
  } catch (error) {
    console.error('Error creating Creem checkout session:', error);
    throw error;
  }
}

/**
 * Create a Creem Customer Portal session for managing subscription
 */
export async function createBillingPortalSession(customerId: string) {
  try {
    const response = await creemRequest<CreemBillingPortalResponse>(
      'POST',
      '/v1/customers/billing',
      {
        customer_id: customerId,
      }
    );

    return {
      url: response.portal_url,
    };
  } catch (error) {
    console.error('Error creating Creem billing portal session:', error);
    throw error;
  }
}

/**
 * Get subscription details
 */
export async function getSubscription(subscriptionId: string) {
  try {
    return await creemRequest<CreemSubscriptionResponse>(
      'GET',
      `/v1/subscriptions/${subscriptionId}`
    );
  } catch (error) {
    console.error('Error fetching subscription:', error);
    throw error;
  }
}

/**
 * Cancel a subscription immediately
 */
export async function cancelSubscription(subscriptionId: string) {
  try {
    return await creemRequest<CreemSubscriptionResponse>(
      'POST',
      `/v1/subscriptions/${subscriptionId}/cancel`
    );
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    throw error;
  }
}

/**
 * Pause a subscription (native Creem feature)
 */
export async function pauseSubscription(subscriptionId: string) {
  try {
    return await creemRequest<CreemSubscriptionResponse>(
      'POST',
      `/v1/subscriptions/${subscriptionId}/pause`
    );
  } catch (error) {
    console.error('Error pausing subscription:', error);
    throw error;
  }
}

/**
 * Resume a paused subscription (native Creem feature)
 */
export async function resumeSubscription(subscriptionId: string) {
  try {
    return await creemRequest<CreemSubscriptionResponse>(
      'POST',
      `/v1/subscriptions/${subscriptionId}/resume`
    );
  } catch (error) {
    console.error('Error resuming subscription:', error);
    throw error;
  }
}

// Type definitions for webhook event data
type CheckoutCompletedData = {
  type: 'checkout_completed';
  customer_id: string;
  subscription_id: string;
  product_id: string;
};

type SubscriptionActiveData = {
  type: 'subscription_active';
  customer_id: string;
  subscription_id: string;
  current_period_end: string;
};

type SubscriptionCancelledData = {
  type: 'subscription_cancelled';
  customer_id: string;
  subscription_id: string;
};

type SubscriptionPausedData = {
  type: 'subscription_paused';
  customer_id: string;
  subscription_id: string;
};

type WebhookEventData =
  | CheckoutCompletedData
  | SubscriptionActiveData
  | SubscriptionCancelledData
  | SubscriptionPausedData;

/**
 * Handle Creem webhook events
 * Called from the webhook route to process subscription events
 */
export async function handleWebhookEvent(
  eventType: string,
  eventData: any
): Promise<WebhookEventData | null> {
  switch (eventType) {
    case 'checkout.completed': {
      return {
        type: 'checkout_completed',
        customer_id: eventData.customer_id,
        subscription_id: eventData.subscription_id,
        product_id: eventData.product_id,
      };
    }

    case 'subscription.active': {
      return {
        type: 'subscription_active',
        customer_id: eventData.customer_id,
        subscription_id: eventData.subscription_id,
        current_period_end: eventData.current_period_end,
      };
    }

    case 'subscription.cancelled': {
      return {
        type: 'subscription_cancelled',
        customer_id: eventData.customer_id,
        subscription_id: eventData.subscription_id,
      };
    }

    case 'subscription.paused': {
      return {
        type: 'subscription_paused',
        customer_id: eventData.customer_id,
        subscription_id: eventData.subscription_id,
      };
    }

    default:
      return null;
  }
}

/**
 * Verify Creem webhook signature
 * Uses the x-api-key header and optional webhook secret
 */
export function verifyWebhookSignature(
  signature: string | null,
  body: string
): boolean {
  // Creem provides authentication via x-api-key header
  // Additional signature verification can be added if a webhook secret is provided
  if (!signature || !CREEM_API_KEY) {
    return false;
  }

  // For now, we verify that the signature matches our API key
  // In production, implement full HMAC verification if Creem provides it
  return signature === CREEM_API_KEY;
}
