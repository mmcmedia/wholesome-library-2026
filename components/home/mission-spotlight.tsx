'use client'

import React from 'react'
import Link from 'next/link'

export default function MissionSpotlight() {
  return (
    <section className="py-16 md:py-24 px-4 bg-white">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-charcoal mb-8">
          The Story Behind Wholesome Library
        </h2>

        <div className="bg-[#135C5E] rounded-2xl p-6 md:p-8 shadow-lg">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-shrink-0">
              <img
                src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Founder McKinzie Bean"
                className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover border-4 border-white/20 shadow-md"
              />
            </div>

            <div className="space-y-3">
              <h3 className="text-2xl font-bold text-white">I'm McKinzie Bean</h3>
              <p className="text-white text-lg leading-relaxed">
                —busy mom, lifelong reader. When my son raced through every "clean" book on our shelf
                and I didn't have time to vet dozens more, I knew there had to be a better way.
                So I built Wholesome Library: a growing collection of safe, uplifting stories that
                keep kids excited and parents worry-free.
              </p>
              <Link
                href="/about"
                className="inline-block text-white font-bold underline decoration-white/30 hover:decoration-white transition-colors mt-2"
              >
                Learn more about our mission →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
