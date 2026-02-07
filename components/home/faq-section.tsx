'use client'

import React from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const faqs = [
  {
    question: 'What ages is Wholesome Library for?',
    answer: 'Our stories are designed for children ages 4-12, organized into four reading levels: Early Reader (4-6), Independent (7-8), Confident (9-10), and Advanced (11-12). Each child can read at their own level.',
  },
  {
    question: 'How do you ensure stories are wholesome?',
    answer: 'Every story passes automated quality, safety, and values checks, then is reviewed by a human editor before publishing. We never publish stories with violence, mature themes, ads, or hidden inappropriate content.',
  },
  {
    question: 'Can I control what my child reads?',
    answer: 'Yes! You can set content preferences to include or exclude themes like fantasy/magic, mild conflict, faith themes, and more. The library automatically filters to show only stories that match your family\'s values.',
  },
  {
    question: 'How many stories are in the library?',
    answer: 'We launch with 50+ curated stories and add new ones daily. Our goal is to have hundreds of high-quality stories within the first few months, ensuring your child always has fresh content.',
  },
  {
    question: 'Do I need a credit card for the free trial?',
    answer: 'No! Start your 7-day free trial with just an email. You\'ll only be asked for payment if you decide to continue after the trial ends.',
  },
  {
    question: 'Can multiple children use one account?',
    answer: 'Yes! The Family Plan includes up to 5 child profiles, each with their own reading level, preferences, and progress tracking.',
  },
  {
    question: 'What if my child finds a story too easy or too hard?',
    answer: 'Each story has "Too Easy" and "Too Hard" feedback buttons at the end. We use this to help recommend the right level and can guide you to adjust their reading level setting.',
  },
  {
    question: 'Can I cancel anytime?',
    answer: 'Absolutely. Cancel with one click from your parent dashboard—no phone calls, no retention tactics. If you cancel, you keep access through the end of your billing period.',
  },
  {
    question: 'Are these AI-generated stories?',
    answer: 'Stories are created with modern tools and then reviewed and edited by humans to ensure quality and appropriateness. Every story is curated before your child sees it.',
  },
  {
    question: 'Will you add audiobooks or read-aloud features?',
    answer: 'Yes! Audio narration is planned for a future update. For now, we\'re focused on building the best reading experience with text-based stories.',
  },
]

export default function FAQSection() {
  return (
    <section id="faq" className="py-16 md:py-24 px-4 bg-gradient-to-br from-teal/5 to-white">
      <div className="container mx-auto max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-charcoal mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-charcoal/70">
            Everything you need to know about Wholesome Library
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-white border border-charcoal/10 rounded-xl px-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <AccordionTrigger className="text-left font-semibold text-charcoal hover:text-teal">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-charcoal/70 leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-12 text-center">
          <p className="text-charcoal/70 mb-4">Still have questions?</p>
          <a
            href="mailto:support@wholesomelibrary.com"
            className="text-teal font-medium hover:underline"
          >
            Contact our support team →
          </a>
        </div>
      </div>
    </section>
  )
}
