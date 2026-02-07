'use client'

import React from 'react'
import Link from 'next/link'
import { BookOpen, Mail, Heart } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-charcoal text-white/80 pt-12 pb-8">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <BookOpen className="text-teal h-8 w-8 mr-2" />
              <span className="font-semibold text-2xl text-white">Wholesome Library</span>
            </div>
            <p className="text-white/70 mb-4 max-w-md">
              Curated children's stories you can trust. Every story is quality-reviewed and values-aligned before your child sees it.
            </p>
            <p className="text-white/50 text-sm italic">
              Stories created with modern tools + editorial review
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/library" className="hover:text-teal transition-colors">
                  Browse Library
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className="hover:text-teal transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="hover:text-teal transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/parent" className="hover:text-teal transition-colors">
                  Parent Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-white mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/legal/terms" className="hover:text-teal transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/legal/privacy" className="hover:text-teal transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/legal/children-privacy" className="hover:text-teal transition-colors">
                  Children's Privacy
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-teal transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-white/60">
            © {currentYear} Wholesome Library. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-sm text-white/60">
            Made with <Heart className="h-4 w-4 text-red-400 fill-red-400" /> for families everywhere
          </div>
        </div>
      </div>
    </footer>
  )
}
