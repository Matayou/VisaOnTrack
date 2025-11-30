import { PlanCode } from '@prisma/client';

/**
 * Feature entitlement configuration for each subscription plan.
 *
 * This defines what features and limits are available to each plan tier.
 * Used by EntitlementsService to check feature access and enforce plan limits.
 */
export const PLAN_ENTITLEMENTS = {
  [PlanCode.FREE]: {
    // Consultations
    'consultations.canOffer': false,
    'consultations.platformFee': 0, // Not applicable for FREE

    // Messaging
    'messaging.enabled': false, // Must upgrade to PRO/AGENCY to message clients

    // Credits
    'credits.monthlyFree': 0,

    // Service Packages
    'packages.max': 3,

    // File Uploads
    'fileUpload.maxSizeMB': 2,

    // Search & Discovery
    'search.rankingBoost': 1,

    // Analytics
    'analytics.enabled': false,
    'analytics.advanced': false,

    // Team Features
    'team.enabled': false,
    'team.maxMembers': 1,
  },
  [PlanCode.PRO]: {
    // Consultations
    'consultations.canOffer': true,
    'consultations.platformFee': 0.15, // 15% platform fee

    // Messaging
    'messaging.enabled': true, // PRO providers can message clients

    // Credits
    'credits.monthlyFree': 10,

    // Service Packages
    'packages.max': 12,

    // File Uploads
    'fileUpload.maxSizeMB': 25,

    // Search & Discovery
    'search.rankingBoost': 2,

    // Analytics
    'analytics.enabled': true,
    'analytics.advanced': false,

    // Team Features
    'team.enabled': false,
    'team.maxMembers': 1,
  },
  [PlanCode.AGENCY]: {
    // Consultations
    'consultations.canOffer': true,
    'consultations.platformFee': 0.10, // 10% platform fee

    // Messaging
    'messaging.enabled': true, // AGENCY providers can message clients

    // Credits
    'credits.monthlyFree': 30,

    // Service Packages
    'packages.max': 999,

    // File Uploads
    'fileUpload.maxSizeMB': 100,

    // Search & Discovery
    'search.rankingBoost': 5,

    // Analytics
    'analytics.enabled': true,
    'analytics.advanced': true,

    // Team Features
    'team.enabled': true,
    'team.maxMembers': 5,
  },
} as const;

// Extract entitlement keys from the FREE plan as the canonical shape
type FREEPlanEntitlements = typeof PLAN_ENTITLEMENTS['FREE'];
export type EntitlementKey = keyof FREEPlanEntitlements;
export type EntitlementValue = string | number | boolean;

/**
 * Plan metadata for display purposes
 */
export const PLAN_METADATA = {
  [PlanCode.FREE]: {
    name: 'Free',
    price: 0,
    priceAnnual: 0,
    currency: 'THB',
    description: 'Get started with basic features',
    features: [
      'Create provider profile',
      'Buy credits as needed (฿100/credit)',
      'Send quotes to seekers',
      'Up to 3 service packages',
      'Basic file uploads (2MB)',
      '❌ No messaging with clients',
      '❌ No consultation offerings',
    ],
  },
  [PlanCode.PRO]: {
    name: 'Pro',
    price: 1490,
    priceAnnual: 14900, // ~17% discount
    currency: 'THB',
    description: 'Perfect for individual visa experts',
    popular: true,
    features: [
      'Everything in Free, plus:',
      '✅ Message clients directly',
      '✅ Offer FREE & PAID consultations',
      '10 free credits per month (฿1,000 value)',
      'Up to 12 service packages',
      'Advanced file uploads (25MB)',
      '2x search ranking boost',
      'Analytics dashboard',
      '15% platform fee on consultations',
    ],
  },
  [PlanCode.AGENCY]: {
    name: 'Agency',
    price: 4990,
    priceAnnual: 49900, // ~17% discount
    currency: 'THB',
    description: 'Built for agencies and teams',
    features: [
      'Everything in Pro, plus:',
      '✅ Unlimited messaging',
      '✅ Team consultations',
      '30 free credits per month (฿3,000 value)',
      'Unlimited service packages',
      'Premium file uploads (100MB)',
      '5x search ranking boost',
      'Advanced analytics & insights',
      'Team collaboration (up to 5 members)',
      '10% platform fee on consultations',
    ],
  },
} as const;

/**
 * Helper to get entitlement value for a specific plan and key
 */
export function getEntitlement<T extends EntitlementValue = EntitlementValue>(
  planCode: PlanCode,
  key: EntitlementKey,
): T {
  return PLAN_ENTITLEMENTS[planCode][key] as T;
}

/**
 * Helper to check if a plan has a boolean entitlement
 */
export function hasEntitlement(planCode: PlanCode, key: EntitlementKey): boolean {
  const value = PLAN_ENTITLEMENTS[planCode][key];
  return typeof value === 'boolean' ? value : false;
}
