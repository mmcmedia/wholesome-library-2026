import { MetadataRoute } from 'next'

// In production, this would fetch from the database
// For now, we'll use mock data structure
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://wholesomelibrary.com' // Update with actual domain
  
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/library`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/subscription`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ]

  // TODO: In production, fetch published stories from database
  // For now, we'll generate based on mock data structure
  // const stories = await db.select().from(storiesTable).where(eq(storiesTable.status, 'published'))
  
  // Story pages (mock structure - will be dynamic)
  const storyPages: MetadataRoute.Sitemap = [
    // These will be generated dynamically from database
    // Example structure:
    // {
    //   url: `${baseUrl}/story/${story.slug}`,
    //   lastModified: story.publishedAt,
    //   changeFrequency: 'monthly',
    //   priority: 0.8,
    // }
  ]

  // Blog posts
  const blogPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/blog/how-to-choose-age-appropriate-books`,
      lastModified: new Date('2026-02-01'),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/blog/teaching-virtues-through-stories`,
      lastModified: new Date('2026-02-01'),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/blog/why-we-review-every-story`,
      lastModified: new Date('2026-02-01'),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ]

  return [...staticPages, ...storyPages, ...blogPages]
}
