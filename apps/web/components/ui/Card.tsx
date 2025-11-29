import React from 'react';

type CardVariant = 'default' | 'muted' | 'outline';
type CardPadding = 'none' | 'sm' | 'md' | 'lg';
type CardElement = 'div' | 'section' | 'article' | 'aside';

export interface CardProps extends React.HTMLAttributes<HTMLElement> {
  as?: CardElement;
  variant?: CardVariant;
  padding?: CardPadding;
  elevated?: boolean;
}

const variantClasses: Record<CardVariant, string> = {
  default: 'bg-bg-primary border border-border-light',
  muted: 'bg-bg-secondary border border-border-light',
  outline: 'bg-transparent border border-border-medium',
};

const paddingClasses: Record<CardPadding, string> = {
  none: 'p-0',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

/**
 * Card component with standardized surface, radius, and spacing.
 * Keeps container styling consistent across pages.
 */
export const Card = React.forwardRef<HTMLElement, CardProps>(
  (
    { as = 'div', variant = 'default', padding = 'md', elevated = false, className = '', ...props },
    ref,
  ) => {
    const base = 'rounded-base transition-shadow duration-200';
    const shadow = elevated ? 'shadow-md' : 'shadow-xs';
    const classes = [base, variantClasses[variant], paddingClasses[padding], shadow, className]
      .filter(Boolean)
      .join(' ')
      .trim();

    const Component = as;

    return <Component ref={ref as any} className={classes} {...props} />;
  },
);
Card.displayName = 'Card';

export const CardHeader = ({
  className = '',
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`flex flex-col gap-1 mb-4 ${className}`.trim()} {...props} />
);

export const CardTitle = ({
  className = '',
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3 className={`text-lg font-semibold text-text-primary ${className}`.trim()} {...props} />
);

export const CardDescription = ({
  className = '',
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className={`text-sm text-text-secondary ${className}`.trim()} {...props} />
);

export const CardContent = ({
  className = '',
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`flex flex-col gap-3 ${className}`.trim()} {...props} />
);

export const CardFooter = ({
  className = '',
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`mt-6 flex items-center justify-between gap-3 ${className}`.trim()} {...props} />
);
