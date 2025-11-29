import React from 'react';

export type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg';
export type SpinnerColor = 'primary' | 'white' | 'current';

export interface SpinnerProps {
  size?: SpinnerSize;
  color?: SpinnerColor;
  className?: string;
  'aria-label'?: string;
}

const sizeClasses: Record<SpinnerSize, string> = {
  xs: 'w-3 h-3',     // 12px
  sm: 'w-4 h-4',     // 16px
  md: 'w-6 h-6',     // 24px
  lg: 'w-8 h-8',     // 32px
};

const colorClasses: Record<SpinnerColor, string> = {
  primary: 'border-primary border-t-transparent',
  white: 'border-white border-t-transparent',
  current: 'border-current border-t-transparent',
};

/**
 * Spinner component for loading states
 * 
 * @example
 * // Default spinner
 * <Spinner />
 * 
 * @example
 * // Small white spinner
 * <Spinner size="sm" color="white" />
 * 
 * @example
 * // Large spinner with custom class
 * <Spinner size="lg" className="mx-auto" />
 */
export function Spinner({
  size = 'md',
  color = 'primary',
  className = '',
  'aria-label': ariaLabel = 'Loading',
}: SpinnerProps) {
  return (
    <div
      className={`inline-block animate-spin rounded-full border-2 ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
      role="status"
      aria-label={ariaLabel}
      aria-live="polite"
    >
      <span className="sr-only">{ariaLabel}</span>
    </div>
  );
}

