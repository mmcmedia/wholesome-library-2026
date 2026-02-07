'use client'

import React from 'react'
import { Star } from 'lucide-react'

export default function QuickTestimonial() {
  return (
    <section className="py-12 px-4 bg-[#135C5E]">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="w-6 h-6 text-[#FFD166] fill-[#FFD166]"
              />
            ))}
          </div>
          <blockquote className="text-xl md:text-2xl text-white mb-4">
            "My kids can't get enough of these books! The stories are engaging,
            educational, and most importantly, they keep coming back for more. It's been
            amazing to watch their reading skills and confidence grow."
          </blockquote>
          <p className="text-white/80">
            - Sarah M., Parent of two avid readers
          </p>
        </div>
      </div>
    </section>
  )
}
