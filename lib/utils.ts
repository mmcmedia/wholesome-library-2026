import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export function getReadingLevelLabel(level: string): string {
  const labels: Record<string, string> = {
    early: 'Early Reader',
    independent: 'Independent',
    confident: 'Confident',
    advanced: 'Advanced',
  };
  return labels[level] || level;
}

export function getReadingLevelAgeRange(level: string): string {
  const ranges: Record<string, string> = {
    early: '4-6 years',
    independent: '7-8 years',
    confident: '9-10 years',
    advanced: '11-12 years',
  };
  return ranges[level] || '';
}

export function estimateReadTime(wordCount: number): number {
  // Average reading speed for children: 100-150 words/min (using 120)
  return Math.ceil(wordCount / 120);
}
