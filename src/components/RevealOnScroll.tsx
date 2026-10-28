import React, { useEffect, useRef, useState } from 'react';

interface RevealOnScrollProps {
  children: React.ReactNode;
  className?: string;
  delayMs?: number;
}

export const RevealOnScroll: React.FC<RevealOnScrollProps> = ({
  children,
  className = '',
  delayMs = 0,
}) => {
  const elementRef = useRef<HTMLDivElement>(null);
  // Default to visible if SSR or IntersectionObserver is unsupported
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // If user prefers reduced motion, show immediately
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setIsVisible(true);
      return;
    }

    if (!('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (elementRef.current) {
            observer.unobserve(elementRef.current);
          }
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    const currentEl = elementRef.current;
    if (currentEl) {
      observer.observe(currentEl);
    }

    return () => {
      if (currentEl) {
        observer.unobserve(currentEl);
      }
    };
  }, []);

  const clampedDelay = Math.min(Math.max(delayMs, 0), 400);

  return (
    <div
      ref={elementRef}
      style={{
        transitionDuration: '500ms',
        transitionDelay: `${clampedDelay}ms`,
      }}
      className={`transition-all ease-out ${
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-5'
      } ${className}`}
    >
      {children}
    </div>
  );
};
