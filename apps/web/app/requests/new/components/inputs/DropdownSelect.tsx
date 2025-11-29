'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';

import type { DropdownOption } from '@/app/requests/new/types';

interface DropdownSelectProps<Option extends DropdownOption = DropdownOption> {
  id?: string;
  value: string;
  options: Option[];
  placeholder: string;
  onSelect: (value: Option['value']) => void;
  triggerClassName?: string;
  optionClassName?: (option: Option, isActive: boolean) => string;
  startIcon?: React.ReactNode;
  renderSelected?: (option?: Option) => React.ReactNode;
  renderOption?: (option: Option, isActive: boolean) => React.ReactNode;
  ariaLabel?: string;
}

export function DropdownSelect<Option extends DropdownOption = DropdownOption>({
  id,
  value,
  options,
  placeholder,
  onSelect,
  triggerClassName = '',
  optionClassName,
  startIcon,
  renderSelected,
  renderOption,
  ariaLabel,
}: DropdownSelectProps<Option>) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const selectedOption = options.find((option) => option.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option: Option) => {
    onSelect(option.value);
    setIsOpen(false);
  };

  const baseTriggerClasses =
    'w-full h-12 rounded-base border px-4 flex items-center justify-between text-base transition focus-visible:ring-2 focus-visible:ring-primary/40';
  const baseOptionClasses = 'w-full px-4 py-2 text-left text-sm transition';

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        id={id}
        className={`${baseTriggerClasses} ${triggerClassName}`}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={ariaLabel}
      >
        <span className="flex w-full items-center gap-2 text-left">
          {startIcon}
          <span className={`${selectedOption ? 'text-text-primary' : 'text-text-tertiary'} flex-1`}>
            {renderSelected ? renderSelected(selectedOption) : selectedOption?.label || placeholder}
          </span>
        </span>
        <ChevronDown className={`h-4 w-4 text-text-tertiary transition ${isOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>
      {isOpen && (
        <div
          role="listbox"
          className="absolute z-20 mt-2 max-h-64 w-full overflow-y-auto rounded-2xl border border-border-light bg-white shadow-lg"
        >
          {options.map((option) => {
            const isActive = option.value === value;
            const optionClasses =
              optionClassName?.(option, isActive) ??
              (isActive
                ? 'bg-primary/5 text-primary font-semibold'
                : 'text-text-secondary hover:bg-bg-secondary/60');
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option)}
                className={`${baseOptionClasses} ${optionClasses}`}
                role="option"
                aria-selected={isActive}
              >
                {renderOption ? renderOption(option, isActive) : option.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
