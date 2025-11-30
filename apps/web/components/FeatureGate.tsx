'use client';

import { ReactNode, useState, useEffect } from 'react';
import { api, type EntitlementsResponse } from '@visaontrack/client';
import { UpgradePromptModal } from './UpgradePromptModal';
import { Spinner } from '@/components/ui';

interface FeatureGateProps {
  /**
   * The entitlement key to check (e.g., 'consultations.canOffer', 'analytics.enabled')
   */
  feature: string;

  /**
   * Content to render if user has access to the feature
   */
  children: ReactNode;

  /**
   * Optional fallback content to render if user doesn't have access
   * If not provided, shows upgrade prompt modal
   */
  fallback?: ReactNode;

  /**
   * Variant of the upgrade modal to show
   */
  modalVariant?: 'detailed' | 'simple';

  /**
   * If true, prevents showing upgrade modal and just hides the content
   */
  silent?: boolean;
}

export function FeatureGate({
  feature,
  children,
  fallback,
  modalVariant = 'detailed',
  silent = false,
}: FeatureGateProps) {
  const [entitlements, setEntitlements] = useState<EntitlementsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    const fetchEntitlements = async () => {
      try {
        const data = await api.billing.getEntitlements();
        setEntitlements(data);

        // Check if user has access to the feature
        const featureValue = data.entitlements[feature];

        // Handle boolean entitlements
        if (typeof featureValue === 'boolean') {
          setHasAccess(featureValue);
        }
        // Handle string/number entitlements (if they exist, user has access)
        else if (featureValue !== undefined && featureValue !== null) {
          setHasAccess(true);
        }
        // Feature not found or explicitly disabled
        else {
          setHasAccess(false);
        }
      } catch (error) {
        console.error('Failed to fetch entitlements:', error);
        // On error, deny access by default
        setHasAccess(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEntitlements();
  }, [feature]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Spinner />
      </div>
    );
  }

  // User has access - render children
  if (hasAccess) {
    return <>{children}</>;
  }

  // User doesn't have access

  // If silent mode, just return null
  if (silent) {
    return null;
  }

  // If custom fallback provided, render it
  if (fallback) {
    return <>{fallback}</>;
  }

  // Default: show upgrade prompt modal
  return (
    <>
      <div onClick={() => setShowUpgradeModal(true)} className="cursor-pointer">
        {children}
      </div>
      <UpgradePromptModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        feature={feature}
        variant={modalVariant}
      />
    </>
  );
}

/**
 * Hook to check if user has access to a feature
 * Useful for conditional logic outside of rendering
 */
export function useFeatureAccess(feature: string): {
  hasAccess: boolean;
  isLoading: boolean;
  entitlements: EntitlementsResponse | null;
} {
  const [entitlements, setEntitlements] = useState<EntitlementsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    const fetchEntitlements = async () => {
      try {
        const data = await api.billing.getEntitlements();
        setEntitlements(data);

        const featureValue = data.entitlements[feature];

        if (typeof featureValue === 'boolean') {
          setHasAccess(featureValue);
        } else if (featureValue !== undefined && featureValue !== null) {
          setHasAccess(true);
        } else {
          setHasAccess(false);
        }
      } catch (error) {
        console.error('Failed to fetch entitlements:', error);
        setHasAccess(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEntitlements();
  }, [feature]);

  return { hasAccess, isLoading, entitlements };
}
