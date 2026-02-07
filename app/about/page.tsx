'use client'

import React from 'react'
import { BookOpen, CheckCircle, Heart, Lightbulb, Users, Shield } from 'lucide-react'

export default function AboutPage() {
  const values = [
    { title: 'Courage', description: 'Facing fears, trying new things, standing up for what\'s right' },
    { title: 'Kindness', description: 'Generosity, empathy, helping others' },
    { title: 'Honesty', description: 'Truthfulness, integrity, keeping promises' },
    { title: 'Perseverance', description: 'Not giving up, working through challenges' },
    { title: 'Gratitude', description: 'Appreciating what you have, saying thank you' },
    { title: 'Teamwork', description: 'Working together, valuing different strengths' },
    { title: 'Forgiveness', description: 'Second chances, letting go of grudges' },
    { title: 'Responsibility', description: 'Owning mistakes, taking care of duties' },
    { title: 'Creativity', description: 'Imagination, problem-solving, thinking differently' },
    { title: 'Respect', description: 'For self, others, nature, and authority' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-teal-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 md:px-8 py-20">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-block bg-teal-100 rounded-full p-4 mb-6">
            <BookOpen className="h-12 w-12 text-teal" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-charcoal mb-6">
            About Wholesome Library
          </h1>
          <p className="text-xl md:text-2xl text-gray-600">
            Stories you can trust. A library designed by families, for families.
          </p>
        </div>
      </div>

      {/* Our Mission */}
      <section className="bg-white">
        <div className="container mx-auto px-4 md:px-8 py-16">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <Heart className="h-8 w-8 text-teal flex-shrink-0" />
              <h2 className="text-3xl font-bold text-charcoal">Our Mission</h2>
            </div>
            <p className="text-lg text-gray-700 leading-relaxed">
              Every child deserves access to stories that inspire, delight, and shape their values. Too many parents spend hours vetting books, scrolling through reviews, and worrying about hidden messages. We built Wholesome Library to end that struggle.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mt-6">
              <strong>Our promise:</strong> Safe, engaging reading for every family. Every story on Wholesome Library is reviewed by our editorial team before your child sees it — no surprises, no hidden agendas, just great stories that help kids grow.
            </p>
          </div>
        </div>
      </section>

      {/* How We Create Stories */}
      <section className="bg-gradient-to-r from-teal-50 to-blue-50">
        <div className="container mx-auto px-4 md:px-8 py-16">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <Lightbulb className="h-8 w-8 text-teal flex-shrink-0" />
              <h2 className="text-3xl font-bold text-charcoal">How We Create Stories</h2>
            </div>
            
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              <strong>Created with modern tools + editorial review.</strong> Every story begins with a story brief that describes the reading level, genre, values, and themes. Our process combines cutting-edge AI tools with thoughtful human judgment to create stories that are both high-quality and aligned with what families value most.
            </p>

            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="bg-teal text-white rounded-full h-10 w-10 flex items-center justify-center flex-shrink-0 font-bold">1</div>
                <div>
                  <h3 className="font-semibold text-charcoal mb-2">Story Design</h3>
                  <p className="text-gray-700">We begin with a carefully crafted brief: "A story about a shy girl learning to speak up, ages 7-8, with themes of courage and friendship."</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="bg-teal text-white rounded-full h-10 w-10 flex items-center justify-center flex-shrink-0 font-bold">2</div>
                <div>
                  <h3 className="font-semibold text-charcoal mb-2">AI-Assisted Writing</h3>
                  <p className="text-gray-700">Modern AI tools help us rapidly create story drafts that are engaging and age-appropriate, maintaining consistent character development and pacing throughout.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="bg-teal text-white rounded-full h-10 w-10 flex items-center justify-center flex-shrink-0 font-bold">3</div>
                <div>
                  <h3 className="font-semibold text-charcoal mb-2">Automated Quality Checks</h3>
                  <p className="text-gray-700">Every story passes through automated checks for narrative consistency, age-appropriateness, safety, and alignment with our values framework.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="bg-teal text-white rounded-full h-10 w-10 flex items-center justify-center flex-shrink-0 font-bold">4</div>
                <div>
                  <h3 className="font-semibold text-charcoal mb-2">Human Editorial Review</h3>
                  <p className="text-gray-700">Our editorial team reads and approves every story before it goes live. We look for engaging plots, authentic characters, and alignment with our values.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="bg-teal text-white rounded-full h-10 w-10 flex items-center justify-center flex-shrink-0 font-bold">5</div>
                <div>
                  <h3 className="font-semibold text-charcoal mb-2">Published & Ready</h3>
                  <p className="text-gray-700">Only stories that pass all checks are published to our library. Every story has been reviewed by a human editor before your child reads it.</p>
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-600 italic mt-8 p-4 bg-white rounded border border-gray-200">
              Why this matters: We could generate stories faster without the editorial step, but we chose quality over speed. Every story on Wholesome Library has been personally reviewed by our team — not just scanned by a computer.
            </p>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="bg-white">
        <div className="container mx-auto px-4 md:px-8 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-12">
              <Shield className="h-8 w-8 text-teal flex-shrink-0" />
              <h2 className="text-3xl font-bold text-charcoal">Our Values</h2>
            </div>
            
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              Every story on Wholesome Library celebrates these 10 values. They're woven naturally throughout our stories — not preachy or forced, just the kind of character growth and life lessons that resonate with children.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {values.map((value, index) => (
                <div key={index} className="p-6 border-l-4 border-teal bg-teal-50 rounded">
                  <h3 className="text-xl font-semibold text-teal mb-2">{value.title}</h3>
                  <p className="text-gray-700">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* For Parents */}
      <section className="bg-gradient-to-r from-teal-50 to-green-50">
        <div className="container mx-auto px-4 md:px-8 py-16">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <Users className="h-8 w-8 text-teal flex-shrink-0" />
              <h2 className="text-3xl font-bold text-charcoal">For Parents</h2>
            </div>

            <h3 className="text-2xl font-semibold text-charcoal mb-4">Quality Assurance You Can Trust</h3>

            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              You know your child best. That's why we built Wholesome Library with tools that put YOU in control:
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-4">
                <CheckCircle className="h-6 w-6 text-teal flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-charcoal mb-1">Every Story Reviewed</h4>
                  <p className="text-gray-700">Our editorial team personally reviews every single story before it's published. We check for age-appropriateness, engaging plots, wholesome content, and alignment with family values.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <CheckCircle className="h-6 w-6 text-teal flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-charcoal mb-1">Content Filters You Control</h4>
                  <p className="text-gray-700">Choose what your family sees. Want to include fantasy stories? Faith themes? You decide. Your preferences instantly filter the library to show only stories your family will enjoy.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <CheckCircle className="h-6 w-6 text-teal flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-charcoal mb-1">Reading Progress Tracking</h4>
                  <p className="text-gray-700">See which stories your child has read, how long they spent reading, and what their reading journey looks like. Share reading wins with grandparents or teachers.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <CheckCircle className="h-6 w-6 text-teal flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-charcoal mb-1">Complete Privacy</h4>
                  <p className="text-gray-700">Your child's reading activity is private. We never share, sell, or advertise to children. We comply with COPPA and have your family's privacy as our top priority.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <CheckCircle className="h-6 w-6 text-teal flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-charcoal mb-1">Always Growing</h4>
                  <p className="text-gray-700">We add new stories regularly, so there's always something fresh to read. Never run out of quality content for your family.</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-teal-200">
              <p className="text-gray-700">
                <strong>The Bottom Line:</strong> We do the work of vetting so you don't have to. You can trust that every story on Wholesome Library is safe, engaging, and aligned with wholesome family values.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why We Exist */}
      <section className="bg-white">
        <div className="container mx-auto px-4 md:px-8 py-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-charcoal mb-8">Why We Exist</h2>

            <div className="space-y-6 text-gray-700">
              <p>
                We started Wholesome Library because we realized something: parents want their kids to read more, but modern content feels like a minefield. One minute your kid is reading an adorable picture book, the next there's a surprise "mature theme" or sarcastic anti-authority message that doesn't fit your family values.
              </p>

              <p>
                Epic! and similar services have thousands of books, but so what if you have to vet them all yourself? That defeats the purpose. Wholesome Library is smaller by design — we'd rather have 200 stories we fully stand behind than 40,000 that you have to screen yourself.
              </p>

              <p>
                This isn't about censorship or fear. It's about giving parents a choice. A place where someone has already done the work of checking: Is this age-appropriate? Is the ending hopeful? Are the characters good role models? Do the values align with what I'm teaching my kids?
              </p>

              <p>
                <strong>That's Wholesome Library.</strong> We're parents too. We get it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="bg-gradient-to-r from-teal via-teal-600 to-teal-700 text-white">
        <div className="container mx-auto px-4 md:px-8 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to discover stories your family will love?
            </h2>
            <p className="text-lg text-teal-50 mb-8">
              Start your free 7-day trial today. No credit card required.
            </p>
            <a
              href="/auth/signup"
              className="inline-block bg-white text-teal font-semibold px-8 py-3 rounded-lg hover:bg-teal-50 transition-colors"
            >
              Start Free Trial
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
