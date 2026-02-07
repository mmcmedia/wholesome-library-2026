'use client'

import React from 'react'
import { Quote } from 'lucide-react'

const testimonials = [
  {
    content: 'My kids beg for \'storytime\' every night now—no more scrubbing through questionable content.',
    image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
    author: 'Sarah M.',
    role: 'Parent of Two',
  },
  {
    content: 'As a teacher, I appreciate how these stories spark discussion about kindness and teamwork.',
    image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
    author: 'Michael T.',
    role: '3rd-Grade Teacher',
  },
  {
    content: 'My son\'s reading stamina and confidence have soared—plus I love that I don\'t have to preview every book myself!',
    image: 'https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg',
    author: 'Jennifer K.',
    role: 'Mom of One',
  },
]

export default function Testimonials() {
  return (
    <section className="py-16 md:py-24 px-4 bg-[#135C5E]/10">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-3xl md:text-4xl font-bold text-charcoal text-center mb-12">
          What Families Are Saying
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-[#135C5E]/20 to-[#135C5E]/5 backdrop-blur-sm rounded-xl p-6 shadow-lg relative hover:shadow-xl transition-all duration-300"
            >
              <Quote className="absolute top-4 right-4 text-[#135C5E]/30 h-12 w-12" />
              <p className="text-charcoal/90 relative z-10 mb-6">"{testimonial.content}"</p>
              <div className="flex items-center">
                <img
                  src={testimonial.image}
                  alt={testimonial.author}
                  className="w-12 h-12 rounded-full object-cover mr-3"
                />
                <div className="ml-2">
                  <p className="font-medium text-charcoal">— {testimonial.author}</p>
                  <p className="text-sm text-charcoal/70">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
