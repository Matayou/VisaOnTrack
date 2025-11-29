'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';

export interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  open: boolean;
  title?: string;
  description?: string;
  onClose?: () => void;
  size?: 'sm' | 'md' | 'lg';
  showCloseButton?: boolean;
  footer?: React.ReactNode;
}

const sizeClasses: Record<NonNullable<ModalProps['size']>, string> = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
};

/**
 * Accessible modal/dialog with focus trap escape (Esc) and backdrop click support.
 * Does not manage its own state—pass `open` and `onClose` from the parent.
 */
export const Modal: React.FC<ModalProps> = ({
  open,
  title,
  description,
  children,
  onClose,
  size = 'md',
  showCloseButton = true,
  footer,
  className = '',
  ...props
}) => {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose?.();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.classList.add('overflow-hidden');

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.classList.remove('overflow-hidden');
    };
  }, [open, onClose]);

  if (!open) return null;

  const panelClasses = [
    'w-full',
    sizeClasses[size],
    'rounded-lg bg-bg-primary border border-border-light shadow-lg',
    'p-6',
    className,
  ]
    .filter(Boolean)
    .join(' ')
    .trim();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-10 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
      aria-describedby={description ? 'modal-description' : undefined}
      onClick={onClose}
    >
      <div
        className={panelClasses}
        onClick={(e) => e.stopPropagation()}
        {...props}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            {title && (
              <h2 id="modal-title" className="text-lg font-semibold text-text-primary">
                {title}
              </h2>
            )}
            {description && (
              <p id="modal-description" className="text-sm text-text-secondary">
                {description}
              </p>
            )}
          </div>
          {showCloseButton && (
            <Button
              variant="ghost"
              size="sm"
              aria-label="Close dialog"
              onClick={onClose}
              className="h-10 w-10 rounded-full p-0"
              icon={<X className="h-4 w-4" aria-hidden="true" />}
            />
          )}
        </div>

        <div className="mt-4">{children}</div>

        {footer && <div className="mt-6">{footer}</div>}
      </div>
    </div>
  );
};
