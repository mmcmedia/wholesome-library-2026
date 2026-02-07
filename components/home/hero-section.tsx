'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function HeroSection() {
  return (
    <section className="pt-12 pb-16 md:pb-24 px-4 bg-gradient-to-br from-teal/10 to-white">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-8 md:gap-12">
          <div className="w-full md:w-1/2 space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-charcoal leading-tight">
              Wholesome Stories Your Family Can{' '}
              <span className="text-teal relative inline-block">
                Trust
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  height="12"
                  viewBox="0 0 200 12"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 9c40-4 80-6 120-5 30 1 60 3 76 6"
                    stroke="#FFB84D"
                    strokeWidth="4"
                    fill="none"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>

            <p className="text-lg md:text-xl text-charcoal/80 max-w-xl">
              An ever-growing library of clean, character-building tales. Every story reviewed before your child sees it—no surprises, just uplifting adventures.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/auth/signup">
                <Button
                  size="lg"
                  className="bg-teal hover:bg-teal/90 text-white font-medium px-8 py-6 text-lg rounded-full shadow-lg hover:-translate-y-1 transition-all"
                >
                  Start Your Free 7-Day Trial
                </Button>
              </Link>
              <Link href="/library">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-teal text-teal hover:bg-teal/10 font-medium px-8 py-6 text-lg rounded-full hover:-translate-y-1 transition-all"
                >
                  Browse Free Stories
                </Button>
              </Link>
            </div>

            <p className="text-sm text-charcoal/60">
              No credit card required • Cancel anytime • 5 free stories, no signup needed
            </p>
          </div>

          <div className="w-full md:w-1/2 relative">
            <div className="relative aspect-square max-w-md mx-auto">
              <div className="absolute top-0 right-0 w-4/5 h-4/5 bg-teal/20 rounded-full -z-10 animate-float"></div>
              <img
                src="https://images.pexels.com/photos/8535214/pexels-photo-8535214.jpeg?auto=compress&cs=tinysrgb&w=800"
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
