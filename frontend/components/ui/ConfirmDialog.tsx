'use client';

import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Modal } from './Modal';
import { Spinner } from './Spinner';

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  variant?: 'danger' | 'warning';
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  loading = false,
  variant = 'danger',
}: ConfirmDialogProps) {
  const isDanger = variant === 'danger';

  return (
    <Modal open={open} onClose={onClose} size="sm">
      <div className="flex flex-col gap-5">
        {/* Icon + Text */}
        <div className="flex gap-4 items-start">
          <div className={`shrink-0 h-10 w-10 rounded-xl flex items-center justify-center ${
            isDanger ? 'bg-red-500/10 border border-red-500/20' : 'bg-amber-500/10 border border-amber-500/20'
          }`}>
            <AlertTriangle className={`w-5 h-5 ${isDanger ? 'text-red-400' : 'text-amber-400'}`} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-text-primary">{title}</h3>
            <p className="text-xs text-text-muted mt-1 leading-relaxed">{message}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={loading}
            className="btn-ghost text-xs px-4 py-2 disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold
              transition-all duration-200 disabled:opacity-50
              ${isDanger
                ? 'bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20'
                : 'bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20'
              }`}
          >
            {loading && <Spinner size="xs" color="white" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}
