'use client';

import { cn } from '@/lib/utils';
import React from 'react';

interface WordAnimatorProps {
  words: string[];
  duration?: number;
  className?: string;
}

const WordAnimator: React.FC<WordAnimatorProps> = ({
  words,
  duration = 2,
  className = '',
}) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    if (words.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % words.length);
    }, duration * 1000);

    return () => clearInterval(interval);
  }, [words.length, duration]);

  return (
    <span
      style={{
        display: 'inline-block',
        position: 'relative',
        verticalAlign: 'bottom',
      }}
      className={cn('overflow-hidden rounded-md border text-left', className)}
    >
      <span className="bnb-pattern pointer-events-none absolute left-0 top-0 z-10 h-full w-full opacity-10 content-['']" />
      <span
        key={currentIndex}
        style={{ position: 'absolute', display: 'block', left: 0, right: 0 }}
        className="w-full bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-500 bg-clip-text font-medium text-transparent"
      >
        {words[currentIndex] ?? ''}
      </span>
      <span style={{ visibility: 'hidden' }}>{words[currentIndex]}</span>
    </span>
  );
};

export default WordAnimator;
