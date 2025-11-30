'use client';

import { X, Sparkles, TrendingUp, DollarSign, Users } from 'lucide-react';
import { Button } from '@/components/ui';
import { useRouter } from 'next/navigation';

interface UpgradePromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature?: string;
  variant?: 'detailed' | 'simple';
}

export function UpgradePromptModal({
  isOpen,
  onClose,
  variant = 'detailed',
}: UpgradePromptModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const handleUpgrade = () => {
    router.push('/pricing');
    onClose();
  };

  if (variant === 'simple') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Premium Feature
            </h2>
            <p className="text-gray-600">
              This feature requires a Pro or Agency plan
            </p>
          </div>

          <div className="flex gap-3">
            <Button variant="secondary" onClick={onClose} className="flex-1">
              Maybe Later
            </Button>
            <Button onClick={handleUpgrade} className="flex-1">
              View Plans
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Detailed variant
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="p-6 text-center border-b border-gray-100">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Upgrade to Offer Consultations
          </h2>
          <p className="text-gray-600">
            Build trust, generate revenue, and close more deals
          </p>
        </div>

        {/* Current Plan Notice */}
        <div className="mx-6 mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-sm text-amber-900 font-medium">
            You're currently on the <span className="font-bold">Free</span> plan
          </p>
          <p className="text-xs text-amber-700 mt-1">
            Upgrade to unlock premium features and grow your business
          </p>
        </div>

        {/* Why Consultations Matter */}
        <div className="p-6">
          <h3 className="font-bold text-gray-900 mb-4">
            Why offer consultations?
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Users className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Build trust before sending quotes</p>
                <p className="text-sm text-gray-600">
                  Let clients meet you first through a discovery call
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                <DollarSign className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Generate additional revenue</p>
                <p className="text-sm text-gray-600">
                  Offer paid consultations at your own hourly rate
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Higher conversion rates</p>
                <p className="text-sm text-gray-600">
                  Clients who book calls are 3x more likely to hire you
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recommended Plan */}
        <div className="mx-6 mb-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-blue-600 mb-1">RECOMMENDED</p>
              <h4 className="text-2xl font-bold text-gray-900">Pro Plan</h4>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-gray-900">฿1,490</p>
              <p className="text-sm text-gray-600">/month</p>
            </div>
          </div>

          <ul className="space-y-2 mb-4">
            <li className="flex items-center gap-2 text-sm text-gray-700">
              <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              Offer FREE & PAID consultations
            </li>
            <li className="flex items-center gap-2 text-sm text-gray-700">
              <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              10 free credits per month (฿1,000 value)
            </li>
            <li className="flex items-center gap-2 text-sm text-gray-700">
              <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              Analytics, 2x search boost, 12 packages
            </li>
          </ul>

          <p className="text-xs text-gray-600">
            <span className="font-medium">Platform fee:</span> 15% on paid consultations only
          </p>
        </div>

        {/* Alternative Option */}
        <div className="mx-6 mb-6 text-center">
          <p className="text-sm text-gray-600">
            Need even more?{' '}
            <button
              onClick={handleUpgrade}
              className="text-blue-600 font-medium hover:text-blue-700"
            >
              Check out Agency plan
            </button>{' '}
            with 10% fees and team features
          </p>
        </div>

        {/* Trial Notice */}
        <div className="mx-6 mb-6 bg-green-50 border border-green-200 rounded-xl p-4 text-center">
          <p className="text-sm font-medium text-green-900">
            Start with a <span className="font-bold">14-day free trial</span>
          </p>
          <p className="text-xs text-green-700 mt-1">
            No credit card required • Cancel anytime
          </p>
        </div>

        {/* Footer CTAs */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-4 flex gap-3">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            Maybe Later
          </Button>
          <Button onClick={handleUpgrade} className="flex-1">
            Start Free Trial - Upgrade to Pro
          </Button>
        </div>
      </div>
    </div>
  );
}
