'use client'

import React, { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { FadeIn } from '@/components/ui/fade-in'

const allBooks = [
  {
    id: '1',
    title: 'Cat Kid Comic Club',
    cover: 'https://images.pexels.com/photos/4245826/pexels-photo-4245826.jpeg',
    description: 'Join Cat Kid on a hilarious comic-creating adventure!',
  },
  {
    id: '2',
    title: 'Wings of Fire',
    cover: 'https://images.pexels.com/photos/5834/nature-grass-leaf-green.jpg',
    description: 'A thrilling dragon fantasy series about destiny and freedom',
  },
  {
    id: '3',
    title: 'Dog Man: Mothering Heights',
    cover: 'https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg',
    description: 'The heroic hound is back for another epic adventure!',
  },
  {
    id: '4',
    title: 'Dog Man: Brawl of the Wild',
    cover: 'https://images.pexels.com/photos/2253275/pexels-photo-2253275.jpeg',
    description: 'Join Dog Man in his wildest adventure yet!',
  },
  {
    id: '5',
    title: 'The Magic Tree House',
    cover: 'https://images.pexels.com/photos/957024/forest-trees-perspective-bright-957024.jpeg',
    description: 'Travel through time on magical adventures!',
  },
  {
    id: '6',
    title: 'The Wild Robot',
    cover: 'https://images.pexels.com/photos/2085831/pexels-photo-2085831.jpeg',
    description: 'A heartwarming tale of survival and friendship',
  },
  {
    id: '7',
    title: 'Wonder',
    cover: 'https://images.pexels.com/photos/1906658/pexels-photo-1906658.jpeg',
    description: 'A story about kindness and acceptance',
  },
  {
    id: '8',
    title: 'The One and Only Ivan',
    cover: 'https://images.pexels.com/photos/4666751/pexels-photo-4666751.jpeg',
    description: 'An unforgettable tale of friendship and hope',
  },
]

export default function StoriesPreview() {
  const [currentPage, setCurrentPage] = useState(0)
  const booksPerPage = 4
  const totalPages = Math.ceil(allBooks.length / booksPerPage)

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages)
  }

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages)
  }

  const currentBooks = allBooks.slice(
    currentPage * booksPerPage,
    (currentPage + 1) * booksPerPage
  )

  return (
    <section className="py-16 md:py-24 px-4 bg-gradient-to-br from-[#135C5E]/10 to-white">
      <div className="container mx-auto max-w-6xl">
        <FadeIn>
          <h2 className="text-3xl md:text-4xl font-bold text-charcoal text-center mb-4">
            Peek Inside Our Stories
          </h2>
          <p className="text-center text-charcoal/80 mb-8 text-lg">
            Click any cover to read a free preview—instantly in your browser.
          </p>
        </FadeIn>

        <div className="relative">
          <button
            onClick={prevPage}
            className="absolute -left-12 top-1/2 -translate-y-1/2 bg-[#135C5E] text-white w-12 h-12 rounded-full flex items-center justify-center border-4 border-white shadow-lg hover:bg-[#135C5E]/90 transition-colors z-10"
            aria-label="Previous books"
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={nextPage}
            className="absolute -right-12 top-1/2 -translate-y-1/2 bg-[#135C5E] text-white w-12 h-12 rounded-full flex items-center justify-center border-4 border-white shadow-lg hover:bg-[#135C5E]/90 transition-colors z-10"
            aria-label="Next books"
          >
            <ChevronRight size={24} />
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {currentBooks.map((book, index) => (
              <FadeIn key={index} delay={100 + index * 100} duration={500}>
                <div className="flex flex-col items-center">
                  <div className="relative mb-4 transform hover:scale-110 transition-all duration-300 hover:shadow-2xl cursor-pointer">
                    <Link href={`/story/${book.id}`}>
                      <img
                        src={book.cover}
                        alt={book.title}
                        className="w-56 h-80 object-cover rounded-xl border-8 border-white shadow-xl"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-xl opacity-0 hover:opacity-100 transition-all duration-300">
                        <button className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#135C5E] text-white px-6 py-2 rounded-full border-2 border-white hover:bg-[#135C5E]/90 transition-all duration-200 hover:scale-110 shadow-lg font-bold">
                          Preview
                        </button>
                      </div>
                    </Link>
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-bold text-charcoal mb-2">
                      {book.title}
                    </h3>
                    <p className="text-charcoal/80 text-sm leading-relaxed">{book.description}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
