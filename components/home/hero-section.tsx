'use client'

import React from 'react'
import Link from 'next/link'

export default function HeroSection() {
  return (
    <section className="pt-28 md:pt-32 pb-16 md:pb-24 px-4 bg-gradient-to-br from-teal/10 to-white">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-8 md:gap-12">
          <div className="w-full md:w-1/2 space-y-6">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-charcoal leading-tight">
              Wholesome Stories Your Family Can Trust—Every Time
            </h1>

            <p className="text-lg text-charcoal/80 max-w-xl">
              An ever-growing library of clean, character-building tales—no surprises, just safe, uplifting adventures.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link
                href="/library"
                className="bg-[#135C5E] text-white font-medium py-3 px-6 rounded-full hover:bg-[#135C5E]/90 transition-all transform hover:-translate-y-1 shadow-md text-center"
              >
                Explore Free Previews
              </Link>
              <Link
                href="/auth/signup"
                className="border-2 border-[#135C5E] text-[#135C5E] font-medium py-3 px-6 rounded-full hover:bg-[#135C5E]/10 transition-all transform hover:-translate-y-1 text-center"
              >
                Start Your Free 7-Day Trial
              </Link>
            </div>
          </div>

          <div className="w-full md:w-1/2 relative">
            <div className="relative aspect-square max-w-md mx-auto">
              <div className="absolute top-0 right-0 w-4/5 h-4/5 bg-teal/20 rounded-full -z-10"></div>
              <img
                src="https://images.pexels.com/photos/8535214/pexels-photo-8535214.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                alt="Family reading together"
                className="rounded-full shadow-xl transform -rotate-2 object-cover w-full h-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
