'use client';

import { useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface MotionHighlightProps {
  children: React.ReactNode;
  className?: string;
  highlightColor?: string;
  highlightOpacity?: number;
  highlightSize?: number;
  duration?: number;
}

export function MotionHighlight({
  children,
  className,
  highlightColor = '#F0B90B',
  highlightOpacity = 0.3,
  highlightSize = 200,
  duration = 600,
}: MotionHighlightProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [highlight, setHighlight] = useState({ x: 0, y: 0, isVisible: false });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setHighlight({ x, y, isVisible: true });
  };

  const handleMouseLeave = () => {
    setHighlight(prev => ({ ...prev, isVisible: false }));
  };

  return (
    <div
      ref={containerRef}
      className={cn('relative overflow-hidden', className)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      
      <div
        className="absolute pointer-events-none rounded-full transition-opacity duration-300"
        style={{
          left: highlight.x - highlightSize / 2,
          top: highlight.y - highlightSize / 2,
          width: highlightSize,
          height: highlightSize,
          background: `radial-gradient(circle, ${highlightColor} ${highlightOpacity}, transparent 70%)`,
          opacity: highlight.isVisible ? 1 : 0,
          transition: `opacity ${duration}ms ease-out`,
        }}
      />
    </div>
  );
}


