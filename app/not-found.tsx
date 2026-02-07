import Link from 'next/link';
import { BookOpen } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white flex items-center justify-center px-4">
      <div className="text-center animate-fade-in-up">
        {/* Book icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative animate-float-medium">
            <BookOpen className="w-24 h-24 text-[#135C5E]" strokeWidth={1.5} />
            <div className="absolute -top-2 -right-2 text-6xl animate-bounce-subtle">
              📖
            </div>
          </div>
        </div>

        {/* 404 text */}
        <h1 className="text-8xl font-bold text-[#135C5E] mb-4">
          404
        </h1>

        {/* Message */}
        <h2 className="text-3xl font-semibold text-gray-900 mb-4">
          This story hasn&apos;t been written yet
        </h2>
        
        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          Looks like this page wandered off into an adventure of its own. 
          Let&apos;s get you back to the library!
        </p>

        {/* CTA Button */}
        <Link
          href="/library"
          className="inline-flex items-center gap-2 bg-[#135C5E] hover:bg-[#0D4446] text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105 hover:shadow-lg"
        >
          <BookOpen className="w-5 h-5" />
          Browse Our Library
        </Link>

        {/* Secondary link */}
        <div className="mt-6">
          <Link
            href="/"
            className="text-[#135C5E] hover:underline transition-all duration-200"
          >
            Or return to homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
