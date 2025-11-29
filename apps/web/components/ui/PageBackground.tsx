'use client';

/**
 * PageBackground - Reusable decorative background component
 * 
 * Provides gradient orbs and subtle grid pattern for visual depth
 * across all pages. Should be placed at the root of page containers.
 */
export function PageBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Gradient orbs for depth */}
      <div className="bg-primary/5 absolute -right-32 top-0 h-96 w-96 rounded-full blur-3xl" />
      <div className="bg-primary/5 absolute -left-32 bottom-0 h-96 w-96 rounded-full blur-3xl" />
      
      {/* Subtle grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02]" 
        style={{
          backgroundImage: `linear-gradient(rgba(37, 99, 235, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(37, 99, 235, 0.1) 1px, transparent 1px)`,
          backgroundSize: '48px 48px'
        }}
      />
    </div>
  );
}

