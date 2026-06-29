import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#090a0f] text-white flex flex-col justify-center items-center gap-3">
      <span className="h-8 w-8 rounded-full border-2 border-[#a855f7] border-t-transparent animate-spin" />
      <span className="text-xs text-gray-400 font-semibold tracking-wider uppercase animate-pulse">
        Loading ImpactLens AI...
      </span>
    </div>
  );
}
