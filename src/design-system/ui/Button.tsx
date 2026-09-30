'use client';

import React, { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  className = '',
  type = 'button',
  ...props
}, ref) => {
  // Base classes with full keyboard accessible focus ring
  const baseClasses = `
    inline-flex items-center justify-center font-medium font-sans
    transition-all duration-200 select-none cursor-pointer
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-bg)]
    disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
  `;

  // Size variations
  const sizeClasses = {
    sm: 'h-8 px-3 text-xs rounded-[var(--radius-md)] gap-1.5',
    md: 'h-10 px-4 text-sm rounded-[var(--radius-md)] gap-2',
    lg: 'h-12 px-6 text-base rounded-[var(--radius-md)] gap-2.5 font-bold',
  };

  // Variant styles driven by tokens
  const variantClasses = {
    primary: `
      bg-[var(--brand-primary)] text-[var(--text-on-brand)]
      hover:bg-[var(--brand-primary-hover)] active:bg-[var(--brand-primary-active)]
      shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-brand)]
    `,
    secondary: `
      bg-[var(--surface-card)] text-[var(--text-primary)]
      border border-[var(--border-subtle)] hover:border-[var(--border-strong)]
      hover:bg-[var(--surface-elevated)] active:bg-[var(--surface-elevated)]
      shadow-[var(--shadow-sm)]
    `,
    ghost: `
      bg-transparent text-[var(--text-secondary)]
      hover:text-[var(--text-primary)] hover:bg-[var(--brand-primary-muted)]
      active:bg-[var(--brand-primary-muted)]
    `,
    danger: `
      bg-[var(--status-error)] text-white
      hover:opacity-90 active:opacity-95 shadow-[var(--shadow-sm)]
    `,
  };

  const isButtonDisabled = disabled || isLoading;

  return (
    <button
      ref={ref}
      type={type}
      disabled={isButtonDisabled}
      aria-busy={isLoading ? 'true' : undefined}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin shrink-0 text-current" aria-hidden="true" />
          <span>{children}</span>
        </>
      ) : (
        <>
          {leftIcon && <span className="shrink-0 flex items-center" aria-hidden="true">{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span className="shrink-0 flex items-center" aria-hidden="true">{rightIcon}</span>}
        </>
      )}
    </button>
  );
});

Button.displayName = 'Button';
