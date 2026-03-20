'use client';

import { useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  threshold?: number;
  delay?: number;
}

export function ScrollReveal({ children, className = '', threshold = 0.1, delay = 0 }: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              setIsVisible(true);
            }, delay);
            // Optional: stop observing once it's visible, so it doesn't fade out again.
            if (domRef.current) observer.unobserve(domRef.current);
          }
        });
      },
      { rootMargin: '0px 0px -50px 0px', threshold }
    );

    const currentRef = domRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [threshold, delay]);

  return (
    <div
      ref={domRef}
      className={`scroll-glass-reveal ${isVisible ? 'is-visible' : ''} ${className}`}
    >
      {children}
    </div>
  );
}
