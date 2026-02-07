import './globals.css'
import type { Metadata, Viewport } from 'next'
import { Poppins } from 'next/font/google'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import { Toaster } from '@/components/ui/sonner'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-poppins',
})

export const metadata: Metadata = {
  title: 'Wholesome Library - Curated Children\'s Stories',
  description: 'A digital library of wholesome, character-building stories for children ages 4-12. Every story is quality-reviewed and values-aligned.',
  keywords: ['children\'s stories', 'wholesome content', 'kids reading', 'character education', 'family-friendly'],
}

export const viewport: Viewport = {
  themeColor: '#135C5E',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-16">
          {children}
        </main>
        <Footer />
        <Toaster />
      </body>
    </html>
  )
}
