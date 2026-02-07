'use client'

import React, { useState, useEffect } from 'react'
import { BookOpen, Menu, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => { window.removeEventListener('scroll', handleScroll) }
  }, [])

  const isActive = (path: string) => pathname === path

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-3'
      }`}
    >
      <nav className="container mx-auto px-4 md:px-8 flex justify-between items-center py-1.5">
        <div className="flex items-center">
          <BookOpen className="text-[#135C5E] h-8 w-8 mr-2" />
          <Link href="/" className="font-medium text-2xl text-[#135C5E]">
            Wholesome Library
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8">
          <Link
            href="/library"
            className={`font-medium text-lg ${
              isActive('/library')
                ? 'text-[#135C5E]'
                : 'text-charcoal/80 hover:text-[#135C5E]'
            } transition-colors`}
          >
            Stories
          </Link>
          <Link
            href="/#pricing"
            className="font-medium text-lg text-charcoal/80 hover:text-[#135C5E] transition-colors"
          >
            Pricing
          </Link>
          <Link
            href="/#faq"
            className="font-medium text-lg text-charcoal/80 hover:text-[#135C5E] transition-colors"
          >
            FAQ
          </Link>
        </div>

        <div className="hidden md:block">
          <Link
            href="/auth/signup"
            className="bg-[#135C5E] text-white font-medium text-lg py-3 px-6 rounded-full hover:bg-[#135C5E]/90 transition-colors"
          >
            Start Your Free 7-Day Trial
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-[#135C5E]"
          onClick={() => { setMobileMenuOpen(!mobileMenuOpen) }}
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg animate-fadeIn">
          <div className="flex flex-col space-y-4 px-4 py-6 container mx-auto">
            <Link
              href="/library"
              className={`font-medium text-lg ${
                isActive('/library')
                  ? 'text-[#135C5E]'
                  : 'text-charcoal/80 hover:text-[#135C5E]'
              } transition-colors`}
              onClick={() => { setMobileMenuOpen(false) }}
            >
              Stories
            </Link>
            <Link
              href="/#pricing"
              className="font-medium text-lg text-charcoal/80 hover:text-[#135C5E] transition-colors"
              onClick={() => { setMobileMenuOpen(false) }}
            >
              Pricing
            </Link>
            <Link
              href="/#faq"
              className="font-medium text-lg text-charcoal/80 hover:text-[#135C5E] transition-colors"
              onClick={() => { setMobileMenuOpen(false) }}
            >
              FAQ
            </Link>

            <Link
              href="/auth/signup"
              className="bg-[#135C5E] text-white font-medium text-lg py-3 px-6 rounded-full hover:bg-[#135C5E]/90 transition-colors text-center mt-4"
              onClick={() => { setMobileMenuOpen(false) }}
            >
              Start Your Free 7-Day Trial
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
