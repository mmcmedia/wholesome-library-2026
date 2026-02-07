import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://wholesomelibrary.com' // Update with actual domain
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/library',
          '/story/*',
          '/blog',
          '/blog/*',
          '/subscription',
        ],
        disallow: [
          '/parent/*',
          '/admin/*',
          '/auth/*',
          '/api/*',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
