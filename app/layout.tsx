import './globals.css'
import type { Metadata, Viewport } from 'next'
import { Poppins } from 'next/font/google'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import SkipNav from '@/components/ui/skip-nav'
import { Toaster } from '@/components/ui/sonner'
import { TRPCProvider } from '@/components/providers/trpc-provider'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-poppins',
})

export const metadata: Metadata = {
  title: 'Wholesome Library — Safe, Curated Stories for Kids',
  description: 'A growing library of quality-reviewed children\'s stories that parents can trust. Filtered by values, organized by reading level. No surprises, just great stories.',
  keywords: [
    'wholesome stories for kids',
    'safe children\'s stories',
    'age-appropriate stories',
    'christian children\'s stories online',
    'kids reading',
    'character education',
    'family-friendly stories',
    'bedtime stories',
    'virtue stories for kids',
  ],
  authors: [{ name: 'Wholesome Library' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://wholesomelibrary.com',
    siteName: 'Wholesome Library',
    title: 'Wholesome Library — Safe, Curated Stories for Kids',
    description: 'A growing library of quality-reviewed children\'s stories that parents can trust. Filtered by values, organized by reading level. No surprises, just great stories.',
    images: [
      {
        url: '/og-image.png', // TODO: Add actual OG image
        width: 1200,
        height: 630,
        alt: 'Wholesome Library - Safe Stories for Kids',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wholesome Library — Safe, Curated Stories for Kids',
    description: 'A growing library of quality-reviewed children\'s stories that parents can trust.',
    images: ['/og-image.png'], // TODO: Add actual Twitter card image
  },
  metadataBase: new URL('https://wholesomelibrary.com'), // Update with actual domain
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
      <body className={`${poppins.className} min-h-screen flex flex-col`}>
        <TRPCProvider>
          <SkipNav />
          <Navbar />
          <main id="main-content" className="flex-1 pt-16" tabIndex={-1}>
            {children}
          </main>
          <Footer />
          <Toaster />
        </TRPCProvider>
      </body>
    </html>
  )
}
