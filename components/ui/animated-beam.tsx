'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedBeamProps {
  className?: string;
  containerRef: React.RefObject<HTMLElement>;
  fromRef: React.RefObject<HTMLElement>;
  toRef: React.RefObject<HTMLElement>;
  curvature?: number;
  reverse?: boolean;
  pathColor?: string;
  pathWidth?: number;
  pathOpacity?: number;
  gradientStartColor?: string;
  gradientStopColor?: string;
  delay?: number;
  duration?: number;
}

export function AnimatedBeam({
  className,
  containerRef,
  fromRef,
  toRef,
  curvature = 0,
  reverse = false,
  pathColor = '#F0B90B',
  pathWidth = 2,
  pathOpacity = 0.2,
  gradientStartColor = '#F0B90B',
  gradientStopColor = '#00D4AA',
  delay = 0,
  duration = 2,
}: AnimatedBeamProps) {
  const pathRef = useRef<SVGPathElement>(null);
  const [pathD, setPathD] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updatePath = () => {
      if (!containerRef.current || !fromRef.current || !toRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const fromRect = fromRef.current.getBoundingClientRect();
      const toRect = toRef.current.getBoundingClientRect();

      const fromX = fromRect.left + fromRect.width / 2 - containerRect.left;
      const fromY = fromRect.top + fromRect.height / 2 - containerRect.top;
      const toX = toRect.left + toRect.width / 2 - containerRect.left;
      const toY = toRect.top + toRect.height / 2 - containerRect.top;

      const midX = (fromX + toX) / 2;
      const midY = (fromY + toY) / 2;
      const controlY = midY + curvature * Math.abs(toX - fromX);

      const startX = reverse ? toX : fromX;
      const startY = reverse ? toY : fromY;
      const endX = reverse ? fromX : toX;
      const endY = reverse ? fromY : toY;

      const path = `M ${startX} ${startY} Q ${midX} ${controlY} ${endX} ${endY}`;
      setPathD(path);
      setIsVisible(true);
    };

    updatePath();
    window.addEventListener('resize', updatePath);
    window.addEventListener('scroll', updatePath);

    return () => {
      window.removeEventListener('resize', updatePath);
      window.removeEventListener('scroll', updatePath);
    };
  }, [containerRef, fromRef, toRef, curvature, reverse]);

  return (
    <svg
      className={cn('absolute inset-0 pointer-events-none', className)}
      width="100%"
      height="100%"
    >
      <defs>
        <linearGradient id="beam-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={gradientStartColor} stopOpacity="0" />
          <stop offset="50%" stopColor={gradientStartColor} stopOpacity="1" />
          <stop offset="100%" stopColor={gradientStopColor} stopOpacity="0" />
        </linearGradient>
      </defs>
      
      <path
        ref={pathRef}
        d={pathD}
        fill="none"
        stroke={pathColor}
        strokeWidth={pathWidth}
        strokeOpacity={pathOpacity}
        className="transition-opacity duration-300"
        style={{ opacity: isVisible ? 1 : 0 }}
      />
      
      <path
        d={pathD}
        fill="none"
        stroke="url(#beam-gradient)"
        strokeWidth={pathWidth}
        strokeDasharray="5,5"
        className="animate-pulse"
        style={{
          animationDelay: `${delay}s`,
          animationDuration: `${duration}s`,
          opacity: isVisible ? 1 : 0,
        }}
      />
    </svg>
  );
}


