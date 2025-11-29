import React from 'react';
import { CheckCircle2, Info, AlertTriangle, XCircle } from 'lucide-react';

type ToastVariant = 'info' | 'success' | 'warning' | 'error';

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: ToastVariant;
  title?: string;
  description?: string;
  inline?: boolean;
}

const variantStyles: Record<ToastVariant, { icon: React.ReactNode; classes: string }> = {
  info: {
    icon: <Info className="h-5 w-5 text-primary" aria-hidden="true" />,
    classes: 'border border-primary/20 bg-primary/5 text-text-primary',
  },
  success: {
    icon: <CheckCircle2 className="h-5 w-5 text-success" aria-hidden="true" />,
    classes: 'border border-success/30 bg-success-light/40 text-text-primary',
  },
  warning: {
    icon: <AlertTriangle className="h-5 w-5 text-warning" aria-hidden="true" />,
    classes: 'border border-warning/30 bg-warning-light/40 text-text-primary',
  },
  error: {
    icon: <XCircle className="h-5 w-5 text-error" aria-hidden="true" />,
    classes: 'border border-error/30 bg-error-light/40 text-text-primary',
  },
};

/**
 * Lightweight, inline toast/alert component (not a global toasting system).
 * Useful for success/error banners that need consistent styling.
 */
export const Toast: React.FC<ToastProps> = ({
  variant = 'info',
  title,
  description,
  children,
  inline = true,
  className = '',
  ...props
}) => {
  const { icon, classes } = variantStyles[variant];
  const layout = inline ? 'flex-row items-start' : 'flex-col';

  return (
    <div
      role="status"
      className={[
        'flex gap-3 rounded-base p-4 shadow-xs',
        classes,
        layout,
        className,
      ]
        .filter(Boolean)
        .join(' ')
        .trim()}
      {...props}
    >
      <div className="mt-0.5">{icon}</div>
      <div className="flex-1 space-y-1">
        {title && <p className="text-sm font-semibold text-text-primary">{title}</p>}
        {(description || children) && (
          <p className="text-sm text-text-secondary">{description ?? children}</p>
        )}
      </div>
    </div>
  );
};
