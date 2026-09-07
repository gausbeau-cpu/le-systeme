import React from 'react';
import { cn } from '../../lib/utils';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'standard' | 'premium' | 'hero';
  hasSheen?: boolean; // STRICT RULE: only the 100k$ Hero card gets the sheen
  children: React.ReactNode;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  variant = 'standard',
  hasSheen = false,
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={cn(
        variant === 'hero' || variant === 'premium'
          ? 'glass-card--premium'
          : 'glass-card',
        hasSheen && 'glass-sheen',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
