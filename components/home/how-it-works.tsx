'use client'

import React from 'react'
import { Library, Settings, BookOpen, Sparkles } from 'lucide-react'

const steps = [
  {
    icon: <Library className="h-8 w-8 text-white" />,
    title: 'Browse Our Library',
    description: 'Filter by reading level, virtue, or theme. New stories added daily.',
  },
  {
    icon: <Settings className="h-8 w-8 text-white" />,
    title: 'Set Your Preferences',
    description: 'Choose themes to include or avoid—we filter the library to match.',
  },
  {
    icon: <BookOpen className="h-8 w-8 text-white" />,
    title: 'Read Together',
    description: 'Clean reading experience on any device. No ads, no pop-ups.',
  },
  {
    icon: <Sparkles className="h-8 w-8 text-white" />,
    title: 'Watch Them Grow',
    description: 'Track reading progress and celebrate character growth.',
  },
]

export default function HowItWorks() {
  return (
    <section className="py-16 md:py-24 px-4 bg-white">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-3xl md:text-4xl font-bold text-charcoal text-center mb-4">
          How It Works
        </h2>
        <p className="text-center text-charcoal/70 text-lg mb-12 max-w-2xl mx-auto">
          Start reading wholesome stories in minutes
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center relative"
            >
              <div className="bg-teal rounded-full w-16 h-16 flex items-center justify-center mb-4 shadow-lg transform hover:scale-110 transition-transform">
                {step.icon}
              </div>
              <div className="absolute -top-2 -left-2 w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white font-bold text-sm">
                {index + 1}
              </div>
              <h3 className="text-xl font-semibold text-charcoal mb-2">{step.title}</h3>
              <p className="text-charcoal/70">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
