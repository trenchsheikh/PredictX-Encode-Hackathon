'use client';

import React from 'react';
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

            {/* Static overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-500/5 to-transparent" />

            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-yellow-400/5 to-transparent" />
          </div>
        );

      case 'particles':
        return (
          <div className="fixed inset-0 -z-50 overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-800">
            {/* Floating particles */}
            {Array.from({ length: 50 }).map((_, i) => (
              <div
                key={`particle-${i}`}
                className="absolute h-2 w-2 rounded-full bg-yellow-400/30"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
              />
            ))}

            {/* Larger floating orbs */}
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={`orb-${i}`}
                className="absolute h-16 w-16 rounded-full bg-yellow-400/10 blur-xl"
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
            {/* Static grid pattern */}
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

            {/* Static grid lines */}
            <div
              className="absolute inset-0"
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

            {/* Static overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-500/5 to-transparent" />
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
