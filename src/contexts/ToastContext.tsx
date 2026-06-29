'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertTriangle, Info, AlertCircle } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  title?: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  toast: (message: string, options?: { type?: ToastType; title?: string; duration?: number }) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((message: string, options?: { type?: ToastType; title?: string; duration?: number }) => {
    const id = Math.random().toString(36).substring(2, 9);
    const type = options?.type || 'info';
    const title = options?.title;
    const duration = options?.duration || 4000;

    setToasts((prev) => [...prev, { id, message, type, title, duration }]);

    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ toasts, toast, removeToast }}>
      {children}
      
      {/* Toast container */}
      <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-3 max-w-md w-full pointer-events-none px-4 sm:px-0">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto flex items-start gap-3 p-4 rounded-xl border glass-panel shadow-2xl transition-all duration-300 animate-slide-in"
            style={{
              animation: 'slide-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
              background: 'rgba(15, 17, 28, 0.85)',
              borderColor: 
                t.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 
                t.type === 'error' ? 'rgba(239, 68, 68, 0.3)' : 
                t.type === 'warning' ? 'rgba(245, 158, 11, 0.3)' : 'rgba(59, 130, 246, 0.3)'
            }}
          >
            {/* Icon */}
            <div className="mt-0.5">
              {t.type === 'success' && <CheckCircle className="w-5 h-5 text-emerald-400" />}
              {t.type === 'error' && <AlertCircle className="w-5 h-5 text-red-400" />}
              {t.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-400" />}
              {t.type === 'info' && <Info className="w-5 h-5 text-blue-400" />}
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col gap-0.5">
              {t.title && (
                <span className="font-semibold text-sm text-gray-100">
                  {t.title}
                </span>
              )}
              <p className="text-xs text-gray-300 leading-relaxed">
                {t.message}
              </p>
            </div>

            {/* Close Button */}
            <button
              onClick={() => removeToast(t.id)}
              className="text-gray-400 hover:text-gray-200 transition-colors p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Add inline keyframes styles to DOM */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes slide-in {
          from {
            transform: translateY(100%) scale(0.9);
            opacity: 0;
          }
          to {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }
      `}} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
