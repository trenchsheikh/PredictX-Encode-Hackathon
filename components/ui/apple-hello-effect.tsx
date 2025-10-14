'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface AppleHelloEffectProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  scale?: number;
  rotation?: number;
}

export function AppleHelloEffect({
  children,
  className,
  delay = 0,
  duration = 1000,
  scale = 1.1,
  rotation = 5,
}: AppleHelloEffectProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      setIsAnimating(true);

      setTimeout(() => {
        setIsAnimating(false);
      }, duration);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay, duration]);

  return (
    <div
      className={cn(
        'transition-all duration-1000 ease-out',
        isVisible ? 'opacity-100' : 'opacity-0',
        isAnimating ? 'animate-pulse' : '',
        className
      )}
      style={{
        transform: isVisible
          ? `scale(${isAnimating ? scale : 1}) rotate(${isAnimating ? rotation : 0}deg)`
          : 'scale(0.8) rotate(-10deg)',
        transition: `transform ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`,
      }}
    >
      {children}
    </div>
  );
}
