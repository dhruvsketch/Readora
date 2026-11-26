/**
 * Privacy-preserving, lightweight CTA analytics tracker for Readora.
 * Dispatches DOM CustomEvents without capturing personal data.
 */

export interface CTAClickEventDetail {
  ctaName: string;
  section: string;
  destination?: string;
  timestamp: string;
  metadata?: Record<string, string | number | boolean>;
}

export function trackCTA(
  ctaName: string,
  section: string,
  destination?: string,
  metadata?: Record<string, string | number | boolean>
) {
  const detail: CTAClickEventDetail = {
    ctaName,
    section,
    destination,
    timestamp: new Date().toISOString(),
    metadata,
  };

  // Dispatch custom browser event for integration with external analytics (Plausible, PostHog, etc.)
  if (typeof window !== 'undefined') {
    const event = new CustomEvent<CTAClickEventDetail>('readora:cta_click', {
      bubbles: true,
      detail,
    });
    window.dispatchEvent(event);

    if (import.meta.env.DEV) {
      // In dev mode, provide helpful console feedback for verification
      console.debug('[Readora Analytics] CTA Clicked:', detail);
    }
  }
}
