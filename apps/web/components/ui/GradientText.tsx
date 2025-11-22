'use client';

import React from 'react';

/**
 * GradientText - Reusable gradient text component for headings
 * 
 * Applies a gradient from text-primary to primary color
 * for visually appealing headings across the app.
 */
export function GradientText({ 
  children, 
  className = '' 
}: { 
  children: React.ReactNode; 
  className?: string;
}) {
  return (
    <span className={`bg-gradient-to-r from-text-primary to-primary bg-clip-text text-transparent ${className}`}>
      {children}
    </span>
  );
}

