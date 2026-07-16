'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
}

interface ToastContextValue {
  toasts: Toast[];
  toast: (message: string, options?: { type?: ToastType; title?: string }) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const ICON_MAP: Record<ToastType, string> = {
  success: '✓',
  error: '✕',
  warning: '⚠',
  info: 'ℹ',
};

const COLOR_MAP: Record<ToastType, string> = {
  success: 'border-emerald-500/30 bg-emerald-500/5 text-emerald-400',
  error: 'border-red-500/30 bg-red-500/5 text-red-400',
  warning: 'border-amber-500/30 bg-amber-500/5 text-amber-400',
  info: 'border-blue-500/30 bg-blue-500/5 text-blue-400',
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, options?: { type?: ToastType; title?: string }) => {
    const id = crypto.randomUUID();
    setToasts(prev => [...prev, {
      id,
      type: options?.type || 'info',
      title: options?.title,
      message,
    }]);
    setTimeout(() => dismiss(id), 5000);
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
      {/* Toast Portal */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        {toasts.map(t => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border backdrop-blur-xl
              bg-obsidian-card shadow-elevated animate-slide-in-right
              ${COLOR_MAP[t.type]}`}
          >
            <span className="text-base font-black shrink-0 mt-0.5">{ICON_MAP[t.type]}</span>
            <div className="flex-1 min-w-0">
              {t.title && <p className="text-xs font-bold text-text-primary mb-0.5">{t.title}</p>}
              <p className="text-xs text-text-secondary leading-relaxed">{t.message}</p>
            </div>
            <button
              onClick={() => dismiss(t.id)}
              className="shrink-0 text-text-muted hover:text-text-primary transition-colors text-lg leading-none"
            >×</button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
