'use client';

import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'brand' | 'accent' | 'success' | 'warning' | 'error' | 'neutral';
  size?: 'sm' | 'md';
  hasDot?: boolean;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'brand',
  size = 'md',
  hasDot = false,
  icon,
  className = '',
  ...props
}) => {
  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 gap-1 font-bold',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-bold',
  };

  const variantClasses = {
    brand: `
      bg-[var(--brand-primary-muted)] text-[var(--brand-primary)]
      border border-[var(--brand-primary)]/30
    `,
    accent: `
      bg-[var(--brand-accent-muted)] text-[var(--brand-accent)]
      border border-[var(--brand-accent)]/30
    `,
    success: `
      bg-[var(--status-success-bg)] text-[var(--status-success)]
      border border-[var(--status-success)]/30
    `,
    warning: `
      bg-[var(--status-warning-bg)] text-[var(--status-warning)]
      border border-[var(--status-warning)]/30
    `,
    error: `
      bg-[var(--status-error-bg)] text-[var(--status-error)]
      border border-[var(--status-error)]/30
    `,
    neutral: `
      bg-[var(--surface-elevated)] text-[var(--text-secondary)]
      border border-[var(--border-subtle)]
    `,
  };

  const dotColorClasses = {
    brand: 'bg-[var(--brand-primary)]',
    accent: 'bg-[var(--brand-accent)]',
    success: 'bg-[var(--status-success)]',
    warning: 'bg-[var(--status-warning)]',
    error: 'bg-[var(--status-error)]',
    neutral: 'bg-[var(--text-muted)]',
  };

  return (
    <span
      className={`
        inline-flex items-center justify-center rounded-[var(--radius-full)]
        uppercase tracking-wider select-none font-sans
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${className}
      `}
      {...props}
    >
      {hasDot && (
        <span 
          className={`w-1.5 h-1.5 rounded-full ${dotColorClasses[variant]} animate-pulse shrink-0`}
          aria-hidden="true" 
        />
      )}
      {icon && <span className="shrink-0 flex items-center" aria-hidden="true">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
