'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  delay?: number;
  onClick?: () => void;
}

export function AnimatedCard({ 
  children, 
  className, 
  hover = true, 
  delay = 0,
  onClick 
}: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={hover ? { 
        y: -8, 
        scale: 1.02,
        transition: { duration: 0.2 }
      } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
      onClick={onClick}
      className={cn(
        "relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm border border-gray-700/50 shadow-2xl",
        "hover:shadow-yellow-500/20 hover:border-yellow-500/30 transition-all duration-300",
        className
      )}
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Animated border glow */}
      <motion.div
        className="absolute inset-0 rounded-2xl"
        style={{
          background: 'linear-gradient(45deg, transparent, rgba(255, 193, 7, 0.1), transparent)',
        }}
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </motion.div>
  );
}
