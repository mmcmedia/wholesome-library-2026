import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Calendar, Tag } from 'lucide-react'
import { getBlogPost, getAllBlogPosts } from '@/lib/blog-data'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface PageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = getBlogPost(params.slug)
  
  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  return {
    title: `${post.title} — Wholesome Library Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt.toISOString(),
      authors: [post.author],
      tags: post.tags,
    },
  }
}

export async function generateStaticParams() {
  const posts = getAllBlogPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export default function BlogPostPage({ params }: PageProps) {
  const post = getBlogPost(params.slug)

  if (!post) {
    notFound()
  }

  return (
    <article className="min-h-screen bg-gradient-to-br from-teal/5 to-white">
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        {/* Back Button */}
        <Link href="/blog">
          <Button variant="ghost" className="mb-8 gap-2">
            <ChevronLeft className="h-4 w-4" />
            Back to Blog
          </Button>
        </Link>

        {/* Article Header */}
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-charcoal mb-4 leading-tight">
            {post.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-charcoal/60 mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <time dateTime={post.publishedAt.toISOString()}>
                {post.publishedAt.toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </time>
            </div>
            <div>By {post.author}</div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>
        </header>

        {/* Cover Image Placeholder */}
        {post.coverImage && (
          <div className="mb-8 rounded-xl overflow-hidden">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-auto"
            />
          </div>
        )}

        {/* Article Content */}
        <div
          className="prose prose-lg max-w-none
            prose-headings:text-charcoal prose-headings:font-bold
            prose-h1:text-3xl prose-h1:mb-4
            prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
            prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
            prose-p:text-charcoal/80 prose-p:leading-relaxed prose-p:mb-4
            prose-strong:text-charcoal prose-strong:font-semibold
            prose-ul:my-4 prose-li:text-charcoal/80
            prose-a:text-teal prose-a:no-underline hover:prose-a:underline"
          style={{ fontFamily: 'var(--font-poppins)' }}
        >
          {/* Split content by newlines and render as paragraphs/HTML */}
          <div dangerouslySetInnerHTML={{ __html: formatContent(post.content) }} />
        </div>

        {/* Footer CTA */}
        <div className="mt-12 pt-8 border-t border-charcoal/10">
          <div className="bg-teal/5 rounded-xl p-8 text-center">
            <h3 className="text-2xl font-bold text-charcoal mb-3">
              Ready to find great stories for your family?
            </h3>
            <p className="text-charcoal/70 mb-6">
              Browse our library of quality-reviewed, values-aligned stories for kids.
            </p>
            <Link href="/library">
              <Button size="lg" className="bg-teal hover:bg-teal/90 text-white">
                Explore the Library
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}

/**
 * Simple markdown-like formatting for blog content
 * Converts common markdown patterns to HTML
 */
function formatContent(content: string): string {
  return content
    // Headers
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    // Bold
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    // Lists
    .replace(/^\- (.*$)/gim, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
    // Paragraphs (lines with content)
    .split('\n\n')
    .map(para => {
      para = para.trim()
      if (!para) return ''
      // Don't wrap if already wrapped in HTML tag
      if (para.startsWith('<')) return para
      return `<p>${para}</p>`
    })
    .join('\n')
}
