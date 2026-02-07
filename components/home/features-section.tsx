'use client'

import React from 'react'
import { Shield, Sliders, Heart, Sparkles, BookCheck, Users } from 'lucide-react'

const features = [
  {
    icon: <Shield className="h-8 w-8 text-teal" />,
    title: 'Every Story Reviewed',
    description: 'Quality-checked AND human-reviewed before publishing. No surprises, ever.',
    highlight: 'Trusted by 1,000+ families',
  },
  {
    icon: <Sliders className="h-8 w-8 text-teal" />,
    title: 'Smart Content Filters',
    description: 'Control what themes your child sees. Simple toggles for fantasy, faith themes, mild conflict, and more.',
    highlight: 'Customizable for each child',
  },
  {
    icon: <Heart className="h-8 w-8 text-teal" />,
    title: 'Character-Building Virtues',
    description: 'Stories that celebrate courage, kindness, honesty, perseverance, and more—woven naturally into adventures.',
    highlight: 'Life-changing stories',
  },
  {
    icon: <BookCheck className="h-8 w-8 text-teal" />,
    title: 'Reading Level Precision',
    description: 'Stories matched to your child\'s ability, not just age. Watch them grow with confidence.',
    highlight: 'Ages 4-12',
  },
  {
    icon: <Sparkles className="h-8 w-8 text-teal" />,
    title: 'Always Growing',
    description: 'New stories added daily. Fresh content means your child never runs out of adventures.',
    highlight: 'Never gets old',
  },
  {
    icon: <Users className="h-8 w-8 text-teal" />,
    title: 'Family Plan',
    description: 'Up to 5 child profiles with individual reading levels and preferences. One price, whole family.',
    highlight: 'One subscription',
  },
]

export default function FeaturesSection() {
  return (
    <section className="py-16 md:py-24 px-4 bg-gradient-to-br from-teal/5 to-white">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-charcoal mb-4">
            Why Parents Choose Wholesome Library
          </h2>
          <p className="text-lg text-charcoal/70 max-w-2xl mx-auto">
            More than just stories—peace of mind for parents, adventure for kids
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-teal/10"
            >
              <div className="bg-teal/10 rounded-xl w-14 h-14 flex items-center justify-center mb-4">
                {feature.icon}
              </div>

              <h3 className="text-xl font-bold text-charcoal mb-2">
                {feature.title}
              </h3>

              <p className="text-charcoal/70 leading-relaxed mb-4">
                {feature.description}
              </p>

              <div className="flex items-center text-teal text-sm font-medium">
                <Sparkles className="w-4 h-4 mr-1.5" />
                {feature.highlight}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
