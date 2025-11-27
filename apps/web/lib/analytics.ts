export type AnalyticsPayload = Record<string, unknown>;

function getSessionId(): string | null {
  if (typeof window === 'undefined') return null;
  const existing = sessionStorage.getItem('sp_analytics_session');
  if (existing) return existing;
  const id = (crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`);
  sessionStorage.setItem('sp_analytics_session', id);
  return id;
}

/**
 * Lightweight analytics wrapper.
 * - Tries window.analytics.track (Segment-style)
 * - Falls back to gtag event
 * - No-ops silently if neither is available
 */
export function trackEvent(event: string, payload: AnalyticsPayload = {}): void {
  if (typeof window === 'undefined') return;

  const sessionId = getSessionId();
  const data = sessionId ? { sessionId, ...payload } : payload;

  const anyWindow = window as unknown as {
    analytics?: { track?: (event: string, data?: AnalyticsPayload) => void };
    gtag?: (...args: unknown[]) => void;
  };

  try {
    if (typeof anyWindow.analytics?.track === 'function') {
      anyWindow.analytics.track(event, data);
      return;
    }

    if (typeof anyWindow.gtag === 'function') {
      anyWindow.gtag('event', event, data);
      return;
    }
  } catch (err) {
    console.warn('[analytics] track failed', { event, data, err });
  }

  // Dev fallback: no-op
}
