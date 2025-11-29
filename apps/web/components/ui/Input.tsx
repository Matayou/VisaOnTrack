import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * Error state - shows error styling
   */
  error?: boolean;
  /**
   * Success state - shows success styling
   */
  success?: boolean;
  /**
   * Icon to display on the left side of the input
   */
  icon?: React.ReactNode;
  /**
   * Icon to display on the right side of the input
   */
  rightIcon?: React.ReactNode;
}

/**
 * Standardized Input component with consistent styling
 * 
 * Features:
 * - Fixed height: h-12 (48px) for accessibility
 * - Fixed border radius: rounded-base (8px)
 * - Error and success state styling
 * - Icon support (left and right)
 * - Full accessibility support
 * 
 * @example
 * // Basic input
 * <Input placeholder="Enter your email" />
 * 
 * @example
 * // With error state
 * <Input error placeholder="Email" />
 * 
 * @example
 * // With icon
 * <Input icon={<Mail className="w-4 h-4" />} placeholder="Email" />
 * 
 * @example
 * // With right icon
 * <Input rightIcon={<Eye className="w-4 h-4" />} type="password" />
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      error = false,
      success = false,
      icon,
      rightIcon,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    // Base classes - fixed height and border radius per design system
    const baseClasses = 'w-full h-12 px-4 text-base font-sans text-text-primary bg-bg-primary border rounded-base transition-all duration-150 outline-none';
    
    // State classes
    const stateClasses = error
      ? 'border-error bg-error-light/5 focus:shadow-focus-error focus:border-error'
      : success
      ? 'border-success bg-success-light/5 focus:shadow-focus-success focus:border-success'
      : 'border-border-light hover:border-border-medium focus:border-primary focus:shadow-focus-primary';
    
    // Disabled state
    const disabledClasses = disabled
      ? 'cursor-not-allowed opacity-60 bg-bg-tertiary text-text-tertiary'
      : '';
    
    // Padding adjustments for icons
    const paddingClasses = icon ? 'pl-11' : rightIcon ? 'pr-11' : '';
    
    const inputClasses = `${baseClasses} ${stateClasses} ${disabledClasses} ${paddingClasses} ${className}`.trim();

    return (
      <div className="relative">
        {icon && (
          <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          className={inputClasses}
          disabled={disabled}
          aria-invalid={error}
          {...props}
        />
        {rightIcon && (
          <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-text-tertiary">
            {rightIcon}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

