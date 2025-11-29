import React from 'react';

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options?: SelectOption[];
  error?: boolean;
  success?: boolean;
}

/**
 * Standardized Select component using the same sizing and radius as Input.
 * Accepts either `options` prop or children <option> elements.
 */
export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ options, error = false, success = false, className = '', disabled, children, ...props }, ref) => {
    const baseClasses =
      'w-full h-12 px-4 text-base font-sans text-text-primary bg-bg-primary border rounded-base transition-all duration-150 outline-none appearance-none bg-[url(\"data:image/svg+xml,%3Csvg width=\'12\' height=\'8\' viewBox=\'0 0 12 8\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M1 1l5 5 5-5\' stroke=\'%23525252\' stroke-width=\'1.5\' fill=\'none\' stroke-linecap=\'round\' stroke-linejoin=\'round\'/%3E%3C/svg%3E%27)] bg-no-repeat bg-[length:12px_8px] bg-[right_0.9rem_center]';

    const stateClasses = error
      ? 'border-error bg-error-light/5 focus:shadow-focus-error focus:border-error'
      : success
      ? 'border-success bg-success-light/5 focus:shadow-focus-success focus:border-success'
      : 'border-border-light hover:border-border-medium focus:border-primary focus:shadow-focus-primary';

    const disabledClasses = disabled
      ? 'cursor-not-allowed opacity-60 bg-bg-tertiary text-text-tertiary'
      : '';

    const classes = [baseClasses, stateClasses, disabledClasses, className].filter(Boolean).join(' ').trim();

    return (
      <select ref={ref} className={classes} disabled={disabled} aria-invalid={error} {...props}>
        {options
          ? options.map((option) => (
              <option key={option.value} value={option.value} disabled={option.disabled}>
                {option.label}
              </option>
            ))
          : children}
      </select>
    );
  },
);

Select.displayName = 'Select';
