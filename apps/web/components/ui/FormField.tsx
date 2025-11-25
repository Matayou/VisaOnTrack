import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { Input, InputProps } from './Input';
import { ValidationStatus } from '@/lib/validation';

export interface FormFieldProps extends Omit<InputProps, 'error' | 'success'> {
  /**
   * Label for the input field
   */
  label: string;
  /**
   * Helper text displayed below the input
   */
  helperText?: string;
  /**
   * Error message to display
   */
  error?: string;
  /**
   * Success message to display
   */
  success?: string;
  /**
   * Validation status from validation utilities
   */
  validationStatus?: ValidationStatus;
  /**
   * Whether the field is required
   */
  required?: boolean;
  /**
   * HTML name attribute for the input
   */
  name: string;
}

/**
 * Complete form field component with label, input, and validation feedback
 * 
 * Features:
 * - Label with required indicator
 * - Input with error/success styling
 * - Validation feedback with icons
 * - Accessible error messages
 * - Helper text support
 * 
 * @example
 * // Basic field
 * <FormField
 *   label="Email"
 *   name="email"
 *   type="email"
 *   placeholder="you@example.com"
 * />
 * 
 * @example
 * // With validation
 * <FormField
 *   label="Email"
 *   name="email"
 *   type="email"
 *   validationStatus="error"
 *   error="Please enter a valid email"
 * />
 * 
 * @example
 * // With success state
 * <FormField
 *   label="Email"
 *   name="email"
 *   type="email"
 *   validationStatus="success"
 *   success="Looks good!"
 * />
 */
export const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>(
  (
    {
      label,
      name,
      helperText,
      error,
      success,
      validationStatus,
      required = false,
      className = '',
      ...inputProps
    },
    ref
  ) => {
    // Determine error/success state from validationStatus or explicit props
    const hasError = validationStatus === 'error' || !!error;
    const hasSuccess = validationStatus === 'success' || !!success;
    
    // Get the message to display
    const message = error || success || '';
    const showMessage = hasError || hasSuccess;

    return (
      <div className="flex flex-col gap-2">
        {/* Label */}
        <label
          htmlFor={name}
          className="text-sm font-medium text-text-primary"
        >
          {label}
          {required && (
            <span className="text-error ml-1" aria-label="required">
              *
            </span>
          )}
        </label>

        {/* Input */}
        <Input
          ref={ref}
          id={name}
          name={name}
          error={hasError}
          success={hasSuccess}
          className={className}
          aria-describedby={
            showMessage || helperText
              ? `${name}-message ${helperText ? `${name}-helper` : ''}`.trim()
              : undefined
          }
          aria-invalid={hasError}
          {...inputProps}
        />

        {/* Helper text */}
        {helperText && !showMessage && (
          <span
            id={`${name}-helper`}
            className="text-xs text-text-tertiary"
          >
            {helperText}
          </span>
        )}

        {/* Validation feedback */}
        {showMessage && (
          <div
            id={`${name}-message`}
            className={`text-xs flex items-center gap-2 transition-all duration-150 min-h-[1.125rem] ${
              hasError
                ? 'text-error'
                : hasSuccess
                ? 'text-success'
                : ''
            }`}
            role={hasError ? 'alert' : undefined}
          >
            {hasError ? (
              <AlertCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
            ) : hasSuccess ? (
              <CheckCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
            ) : null}
            <span>{message}</span>
          </div>
        )}
      </div>
    );
  }
);

FormField.displayName = 'FormField';

