'use client';

import React from 'react';

import { AnimatePresence, motion } from 'framer-motion';

interface WordAnimatorProps {
  words: string[];
  duration?: number;
  className?: string;
  padRightEm?: number;
}

const WordAnimator: React.FC<WordAnimatorProps> = ({
  words,
  duration = 2,
  padRightEm = 0.15,
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
        paddingRight: `${padRightEm}em`,
      }}
      className="overflow-visible"
    >
      <AnimatePresence mode="popLayout">
        <motion.span
          key={currentIndex}
          initial={{ y: 36, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -36, opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.4, 0.0, 0.2, 1] }}
          style={{ position: 'absolute', display: 'block', left: 0, right: 0 }}
          className="w-full bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-500 bg-clip-text font-medium text-transparent"
        >
          {words[currentIndex] ?? ''}
        </motion.span>
      </AnimatePresence>
      {/* Invisible text to preserve layout width/height */}
      <span style={{ visibility: 'hidden' }}>{words[currentIndex]}</span>
    </span>
  );
};

export default WordAnimator;
