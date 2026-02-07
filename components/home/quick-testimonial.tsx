'use client'

import React from 'react'
import { Star } from 'lucide-react'

export default function QuickTestimonial() {
  return (
    <section className="py-12 px-4 bg-teal">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="w-6 h-6 text-accent fill-accent"
              />
            ))}
          </div>
          <blockquote className="text-xl md:text-2xl text-white mb-4 font-medium">
            "Finally, a place where I don't have to preview every single book before my kids read it. The curation is incredible—every story is engaging AND wholesome."
          </blockquote>
          <p className="text-white/90">
            — Sarah M., Mom of 3
          </p>
        </div>
      </div>
    </section>
  )
}
