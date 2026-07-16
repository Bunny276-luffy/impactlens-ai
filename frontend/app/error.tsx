'use client';

import React, { useEffect } from 'react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#090a0f] text-white flex flex-col justify-center items-center gap-6 p-6 text-center">
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-bold text-red-500">Something went wrong!</h2>
        <p className="text-sm text-gray-400 max-w-md leading-relaxed">
          An unexpected error occurred in the platform. Our monitoring tools have been notified.
        </p>
        {error.message && (
          <pre className="mt-4 p-3 bg-red-950/15 border border-red-500/10 rounded-lg text-xs text-red-300 font-mono overflow-auto max-w-full">
            {error.message}
          </pre>
        )}
      </div>
      <div className="flex gap-4">
        <button
          onClick={() => reset()}
          className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-[#a855f7] to-[#3b82f6] text-sm font-bold hover:opacity-90 transition-all shadow-lg"
        >
          Try Again
        </button>
        <button
          onClick={() => window.location.href = '/'}
          className="px-6 py-2.5 rounded-lg border border-white/10 hover:bg-white/5 text-sm font-semibold transition-all"
        >
          Return Home
        </button>
      </div>
    </div>
  );
}
