'use client';

import React, { useEffect, useState } from 'react';

import { motion } from 'framer-motion';

interface AnimatedBackgroundEnhancedProps {
  variant?: 'orbs' | 'waves' | 'mesh' | 'particles' | 'grid-flow';
  className?: string;
}

export function AnimatedBackgroundEnhanced({
  variant = 'orbs',
  className = '',
}: AnimatedBackgroundEnhancedProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className={`fixed inset-0 -z-50 bg-black ${className}`} />;
  }

  const renderBackground = () => {
    switch (variant) {
      case 'orbs':
        return (
          <div className="fixed inset-0 -z-50 overflow-hidden bg-black">
            {/* Base gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-950 to-black" />

            {/* Large animated orbs */}
            <motion.div
              className="absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-secondary/20 blur-3xl"
              animate={{
                x: [0, 100, 0],
                y: [0, -50, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />

            <motion.div
              className="absolute right-0 top-1/3 h-[32rem] w-[32rem] rounded-full bg-secondary/15 blur-3xl"
              animate={{
                x: [0, -80, 0],
                y: [0, 100, 0],
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: 25,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />

            <motion.div
              className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl"
              animate={{
                x: [0, -60, 0],
                y: [0, -80, 0],
                scale: [1, 1.4, 1],
              }}
              transition={{
                duration: 18,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />

            {/* Smaller accent orbs */}
            <motion.div
              className="absolute right-1/4 top-1/2 h-64 w-64 rounded-full bg-white/5 blur-2xl"
              animate={{
                x: [0, 50, 0],
                y: [0, -40, 0],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </div>
        );

      case 'waves':
        return (
          <div className="fixed inset-0 -z-50 overflow-hidden bg-black">
            <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-950 to-black" />

            {/* Animated wave layers */}
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={`wave-${i}`}
                className="absolute inset-0"
                style={{
                  background: `radial-gradient(circle at ${50 + i * 10}% ${50 + i * 5}%, rgba(29, 161, 242, ${0.05 - i * 0.008}) 0%, transparent 70%)`,
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 15 + i * 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.5,
                }}
              />
            ))}
          </div>
        );

      case 'mesh':
        return (
          <div className="fixed inset-0 -z-50 overflow-hidden bg-black">
            <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-950 to-black" />

            {/* Animated gradient mesh */}
            <motion.div
              className="absolute inset-0"
              style={{
                background: `
                  radial-gradient(at 20% 30%, rgba(29, 161, 242, 0.15) 0px, transparent 50%),
                  radial-gradient(at 80% 70%, rgba(96, 165, 250, 0.1) 0px, transparent 50%),
                  radial-gradient(at 50% 50%, rgba(147, 197, 253, 0.08) 0px, transparent 50%)
                `,
              }}
              animate={{
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />

            {/* Moving mesh points */}
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={`mesh-${i}`}
                className="absolute h-32 w-32 rounded-full bg-secondary/10 blur-2xl"
                initial={{
                  x: `${(i % 4) * 25}%`,
                  y: `${Math.floor(i / 4) * 33}%`,
                }}
                animate={{
                  x: [
                    `${(i % 4) * 25}%`,
                    `${((i % 4) * 25 + 10) % 100}%`,
                    `${(i % 4) * 25}%`,
                  ],
                  y: [
                    `${Math.floor(i / 4) * 33}%`,
                    `${(Math.floor(i / 4) * 33 + 15) % 100}%`,
                    `${Math.floor(i / 4) * 33}%`,
                  ],
                }}
                transition={{
                  duration: 20 + i,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>
        );

      case 'particles':
        return (
          <div className="fixed inset-0 -z-50 overflow-hidden bg-black">
            <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-950 to-black" />

            {/* Floating particles */}
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={`particle-${i}`}
                className="absolute h-1 w-1 rounded-full bg-secondary/40"
                initial={{
                  x: `${Math.random() * 100}%`,
                  y: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [
                    `${Math.random() * 100}%`,
                    `${Math.random() * 100}%`,
                    `${Math.random() * 100}%`,
                  ],
                  x: [
                    `${Math.random() * 100}%`,
                    `${Math.random() * 100}%`,
                    `${Math.random() * 100}%`,
                  ],
                  opacity: [0.2, 1, 0.2],
                }}
                transition={{
                  duration: 10 + Math.random() * 10,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />
            ))}

            {/* Larger glowing particles */}
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={`glow-${i}`}
                className="absolute h-2 w-2 rounded-full bg-secondary/60 blur-sm"
                initial={{
                  x: `${Math.random() * 100}%`,
                  y: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
                  x: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 0.8, 0.3],
                }}
                transition={{
                  duration: 8 + Math.random() * 7,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>
        );

      case 'grid-flow':
        return (
          <div className="fixed inset-0 -z-50 overflow-hidden bg-black">
            <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-950 to-black" />

            {/* Animated grid */}
            <motion.div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(29, 161, 242, 0.3) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(29, 161, 242, 0.3) 1px, transparent 1px)
                `,
                backgroundSize: '50px 50px',
              }}
              animate={{
                backgroundPosition: ['0px 0px', '50px 50px'],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: 'linear',
              }}
            />

            {/* Flowing gradient overlays */}
            <motion.div
              className="absolute inset-0"
              style={{
                background:
                  'radial-gradient(circle at 50% 50%, rgba(29, 161, 242, 0.1) 0%, transparent 50%)',
              }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />

            {/* Moving grid highlights */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={`grid-highlight-${i}`}
                className="absolute h-24 w-24 rounded-full bg-secondary/20 blur-xl"
                initial={{
                  x: `${(i % 4) * 25}%`,
                  y: `${Math.floor(i / 4) * 50}%`,
                }}
                animate={{
                  x: [
                    `${(i % 4) * 25}%`,
                    `${((i % 4) * 25 + 20) % 100}%`,
                    `${(i % 4) * 25}%`,
                  ],
                  y: [
                    `${Math.floor(i / 4) * 50}%`,
                    `${(Math.floor(i / 4) * 50 + 30) % 100}%`,
                    `${Math.floor(i / 4) * 50}%`,
                  ],
                }}
                transition={{
                  duration: 15 + i * 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>
        );

      default:
        return (
          <div className="fixed inset-0 -z-50 bg-black">
            <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-950 to-black" />
          </div>
        );
    }
  };

  return <>{renderBackground()}</>;
}
