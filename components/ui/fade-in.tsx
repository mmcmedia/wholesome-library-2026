'use client';

/**
 * Fade In - Scroll-triggered fade-in wrapper using IntersectionObserver
 */

import { ReactNode, useEffect, useRef, useState } from 'react';

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  threshold?: number;
  className?: string;
}

export function FadeIn({
  children,
  delay = 0,
  duration = 500,
  direction = 'up',
  threshold = 0.2,
  className = '',
}: FadeInProps) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => setIsVisible(true), delay);
          }
        });
      },
      { threshold }
    );

    observer.observe(elementRef.current);

    return () => observer.disconnect();
  }, [delay, threshold]);

  const getAnimation = () => {
    if (direction === 'up') return 'animate-fade-in-up';
    if (direction === 'left') return 'animate-slide-in';
    if (direction === 'right') return 'animate-slide-in-right';
    return 'animate-fade-in';
  };

  return (
    <div
      ref={elementRef}
      className={`${isVisible ? getAnimation() : 'opacity-0'} ${className}`}
      style={{
        transitionDuration: `${duration}ms`,
      }}
    >
      {children}
    </div>
  );
}
