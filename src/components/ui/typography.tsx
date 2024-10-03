import React from 'react'
import { cn } from '@/lib/utils'

interface TypographyProps {
  variant: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'blockquote' | 'ul' | 'ol'
  children: React.ReactNode
  className?: string
}

const variantClasses = {
  h1: 'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl',
  h2: 'scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0',
  h3: 'scroll-m-20 text-2xl font-semibold tracking-tight',
  h4: 'scroll-m-20 text-xl font-semibold tracking-tight',
  h5: 'scroll-m-20 text-lg font-semibold tracking-tight',
  h6: 'scroll-m-20 text-base font-semibold tracking-tight',
  p: 'leading-7 [&:not(:first-child)]:mt-6',
  blockquote: 'mt-6 border-l-2 pl-6 italic',
  ul: 'my-6 ml-6 list-disc [&>li]:mt-2',
  ol: 'my-6 ml-6 list-decimal [&>li]:mt-2',
}

export function Typography({ variant, children, className }: TypographyProps) {
  const Component = variant.startsWith('h') ? variant : variant === 'p' ? 'p' : variant === 'blockquote' ? 'blockquote' : 'ul'
  
  return React.createElement(
    Component,
    { className: cn(variantClasses[variant], className) },
    children
  )
}