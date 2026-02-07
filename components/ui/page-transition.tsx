'use client';

/**
 * Page Transition - Route change animation wrapper
 */

import { ReactNode, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

interface PageTransitionProps {
  children: ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [transitionStage, setTransitionStage] = useState<'fade-in' | 'fade-out'>('fade-in');

  useEffect(() => {
    if (children !== displayChildren) {
      setTransitionStage('fade-out');
    }
  }, [children, displayChildren]);

  useEffect(() => {
    if (transitionStage === 'fade-out') {
      const timer = setTimeout(() => {
        setDisplayChildren(children);
        setTransitionStage('fade-in');
      }, 200);

      return () => clearTimeout(timer);
    }
  }, [transitionStage, children]);

  return (
    <div
      className={`${
        transitionStage === 'fade-in' ? 'animate-fade-in' : 'animate-fade-out opacity-0'
      }`}
      style={{
        animationDuration: '200ms',
      }}
    >
      {displayChildren}
    </div>
  );
}
