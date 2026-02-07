'use client'

import React, { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

const faqs = [
  {
    question: 'What ages do you serve?',
    answer: 'We offer stories for ages 5–15, grouped into reading-level bands that you can adjust on the fly.',
  },
  {
    question: 'How does the free trial work?',
    answer: 'Enjoy 7 days of unlimited access—no credit card needed. Cancel anytime with zero obligation.',
  },
  {
    question: 'What happens when my trial ends?',
    answer: 'You\'ll receive a reminder 24 hours before billing. Plans start at $7.99/month (billed annually) or $9.99/month with monthly billing.',
  },
  {
    question: 'Can I filter out any theme?',
    answer: 'Absolutely. From \'magic\' to \'space travel,\' toggle off any topic you prefer—and toggle it back on whenever you like.',
  },
  {
    question: 'How do I get help?',
    answer: 'Our Story Specialists are available via live chat or email, 24/7—just click the \'Help\' icon in your dashboard.',
  },
]

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section id="faq" className="py-16 md:py-24 px-4 bg-[#135C5E]/10">
      <div className="container mx-auto max-w-3xl">
        <h2 className="text-3xl md:text-4xl font-bold text-charcoal text-center mb-12">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <button
                className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
                onClick={() => { toggleQuestion(index) }}
              >
                <span className="font-medium text-lg text-charcoal">{faq.question}</span>
                {openIndex === index
                  ? (
                    <ChevronUp className="w-5 h-5 text-[#135C5E]" />
                  )
                  : (
                    <ChevronDown className="w-5 h-5 text-[#135C5E]" />
                  )}
              </button>

              {openIndex === index && (
                <div className="px-6 pb-4 text-charcoal/80 animate-fadeIn">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
