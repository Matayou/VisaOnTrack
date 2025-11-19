'use client';

import { forwardRef, useImperativeHandle, useRef } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';

interface DatePickerTriggerProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'onChange'> {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  displayValue: string;
  buttonClassName?: string;
  icon?: React.ReactNode;
}

export const DatePickerTrigger = forwardRef<HTMLInputElement, DatePickerTriggerProps>(
  ({ value, onChange, displayValue, buttonClassName = '', icon, onBlur, ...inputProps }, forwardedRef) => {
    const internalRef = useRef<HTMLInputElement | null>(null);

    useImperativeHandle(forwardedRef, () => internalRef.current as HTMLInputElement);

    const handleClick = () => {
      const target = internalRef.current;
      if (!target) {
        return;
      }
      if (typeof target.showPicker === 'function') {
        target.showPicker();
      } else {
        target.click();
      }
    };

    const triggerClasses =
      'w-full h-12 rounded-base border px-4 flex items-center justify-between text-base transition focus-visible:ring-2 focus-visible:ring-primary/40';

    return (
      <div className="relative">
        <button
          type="button"
          className={`${triggerClasses} ${buttonClassName}`}
          onClick={handleClick}
          aria-haspopup="dialog"
          aria-expanded="false"
          aria-controls={inputProps.id}
        >
          <span className="flex items-center gap-3 text-left">
            {icon || <Calendar className="w-4 h-4 text-text-tertiary" aria-hidden="true" />}
            <span className={value ? 'text-text-primary' : 'text-text-tertiary'}>{displayValue}</span>
          </span>
          <ChevronDown className="w-4 h-4 text-text-tertiary" aria-hidden="true" />
        </button>
        <input
          ref={internalRef}
          type="date"
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className="sr-only"
          {...inputProps}
        />
      </div>
    );
  },
);

DatePickerTrigger.displayName = 'DatePickerTrigger';
