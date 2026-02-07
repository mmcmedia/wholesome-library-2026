-- Add subscription-related fields to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT,
ADD COLUMN IF NOT EXISTS subscription_status TEXT,
ADD COLUMN IF NOT EXISTS subscription_period_end TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS cancel_at_period_end BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMPTZ;

-- Create index for looking up users by Stripe customer ID
CREATE INDEX IF NOT EXISTS profiles_stripe_customer_id_idx ON profiles(stripe_customer_id);

-- Add comment explaining the subscription fields
COMMENT ON COLUMN profiles.stripe_subscription_id IS 'Stripe subscription ID for active subscriptions';
COMMENT ON COLUMN profiles.subscription_status IS 'Stripe subscription status: active, past_due, cancelled, etc.';
COMMENT ON COLUMN profiles.subscription_period_end IS 'When the current subscription period ends';
COMMENT ON COLUMN profiles.cancel_at_period_end IS 'Whether subscription is set to cancel at period end';
COMMENT ON COLUMN profiles.trial_ends_at IS 'When the 7-day free trial expires (null if subscribed)';
