'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface AnimatedBackgroundProps {
  variant?: 'default' | 'gradient' | 'particles' | 'grid';
  className?: string;
}

export function AnimatedBackground({
  variant = 'default',
  className = '',
}: AnimatedBackgroundProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className={`fixed inset-0 -z-50 ${className}`} />;
  }

  const renderBackground = () => {
    switch (variant) {
      case 'gradient':
        return (
          <div className="fixed inset-0 -z-50">
            {/* Base dark gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800" />

            {/* Animated overlay gradients */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-500/10 to-transparent"
              animate={{
                x: ['-100%', '100%'],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />

            <motion.div
              className="absolute inset-0 bg-gradient-to-b from-transparent via-yellow-400/5 to-transparent"
              animate={{
                y: ['-100%', '100%'],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 2,
              }}
            />
          </div>
        );

      case 'particles':
        return (
          <div className="fixed inset-0 -z-50 overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-800">
            {/* Floating particles */}
            {Array.from({ length: 50 }).map((_, i) => (
              <motion.div
                key={`particle-${i}`}
                className="absolute h-2 w-2 rounded-full bg-yellow-400/30"
                animate={{
                  x: [0, Math.random() * 200 - 100],
                  y: [0, Math.random() * 200 - 100],
                  scale: [0, 1, 0],
                  opacity: [0, 0.8, 0],
                }}
                transition={{
                  duration: 6 + Math.random() * 4,
                  repeat: Infinity,
                  delay: Math.random() * 5,
                  ease: 'easeInOut',
                }}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
              />
            ))}

            {/* Larger floating orbs */}
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={`orb-${i}`}
                className="absolute h-16 w-16 rounded-full bg-yellow-400/10 blur-xl"
                animate={{
                  x: [0, Math.random() * 400 - 200],
                  y: [0, Math.random() * 400 - 200],
                  scale: [0.5, 1.5, 0.5],
                }}
                transition={{
                  duration: 15 + Math.random() * 10,
                  repeat: Infinity,
                  delay: Math.random() * 8,
                  ease: 'easeInOut',
                }}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
              />
            ))}
          </div>
        );

      case 'grid':
        return (
          <div className="fixed inset-0 -z-50 bg-gradient-to-br from-gray-900 via-black to-gray-800">
            {/* Animated grid pattern */}
            <div className="absolute inset-0 opacity-20">
              <div
                className="h-full w-full"
                style={{
                  backgroundImage: `
                    linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                  `,
                  backgroundSize: '50px 50px',
                }}
              />
            </div>

            {/* Moving grid lines */}
            <motion.div
              className="absolute inset-0"
              animate={{
                backgroundPosition: ['0px 0px', '50px 50px'],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: 'linear',
              }}
              style={{
                backgroundImage: `
                  linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
                `,
                backgroundSize: '100px 100px',
              }}
            />
          </div>
        );

      default:
        return (
          <div className="fixed inset-0 -z-50">
            {/* Base dark gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800" />

            {/* Subtle animated overlay */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-500/10 to-transparent"
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </div>
        );
    }
  };

  return (
    <div className={`fixed inset-0 -z-50 ${className}`}>
      {renderBackground()}
    </div>
  );
}
