'use client';

import { type ReactNode, useRef } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export function HorizontalCardRail({
  label,
  children,
  className = '',
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  const rail = useRef<HTMLElement>(null);

  const move = (direction: -1 | 1) => {
    if (!rail.current) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    rail.current.scrollBy({
      left: direction * rail.current.clientWidth * 0.88,
      behavior: reducedMotion ? 'auto' : 'smooth',
    });
  };

  return <div className={`experience-rail-shell ${className}`.trim()}>
    <div className="experience-rail-controls" aria-label={`${label} slide controls`}>
      <button type="button" onClick={() => move(-1)} aria-label={`Show previous ${label.toLowerCase()}`}><ArrowLeft size={18} /></button>
      <button type="button" onClick={() => move(1)} aria-label={`Show next ${label.toLowerCase()}`}><ArrowRight size={18} /></button>
    </div>
    <section ref={rail} className="experience-rail" aria-label={`${label}, arranged from left to right`}>{children}</section>
  </div>;
}
