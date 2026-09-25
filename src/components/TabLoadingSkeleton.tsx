'use client';

import React from 'react';
import { BrainCircuit } from 'lucide-react';

export const TabLoadingSkeleton: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn space-y-6">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-white/10">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-24 h-5 rounded-full bg-slate-200 dark:bg-white/10 animate-pulse" />
            <div className="w-32 h-4 rounded-md bg-slate-200 dark:bg-white/5 animate-pulse" />
          </div>
          <div className="w-72 sm:w-96 h-8 rounded-xl bg-slate-200 dark:bg-white/10 animate-pulse" />
          <div className="w-60 sm:w-80 h-4 rounded-lg bg-slate-200 dark:bg-white/5 animate-pulse" />
        </div>
        <div className="flex items-center gap-3">
          <div className="w-28 h-10 rounded-xl bg-slate-200 dark:bg-white/10 animate-pulse" />
          <div className="w-32 h-10 rounded-xl bg-slate-200 dark:bg-white/10 animate-pulse" />
        </div>
      </div>

      {/* Center Tactical Pulse Badge */}
      <div className="flex items-center justify-center py-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold animate-pulse">
          <BrainCircuit className="w-4 h-4 animate-spin-slow" />
          <span>Sincronizando Módulo Cognitivo sob demanda...</span>
        </div>
      </div>

      {/* Grid Content Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-slate-100 dark:bg-dark-surface/60 border border-slate-200 dark:border-white/10 space-y-4 animate-pulse">
          <div className="w-12 h-12 rounded-2xl bg-slate-200 dark:bg-white/10" />
          <div className="w-3/4 h-5 rounded-lg bg-slate-200 dark:bg-white/10" />
          <div className="w-full h-16 rounded-xl bg-slate-200 dark:bg-white/5" />
        </div>
        <div className="p-6 rounded-3xl bg-slate-100 dark:bg-dark-surface/60 border border-slate-200 dark:border-white/10 space-y-4 animate-pulse">
          <div className="w-12 h-12 rounded-2xl bg-slate-200 dark:bg-white/10" />
          <div className="w-3/4 h-5 rounded-lg bg-slate-200 dark:bg-white/10" />
          <div className="w-full h-16 rounded-xl bg-slate-200 dark:bg-white/5" />
        </div>
        <div className="p-6 rounded-3xl bg-slate-100 dark:bg-dark-surface/60 border border-slate-200 dark:border-white/10 space-y-4 animate-pulse">
          <div className="w-12 h-12 rounded-2xl bg-slate-200 dark:bg-white/10" />
          <div className="w-3/4 h-5 rounded-lg bg-slate-200 dark:bg-white/10" />
          <div className="w-full h-16 rounded-xl bg-slate-200 dark:bg-white/5" />
        </div>
      </div>

      {/* Big Card Skeleton */}
      <div className="h-64 rounded-3xl bg-slate-100 dark:bg-dark-surface/40 border border-slate-200 dark:border-white/10 animate-pulse p-6" />
    </div>
  );
};

export default TabLoadingSkeleton;
