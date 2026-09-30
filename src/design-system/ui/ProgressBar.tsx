'use client';

import React from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';

export interface ProgressBarProps {
  value: number; // 0 to 100
  label?: string;
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'accent' | 'brand' | 'gradient';
  isAnimated?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  label,
  showPercentage = true,
  size = 'md',
  variant = 'accent',
  isAnimated = true,
  className = '',
}) => {
  const clampedValue = Math.min(100, Math.max(0, value));
  const isComplete = clampedValue >= 100;

  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  const variantFillClasses = {
    accent: 'bg-[var(--brand-accent)]',
    brand: 'bg-[var(--brand-primary)]',
    gradient: 'bg-gradient-to-r from-[var(--brand-primary)] via-[var(--brand-accent)] to-[var(--brand-accent)]',
  };

  return (
    <div className={`w-full flex flex-col gap-1.5 font-sans ${className}`}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between text-xs font-medium text-[var(--text-secondary)] select-none">
          {label && (
            <span className="flex items-center gap-1.5">
              {isComplete && <CheckCircle2 className="w-3.5 h-3.5 text-[var(--brand-accent)]" aria-hidden="true" />}
              <span>{label}</span>
            </span>
          )}
          {showPercentage && (
            <span className="font-mono font-bold text-[var(--text-primary)]">
              {clampedValue}%
            </span>
          )}
        </div>
      )}

      {/* Progress Track */}
      <div 
        role="progressbar"
        aria-valuenow={clampedValue}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label || 'Progresso'}
        className={`
          w-full rounded-full bg-[var(--surface-elevated)]
          border border-[var(--border-subtle)] overflow-hidden
          ${sizeClasses[size]}
        `}
      >
        <div
          className={`
            h-full rounded-full transition-all duration-500 ease-out relative
            ${variantFillClasses[variant]}
            ${isAnimated ? 'shadow-[var(--shadow-accent)]' : ''}
          `}
          style={{ width: `${clampedValue}%` }}
        >
          {isAnimated && clampedValue > 10 && clampedValue < 100 && (
            <div 
              className="absolute inset-0 bg-white/20 animate-pulse pointer-events-none"
              aria-hidden="true"
            />
          )}
        </div>
      </div>

      {isComplete && (
        <div className="flex items-center gap-1 text-[11px] text-[var(--brand-accent)] font-bold animate-fadeIn">
          <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Meta alcançada! Ciclo de estudo blindado.</span>
        </div>
      )}
    </div>
  );
};
