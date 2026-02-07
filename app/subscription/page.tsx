'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

export default function SubscriptionPage() {
  const [loading, setLoading] = useState<'monthly' | 'annual' | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubscribe = async (plan: 'monthly' | 'annual') => {
    setLoading(plan);
    setError(null);

    try {
      // Call the checkout API
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ plan }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (err) {
      console.error('Subscription error:', err);
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get unlimited access to our entire library of wholesome, curated stories.
            All plans include a 7-day free trial.
          </p>
        </div>

        {error && (
          <div className="max-w-2xl mx-auto mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Monthly Plan */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-200 hover:border-teal-500 transition-all">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Monthly</h3>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-5xl font-bold text-teal-600">$7.99</span>
                <span className="text-gray-500">/month</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">Cancel anytime</p>
            </div>

            <ul className="space-y-4 mb-8">
              <Feature>Unlimited reading for the whole family</Feature>
              <Feature>All content filters and preferences</Feature>
              <Feature>Up to 5 child profiles</Feature>
              <Feature>Reading progress tracking</Feature>
              <Feature>New stories added weekly</Feature>
              <Feature>7-day free trial</Feature>
            </ul>

            <Button
              onClick={() => handleSubscribe('monthly')}
              disabled={loading !== null}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white py-6 text-lg font-semibold"
              size="lg"
            >
              {loading === 'monthly' ? 'Loading...' : 'Start Free Trial'}
            </Button>
          </div>

          {/* Annual Plan - Best Value */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-teal-500 relative hover:shadow-2xl transition-all">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <span className="bg-teal-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                BEST VALUE
              </span>
            </div>

            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Annual</h3>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-5xl font-bold text-teal-600">$59.99</span>
                <span className="text-gray-500">/year</span>
              </div>
              <p className="text-sm text-teal-700 font-semibold mt-2">
                Just $5/month — Save 37%
              </p>
            </div>

            <ul className="space-y-4 mb-8">
              <Feature>Unlimited reading for the whole family</Feature>
              <Feature>All content filters and preferences</Feature>
              <Feature>Up to 5 child profiles</Feature>
              <Feature>Reading progress tracking</Feature>
              <Feature>New stories added weekly</Feature>
              <Feature>7-day free trial</Feature>
              <Feature highlighted>Save $36 per year</Feature>
            </ul>

            <Button
              onClick={() => handleSubscribe('annual')}
              disabled={loading !== null}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white py-6 text-lg font-semibold"
              size="lg"
            >
              {loading === 'annual' ? 'Loading...' : 'Start Free Trial'}
            </Button>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto mt-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            <FAQ
              question="What happens after my free trial?"
              answer="After 7 days, your subscription begins and your card will be charged. You can cancel anytime before the trial ends with no charge."
            />
            <FAQ
              question="Can I cancel anytime?"
              answer="Yes! You can cancel your subscription at any time. Your access continues until the end of your billing period."
            />
            <FAQ
              question="How many child profiles can I create?"
              answer="All plans include up to 5 child profiles, perfect for families with multiple kids or for homeschool co-ops."
            />
            <FAQ
              question="Do you offer refunds?"
              answer="We offer a 7-day free trial so you can try everything risk-free. After that, we don't offer refunds, but you can cancel anytime to prevent future charges."
            />
            <FAQ
              question="Can I switch from monthly to annual?"
              answer="Yes! You can upgrade to annual at any time from your account settings to start saving immediately."
            />
          </div>
        </div>

        {/* Manage Subscription Link */}
        <div className="text-center mt-12">
          <p className="text-gray-600">
            Already subscribed?{' '}
            <a
              href="/subscription/manage"
              className="text-teal-600 hover:text-teal-700 font-semibold underline"
            >
              Manage your subscription
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

function Feature({ children, highlighted = false }: { children: React.ReactNode; highlighted?: boolean }) {
  return (
    <li className="flex items-start gap-3">
      <Check className={`w-5 h-5 ${highlighted ? 'text-teal-600' : 'text-gray-400'} flex-shrink-0 mt-0.5`} />
      <span className={highlighted ? 'text-teal-700 font-semibold' : 'text-gray-700'}>
        {children}
      </span>
    </li>
  );
}

function FAQ({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{question}</h3>
      <p className="text-gray-600">{answer}</p>
    </div>
  );
}
