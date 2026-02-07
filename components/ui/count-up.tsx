'use client';

/**
 * Count Up - Animated number counter with IntersectionObserver
 */

import { useEffect, useRef, useState } from 'react';

interface CountUpProps {
  end: number;
  duration?: number;
  start?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}

export function CountUp({
  end,
  duration = 2000,
  start = 0,
  suffix = '',
  prefix = '',
  className = '',
}: CountUpProps) {
  const [count, setCount] = useState(start);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            
            const startTime = Date.now();
            const diff = end - start;

            const animate = () => {
              const now = Date.now();
              const elapsed = now - startTime;
              const progress = Math.min(elapsed / duration, 1);

              // Easing function (ease-out)
              const easeOut = 1 - Math.pow(1 - progress, 3);
              const current = Math.floor(start + diff * easeOut);

              setCount(current);

              if (progress < 1) {
                requestAnimationFrame(animate);
              } else {
                setCount(end);
              }
            };

            requestAnimationFrame(animate);
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(elementRef.current);

    return () => observer.disconnect();
  }, [end, start, duration, hasAnimated]);

  return (
    <span ref={elementRef} className={className}>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}
