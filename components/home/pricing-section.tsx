'use client'

import React from 'react'
import Link from 'next/link'
import { Check, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FadeIn } from '@/components/ui/fade-in'

export default function PricingSection() {
  return (
    <section id="pricing" className="py-16 md:py-24 px-4 bg-white">
      <div className="container mx-auto max-w-6xl">
        <FadeIn className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-charcoal mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-charcoal/70">
            Try free for 7 days. No credit card required.
          </p>
        </FadeIn>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Monthly Plan */}
          <FadeIn delay={100} className="bg-white border-2 border-charcoal/10 rounded-3xl p-8 hover:border-teal/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-2">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-charcoal mb-2">Monthly</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-teal">$7.99</span>
                <span className="text-charcoal/60">/month</span>
              </div>
              <p className="text-sm text-charcoal/60 mt-2">
                Less than a coffee per month
              </p>
            </div>

            <ul className="space-y-3 mb-8">
              {[
                'Unlimited reading for whole family',
                'Up to 5 child profiles',
                'All stories and features',
                'Content preference controls',
                'Reading progress tracking',
                'New stories added daily',
                'Cancel anytime with one click',
              ].map((feature, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-teal flex-shrink-0 mt-0.5" />
                  <span className="text-charcoal/80">{feature}</span>
                </li>
              ))}
            </ul>

            <Link href="/auth/signup" className="block">
              <Button className="w-full bg-teal hover:bg-teal/90 text-white py-6 rounded-full text-lg font-medium transition-all duration-200 hover:scale-105">
                Start Free Trial
              </Button>
            </Link>
          </FadeIn>

          {/* Annual Plan */}
          <FadeIn delay={200} className="bg-gradient-to-br from-teal to-teal-dark text-white rounded-3xl p-8 relative hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-white border-0 px-4 py-1">
              <Sparkles className="w-3 h-3 mr-1 inline" />
              Best Value
            </Badge>

            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-2">Annual</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold">$59.99</span>
                <span className="text-white/80">/year</span>
              </div>
              <p className="text-sm text-white/80 mt-2">
                Just $5/month • Save 37%
              </p>
            </div>

            <ul className="space-y-3 mb-8">
              {[
                'Everything in Monthly, plus:',
                'Save $36 per year',
                'Lock in price guarantee',
                'Priority support',
                'Early access to new features',
              ].map((feature, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-white flex-shrink-0 mt-0.5" />
                  <span className={i === 0 ? 'font-semibold' : 'text-white/90'}>
                    {feature}
                  </span>
                </li>
              ))}
            </ul>

            <Link href="/auth/signup?plan=annual" className="block">
              <Button className="w-full bg-white text-teal hover:bg-white/90 py-6 rounded-full text-lg font-medium transition-all duration-200 hover:scale-105">
                Start Free Trial
              </Button>
            </Link>
          </FadeIn>
        </div>

        <FadeIn delay={300} className="text-center text-charcoal/60 mt-8 max-w-2xl mx-auto">
          <p>
            <strong>7-day free trial</strong> on all plans. No credit card required to start. Cancel anytime with a single click—no questions asked.
          </p>
        </FadeIn>
      </div>
    </section>
  )
}
