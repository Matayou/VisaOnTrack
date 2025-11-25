import React from 'react';
import { Spinner } from './Spinner';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  children?: React.ReactNode;
  fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-gradient-to-b from-primary to-primary-hover text-white disabled:opacity-60',
  secondary: 'bg-bg-secondary text-text-primary border border-border-light hover:bg-bg-primary hover:border-border disabled:opacity-60',
  outline: 'bg-transparent text-text-primary border border-border-light hover:bg-bg-secondary hover:border-border disabled:opacity-60',
  ghost: 'bg-transparent text-text-secondary hover:text-text-primary hover:bg-bg-secondary disabled:opacity-60',
  danger: 'bg-error text-white hover:bg-error/90 disabled:opacity-60',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-10 px-4 text-sm',      // 40px
  md: 'h-12 px-6 text-base',    // 48px - default, meets accessibility
  lg: 'h-14 px-8 text-lg',      // 56px
};

/**
 * Button component with consistent styling and behavior
 * 
 * @example
 * // Primary button
 * <Button>Click me</Button>
 * 
 * @example
 * // Loading state
 * <Button loading>Submitting...</Button>
 * 
 * @example
 * // With icon
 * <Button icon={<ArrowRight />} iconPosition="right">
 *   Continue
 * </Button>
 * 
 * @example
 * // Outline variant
 * <Button variant="outline" size="sm">Cancel</Button>
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      icon,
      iconPosition = 'left',
      children,
      fullWidth = false,
      className = '',
      disabled,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const baseClasses = 'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed';
    
    const widthClass = fullWidth ? 'w-full' : '';
    
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        type={type}
        className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`}
        disabled={isDisabled}
        aria-busy={loading}
        {...props}
      >
        {loading && (
          <Spinner
            size={size === 'sm' ? 'xs' : 'sm'}
            color={variant === 'primary' || variant === 'danger' ? 'white' : 'current'}
            aria-label="Loading"
          />
        )}
        {!loading && icon && iconPosition === 'left' && (
          <span className="flex-shrink-0" aria-hidden="true">{icon}</span>
        )}
        {children && <span>{children}</span>}
        {!loading && icon && iconPosition === 'right' && (
          <span className="flex-shrink-0" aria-hidden="true">{icon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

