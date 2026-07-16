'use client';

import React, { useEffect, useCallback, ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showClose?: boolean;
}

const SIZE_CLASSES = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-2xl',
};

export function Modal({ open, onClose, title, description, children, size = 'md', showClose = true }: ModalProps) {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, handleKeyDown]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`relative w-full ${SIZE_CLASSES[size]} glass-panel rounded-2xl p-6 flex flex-col gap-5
          animate-scale-in shadow-elevated neon-top`}
      >
        {/* Header */}
        {(title || showClose) && (
          <div className="flex items-start justify-between gap-4">
            <div>
              {title && <h2 className="text-base font-bold text-text-primary">{title}</h2>}
              {description && <p className="text-sm text-text-muted mt-1">{description}</p>}
            </div>
            {showClose && (
              <button
                onClick={onClose}
                className="shrink-0 h-8 w-8 flex items-center justify-center rounded-lg
                  bg-white/[0.04] hover:bg-white/[0.08] border border-border-subtle
                  text-text-muted hover:text-text-primary transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div>{children}</div>
      </div>
    </div>
  );
}
