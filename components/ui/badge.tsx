import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground hover:bg-primary/90',
        secondary: 'border-white/20 bg-white/10 text-white hover:bg-white/20',
        destructive:
          'border-transparent bg-red-500 text-white hover:bg-red-600',
        outline: 'text-white border-white/20 bg-transparent hover:bg-white/10',
        success:
          'border-transparent bg-primary text-primary-foreground hover:bg-primary/90',
        warning:
          'border-transparent bg-orange-500 text-white hover:bg-orange-600',
        hot: 'border-transparent bg-red-500 text-white animate-pulse',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
