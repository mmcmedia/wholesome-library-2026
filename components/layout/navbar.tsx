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
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isActive = (path: string) => pathname === path

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-4'
      }`}
    >
      <nav className="container mx-auto px-4 md:px-8 flex justify-between items-center" aria-label="Main navigation">
        <div className="flex items-center">
          <BookOpen className="text-teal h-8 w-8 mr-2" aria-hidden="true" />
          <Link href="/" className="font-semibold text-2xl text-teal" aria-label="Wholesome Library home">
            Wholesome Library
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          <Link
            href="/library"
            className={`font-medium ${
              isActive('/library')
                ? 'text-teal'
                : 'text-charcoal/80 hover:text-teal'
            } transition-colors`}
          >
            Browse Stories
          </Link>
          <Link
            href="/#pricing"
            className="font-medium text-charcoal/80 hover:text-teal transition-colors"
          >
            Pricing
          </Link>
          <Link
            href="/#faq"
            className="font-medium text-charcoal/80 hover:text-teal transition-colors"
          >
            FAQ
          </Link>
          <Link
            href="/auth/login"
            className="font-medium text-charcoal/80 hover:text-teal transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/auth/signup"
            className="bg-teal text-white font-medium py-2.5 px-6 rounded-full hover:bg-teal/90 transition-all transform hover:-translate-y-0.5 shadow-md"
          >
            Start Reading Free
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-teal"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg" role="dialog" aria-label="Mobile navigation menu">
          <div className="flex flex-col space-y-4 px-4 py-6">
            <Link
              href="/library"
              className={`font-medium ${
                isActive('/library') ? 'text-teal' : 'text-charcoal/80'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Browse Stories
            </Link>
            <Link
              href="/#pricing"
              className="font-medium text-charcoal/80"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link
              href="/#faq"
              className="font-medium text-charcoal/80"
              onClick={() => setMobileMenuOpen(false)}
            >
              FAQ
            </Link>
            <Link
              href="/auth/login"
              className="font-medium text-charcoal/80"
              onClick={() => setMobileMenuOpen(false)}
            >
              Sign In
            </Link>
            <Link
              href="/auth/signup"
              className="bg-teal text-white font-medium py-3 px-6 rounded-full text-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              Start Reading Free
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
