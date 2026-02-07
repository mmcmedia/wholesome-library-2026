'use client'

import React from 'react'
import { Shield, Sliders, Heart, Sparkles } from 'lucide-react'

const features = [
  {
    icon: <Shield className="h-8 w-8 text-[#135C5E]" />,
    title: 'Safe Content',
    description: 'Every story is carefully curated to be free of violence, mature themes, and hidden ads. Pure, wholesome entertainment your family can trust.',
    highlight: 'Trusted by 10,000+ families',
  },
  {
    icon: <Sliders className="h-8 w-8 text-[#135C5E]" />,
    title: 'Smart Filtering',
    description: 'Powerful yet simple controls let you customize content to match your family values. One click is all it takes.',
    highlight: 'Customizable for all ages',
  },
  {
    icon: <Heart className="h-8 w-8 text-[#135C5E]" />,
    title: 'Character Growth',
    description: 'Stories that inspire empathy, courage, and imagination. Watch your children grow through adventures that matter.',
    highlight: 'Life-changing stories',
  },
]

export default function FeaturesSection() {
  return (
    <section className="bg-[#135C5E] rounded-3xl p-8 md:p-12 mx-4 md:mx-8 mb-16">
      <div className="flex flex-col items-center gap-12">
        <div className="max-w-2xl text-center">
          <h2 className="text-white text-3xl md:text-4xl mb-4">
            Why Parents Love Wholesome Library
          </h2>
          <p className="text-white/90 text-lg md:text-xl">
            Join thousands of families discovering the joy of worry-free reading
          </p>
        </div>

        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 md:p-8 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group"
            >
              <div className="mb-6">
                <div className="bg-[#135C5E]/10 rounded-2xl w-16 h-16 flex items-center justify-center transform group-hover:scale-110 transition-all duration-300">
                  {feature.icon}
                </div>
              </div>

              <h3 className="text-[#135C5E] text-2xl mb-3 font-bold">
                {feature.title}
              </h3>

              <p className="text-charcoal/80 text-lg leading-relaxed mb-4">
                {feature.description}
              </p>

              <div className="flex items-center text-[#135C5E] text-sm font-medium">
                <Sparkles className="w-4 h-4 mr-2" />
                {feature.highlight}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
