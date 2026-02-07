'use client'

import React from 'react'
import { Star } from 'lucide-react'
import { FadeIn } from '@/components/ui/fade-in'

export default function QuickTestimonial() {
  return (
    <section className="py-12 px-4 bg-[#135C5E]">
      <div className="container mx-auto max-w-4xl">
        <FadeIn>
          <div className="text-center">
            <div className="flex justify-center mb-4 gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-6 h-6 text-[#FFD166] fill-[#FFD166] animate-bounce-subtle"
                  style={{ animationDelay: `${i * 100}ms` }}
                />
              ))}
            </div>
            <blockquote className="text-xl md:text-2xl text-white mb-4 leading-relaxed">
              "My kids can't get enough of these books! The stories are engaging,
              educational, and most importantly, they keep coming back for more. It's been
              amazing to watch their reading skills and confidence grow."
            </blockquote>
            <p className="text-white/90 font-medium">
              - Sarah M., Parent of two avid readers
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
