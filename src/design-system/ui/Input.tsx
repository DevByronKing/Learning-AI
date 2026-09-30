'use client';

import React, { forwardRef, useId } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  hint,
  error,
  leftIcon,
  rightIcon,
  className = '',
  disabled = false,
  id: customId,
  ...props
}, ref) => {
  const autoId = useId();
  const inputId = customId || autoId;
  const hintId = `${inputId}-hint`;
  const errorId = `${inputId}-error`;

  const hasError = Boolean(error);

  return (
    <div className="w-full flex flex-col gap-1.5 font-sans">
      {label && (
        <label 
          htmlFor={inputId}
          className="text-xs font-medium text-[var(--text-secondary)] select-none flex items-center justify-between"
        >
          <span>{label}</span>
          {props.required && (
            <span className="text-[var(--brand-primary)] text-[10px] uppercase font-bold" aria-hidden="true">
              Obrigatório
            </span>
          )}
        </label>
      )}

      <div className="relative flex items-center">
        {leftIcon && (
          <div 
            className="absolute left-3 text-[var(--text-muted)] pointer-events-none flex items-center justify-center"
            aria-hidden="true"
          >
            {leftIcon}
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          disabled={disabled}
          aria-invalid={hasError ? 'true' : 'false'}
          aria-describedby={hasError ? errorId : hint ? hintId : undefined}
          className={`
            w-full h-10 text-sm font-normal rounded-[var(--radius-md)]
            bg-[var(--surface-card)] text-[var(--text-primary)]
            border transition-all duration-200
            placeholder:text-[var(--text-muted)]
            ${leftIcon ? 'pl-9' : 'pl-3.5'}
            ${rightIcon ? 'pr-9' : 'pr-3.5'}
            ${hasError 
              ? 'border-[var(--status-error)] focus:border-[var(--status-error)]' 
              : 'border-[var(--border-subtle)] hover:border-[var(--border-strong)] focus:border-[var(--border-focus)]'
            }
            focus-visible:outline-none focus-visible:ring-2 
            ${hasError 
              ? 'focus-visible:ring-[var(--status-error)]' 
              : 'focus-visible:ring-[var(--border-focus)]'
            }
            focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-bg)]
            disabled:opacity-50 disabled:bg-[var(--surface-elevated)] disabled:cursor-not-allowed
            ${className}
          `}
          {...props}
        />

        {rightIcon && (
          <div 
            className="absolute right-3 text-[var(--text-muted)] flex items-center justify-center"
            aria-hidden="true"
          >
            {rightIcon}
          </div>
        )}
      </div>

      {hasError ? (
        <p id={errorId} className="text-xs text-[var(--status-error)] font-medium flex items-center gap-1 mt-0.5">
          <span aria-hidden="true">⚠️</span>
          <span>{error}</span>
        </p>
      ) : hint ? (
        <p id={hintId} className="text-xs text-[var(--text-muted)] mt-0.5">
          {hint}
        </p>
      ) : null}
    </div>
  );
});

Input.displayName = 'Input';
