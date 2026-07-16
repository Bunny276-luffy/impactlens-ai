import React from 'react';
import { cn } from '@/utils/cn';

type BadgeVariant = 'critical' | 'warning' | 'success' | 'info' | 'neutral' | 'cyan' | 'violet';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  dot?: boolean;
  className?: string;
}

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  critical: 'bg-red-500/10 text-red-400 border-red-500/20',
  warning:  'bg-amber-500/10 text-amber-400 border-amber-500/20',
  success:  'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  info:     'bg-blue-500/10 text-blue-400 border-blue-500/20',
  neutral:  'bg-white/5 text-text-secondary border-border-default',
  cyan:     'bg-cyan-glow text-cyan border-cyan/20',
  violet:   'bg-violet-glow text-violet border-violet/20',
};

const DOT_CLASSES: Record<BadgeVariant, string> = {
  critical: 'bg-red-400',
  warning:  'bg-amber-400',
  success:  'bg-emerald-400',
  info:     'bg-blue-400',
  neutral:  'bg-text-muted',
  cyan:     'bg-cyan',
  violet:   'bg-violet',
};

export function Badge({ children, variant = 'neutral', dot = false, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border',
        VARIANT_CLASSES[variant],
        className
      )}
    >
      {dot && (
        <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', DOT_CLASSES[variant])} />
      )}
      {children}
    </span>
  );
}
