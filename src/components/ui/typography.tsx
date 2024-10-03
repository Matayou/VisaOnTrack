import React from 'react'
import { cn } from '@/lib/utils'

interface TypographyProps {
  variant: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'blockquote' | 'list-item'
  children: React.ReactNode
  className?: string
}

export function Typography({ variant, children, className }: TypographyProps) {
  const baseStyles = 'text-foreground'
  
  const variantStyles = {
    h1: 'font-heading text-4xl font-bold md:text-5xl',
    h2: 'font-heading text-3xl font-semibold md:text-4xl',
    h3: 'font-heading text-2xl font-semibold md:text-3xl',
    h4: 'font-heading text-xl font-semibold md:text-2xl',
    h5: 'font-heading text-lg font-medium md:text-xl',
    h6: 'font-heading text-base font-medium md:text-lg',
    p: 'text-base leading-7',
    blockquote: 'mt-6 border-l-2 pl-6 italic',
    'list-item': 'mt-2',
  }

  const Component = variant === 'list-item' ? 'li' : variant

  return (
    <Component className={cn(baseStyles, variantStyles[variant], className)}>
      {children}
    </Component>
  )
}