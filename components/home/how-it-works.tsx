'use client'

import React from 'react'
import { Library as LibraryBig, Settings, Monitor, Coffee } from 'lucide-react'
import { FadeIn } from '@/components/ui/fade-in'

const steps = [
  {
    icon: <LibraryBig className="h-8 w-8 text-white" />,
    title: '1. Browse Our Library —',
    description: 'Filter by age, theme, or length. New tales added every week.',
  },
  {
    icon: <Settings className="h-8 w-8 text-white" />,
    title: '2. Set Your Preferences —',
    description: 'Toggle off any themes you want to avoid—no surprises guaranteed.',
  },
  {
    icon: <Monitor className="h-8 w-8 text-white" />,
    title: '3. Read Together Instantly —',
    description: 'Open in any browser or device. No downloads, no pop-ups.',
  },
  {
    icon: <Coffee className="h-8 w-8 text-white" />,
    title: '4. Relax & Enjoy —',
    description: 'Pure storytelling—cancel anytime with a single click.',
  },
]

export default function HowItWorks() {
  return (
    <section className="py-16 md:py-24 px-4 bg-white">
      <div className="container mx-auto max-w-6xl">
        <FadeIn>
          <h2 className="text-3xl md:text-4xl font-bold text-charcoal text-center mb-12">
            How It Works in 4 Simple Steps
          </h2>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
          {steps.map((step, index) => (
            <FadeIn key={index} delay={100 + index * 100} duration={500}>
              <div className="flex flex-col items-center text-center relative">
                <div className="bg-[#135C5E] rounded-full w-16 h-16 flex items-center justify-center mb-4 shadow-lg relative z-10 transition-all duration-300 hover:scale-110 hover:shadow-xl">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold text-charcoal mb-2">{step.title}</h3>
                <p className="text-charcoal/80 leading-relaxed">{step.description}</p>

                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute transform translate-x-[118%] translate-y-8 z-0">
                    <svg height="2" width="80%">
                      <line x1="0" y1="0" x2="100%" y2="0" stroke="#135C5E" strokeWidth="2" strokeDasharray="5,5" />
                    </svg>
                  </div>
                )}
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
