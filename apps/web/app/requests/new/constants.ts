// Card and panel styling classes - still in use
export const baseCardClass = 'bg-bg-primary border border-border-light rounded-base shadow-sm';
export const sectionCardClass = `${baseCardClass} p-8`;
export const panelClass = 'rounded-2xl bg-white/90 p-5 shadow-sm';
export const mutedPanelClass = 'rounded-2xl bg-bg-secondary/70 p-5 shadow-sm';

/**
 * @deprecated Use the Button component from @/components/ui instead
 * These button classes are kept for backward compatibility but should not be used in new code
 * 
 * Migration example:
 * Old: <button className={primaryButtonClass}>Click me</button>
 * New: <Button>Click me</Button>
 */
export const primaryButtonClass =
  'inline-flex items-center justify-center gap-2 rounded-base bg-gradient-to-b from-primary to-primary-hover px-6 py-3 text-sm font-semibold text-white shadow-xs transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60';
  
/**
 * @deprecated Use the Button component with variant="outline" from @/components/ui instead
 */
export const outlineButtonClass =
  'inline-flex items-center justify-center gap-2 rounded-base border border-border-light px-5 py-3 text-sm font-medium text-text-secondary hover:text-text-primary hover:border-border transition';
  
/**
 * @deprecated Use the Button component with variant="ghost" from @/components/ui instead
 */
export const ghostButtonClass =
  'inline-flex items-center justify-center gap-2 rounded-base border border-dashed border-border-light px-5 py-3 text-sm font-medium text-text-secondary hover:text-text-primary transition';
