import React, { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

const SIZE = {
  sm: { icon: 'w-8 h-8', title: 'text-sm', desc: 'text-xs', container: 'py-8 gap-3' },
  md: { icon: 'w-10 h-10', title: 'text-base', desc: 'text-sm', container: 'py-12 gap-4' },
  lg: { icon: 'w-14 h-14', title: 'text-lg', desc: 'text-sm', container: 'py-16 gap-4' },
};

export function EmptyState({ icon: Icon, title, description, action, size = 'md' }: EmptyStateProps) {
  const s = SIZE[size];
  return (
    <div className={`flex flex-col items-center justify-center text-center ${s.container}`}>
      {/* Icon container */}
      <div className="relative mb-1">
        <div className="absolute inset-0 rounded-2xl bg-cyan-glow blur-xl scale-150 opacity-50" />
        <div className="relative h-16 w-16 rounded-2xl bg-surface-1 border border-border-subtle
          flex items-center justify-center">
          <Icon className={`${s.icon} text-text-muted`} />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <h3 className={`${s.title} font-bold text-text-primary`}>{title}</h3>
        {description && (
          <p className={`${s.desc} text-text-muted max-w-xs`}>{description}</p>
        )}
      </div>

      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
