import { Metadata } from 'next'
import Link from 'next/link'
import { Calendar, Tag } from 'lucide-react'
import { getAllBlogPosts } from '@/lib/blog-data'
import { Badge } from '@/components/ui/badge'

export const metadata: Metadata = {
  title: 'Blog — Wholesome Library',
  description: 'Tips for parents on choosing age-appropriate books, teaching values through stories, and building lifelong readers.',
  openGraph: {
    title: 'Blog — Wholesome Library',
    description: 'Tips for parents on choosing age-appropriate books, teaching values through stories, and building lifelong readers.',
  },
}

export default function BlogIndexPage() {
  const posts = getAllBlogPosts()

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal/5 to-white">
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Header */}
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-charcoal mb-4">
            Wholesome Library Blog
          </h1>
          <p className="text-xl text-charcoal/70 max-w-2xl mx-auto">
            Practical tips for raising readers, choosing great books, and teaching values through stories.
          </p>
        </header>

        {/* Blog Post Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="bg-white rounded-xl shadow-md border border-teal/10 hover:shadow-lg transition-shadow overflow-hidden group"
            >
              <Link href={`/blog/${post.slug}`}>
                {/* Cover Image Placeholder */}
                <div className="h-48 bg-gradient-to-br from-teal/20 to-teal/5 flex items-center justify-center group-hover:from-teal/30 group-hover:to-teal/10 transition-colors">
                  <Tag className="h-12 w-12 text-teal/40" />
                </div>

                {/* Content */}
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-charcoal mb-3 group-hover:text-teal transition-colors">
                    {post.title}
                  </h2>
                  
                  <p className="text-charcoal/70 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center gap-4 text-sm text-charcoal/60">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {post.publishedAt.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>

        {/* Empty State (if no posts) */}
        {posts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-xl text-charcoal/60">
              Blog posts coming soon!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
