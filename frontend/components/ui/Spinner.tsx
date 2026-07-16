import React from 'react';
import { cn } from '@/utils/cn';

interface SpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  color?: 'cyan' | 'violet' | 'white';
  className?: string;
}

const SIZE_CLASSES = {
  xs: 'h-3 w-3 border',
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-2',
  lg: 'h-8 w-8 border-[3px]',
};

const COLOR_CLASSES = {
  cyan:   'border-cyan/20 border-t-cyan',
  violet: 'border-violet/20 border-t-violet',
  white:  'border-white/20 border-t-white',
};

export function Spinner({ size = 'md', color = 'cyan', className }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={cn('rounded-full animate-spin shrink-0', SIZE_CLASSES[size], COLOR_CLASSES[color], className)}
    />
  );
}

interface SpinnerPageProps {
  label?: string;
}

export function SpinnerPage({ label = 'Loading...' }: SpinnerPageProps) {
  return (
    <div className="min-h-screen bg-obsidian flex flex-col items-center justify-center gap-4">
      <Spinner size="lg" />
      <p className="text-sm text-text-muted animate-pulse-dot">{label}</p>
    </div>
  );
}
