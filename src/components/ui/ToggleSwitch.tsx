'use client';

import React, { forwardRef, useId } from 'react';

export interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  id?: string;
  className?: string;
}

export const ToggleSwitch = forwardRef<HTMLButtonElement, ToggleSwitchProps>(({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  id: customId,
  className = '',
}, ref) => {
  const autoId = useId();
  const switchId = customId || autoId;
  const descId = `${switchId}-desc`;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      onChange(!checked);
    }
  };

  return (
    <div className={`flex items-start justify-between gap-3 font-sans ${className}`}>
      {(label || description) && (
        <div className="flex flex-col cursor-pointer select-none" onClick={() => !disabled && onChange(!checked)}>
          {label && (
            <span id={`${switchId}-label`} className="text-sm font-medium text-[var(--text-primary)]">
              {label}
            </span>
          )}
          {description && (
            <span id={descId} className="text-xs text-[var(--text-muted)] mt-0.5">
              {description}
            </span>
          )}
        </div>
      )}

      <button
        ref={ref}
        id={switchId}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={label ? `${switchId}-label` : undefined}
        aria-describedby={description ? descId : undefined}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        onKeyDown={handleKeyDown}
        className={`
          relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full
          border-2 border-transparent transition-colors duration-200 ease-in-out
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)]
          focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-bg)]
          disabled:opacity-50 disabled:cursor-not-allowed
          ${checked ? 'bg-[var(--brand-primary)]' : 'bg-[var(--border-strong)]'}
        `}
      >
        <span
          aria-hidden="true"
          className={`
            pointer-events-none inline-block h-5 w-5 transform rounded-full
            bg-white shadow-md ring-0 transition duration-200 ease-in-out
            ${checked ? 'translate-x-5' : 'translate-x-0'}
          `}
        />
      </button>
    </div>
  );
});

ToggleSwitch.displayName = 'ToggleSwitch';
