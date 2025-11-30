'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, X } from 'lucide-react';
import { Footer } from '@/components/ui';

// Consistent number formatting to avoid hydration mismatch
const formatNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export default function PricingPage() {
  const router = useRouter();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');

  const getPrice = (monthly: number) => {
    if (billingPeriod === 'annual') {
      return Math.round(monthly * 10); // ~17% discount (10 months for 12)
    }
    return monthly;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 text-center sm:px-8">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Start free, upgrade when you're ready. All plans include access to our marketplace and tools to grow your visa services business.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-1 bg-gray-100 rounded-full p-1 mb-12">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-6 py-2 rounded-full font-medium text-sm transition-all ${
                billingPeriod === 'monthly'
                  ? 'bg-white shadow-sm text-gray-900'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('annual')}
              className={`px-6 py-2 rounded-full font-medium text-sm transition-all flex items-center gap-2 ${
                billingPeriod === 'annual'
                  ? 'bg-white shadow-sm text-gray-900'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Annual
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">
                Save 17%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:gap-6">

            {/* FREE Plan */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
              <div className="p-8 flex-1">
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Free</h3>
                  <div className="flex items-baseline gap-1 mb-3">
                    <span className="text-4xl font-bold text-gray-900">฿0</span>
                    <span className="text-gray-500">/month</span>
                  </div>
                  <p className="text-sm text-gray-600">For providers trying out the platform</p>
                </div>

                <button
                  onClick={() => router.push('/auth/register?role=provider')}
                  className="w-full bg-white text-gray-700 font-medium py-3 px-6 rounded-xl border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all mb-6"
                >
                  Get Started Free
                </button>

                <div className="space-y-3">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">What's included</p>

                  <FeatureItem included>Create provider profile</FeatureItem>
                  <FeatureItem included>Purchase credits (฿100 each)</FeatureItem>
                  <FeatureItem included>Send unlimited quotes</FeatureItem>
                  <FeatureItem included>Up to 3 service packages</FeatureItem>
                  <FeatureItem included>2MB file uploads</FeatureItem>
                  <FeatureItem included>Basic messaging</FeatureItem>
                  <FeatureItem included={false}>Offer consultations</FeatureItem>
                  <FeatureItem included={false}>Analytics dashboard</FeatureItem>
                  <FeatureItem included={false}>Priority search ranking</FeatureItem>
                </div>
              </div>
            </div>

            {/* PRO Plan - HIGHLIGHTED */}
            <div className="bg-white rounded-2xl border-2 border-blue-600 shadow-lg overflow-hidden flex flex-col relative">
              {/* Popular Badge */}
              <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold px-4 py-1.5 rounded-bl-lg">
                MOST POPULAR
              </div>

              <div className="p-8 flex-1">
                <div className="mb-6 mt-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Pro</h3>
                  <div className="flex items-baseline gap-1 mb-3">
                    <span className="text-4xl font-bold text-gray-900">
                      ฿{formatNumber(getPrice(1490))}
                    </span>
                    <span className="text-gray-500">/{billingPeriod === 'monthly' ? 'month' : 'year'}</span>
                  </div>
                  <p className="text-sm text-gray-600">For individual visa experts and consultants</p>
                </div>

                <button
                  onClick={() => {
                    // TODO: Integrate Stripe checkout
                    console.log('Starting Pro trial...');
                  }}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 mb-6"
                >
                  Start Free Trial
                </button>

                <div className="space-y-3">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Everything in Free, plus</p>

                  <FeatureItem included highlight>
                    <span className="font-semibold text-gray-900">Offer FREE & PAID consultations</span>
                    <span className="block text-xs text-gray-500 mt-0.5">15% platform fee</span>
                  </FeatureItem>
                  <FeatureItem included><strong>10 free credits</strong> per month</FeatureItem>
                  <FeatureItem included>Up to 12 service packages</FeatureItem>
                  <FeatureItem included>25MB file uploads</FeatureItem>
                  <FeatureItem included>Analytics dashboard</FeatureItem>
                  <FeatureItem included><strong>2x</strong> priority search ranking</FeatureItem>
                  <FeatureItem included>Priority email support (24h)</FeatureItem>
                </div>
              </div>
            </div>

            {/* AGENCY Plan */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
              <div className="p-8 flex-1">
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Agency</h3>
                  <div className="flex items-baseline gap-1 mb-3">
                    <span className="text-4xl font-bold text-gray-900">
                      ฿{formatNumber(getPrice(4990))}
                    </span>
                    <span className="text-gray-500">/{billingPeriod === 'monthly' ? 'month' : 'year'}</span>
                  </div>
                  <p className="text-sm text-gray-600">For agencies and high-volume providers</p>
                </div>

                <button
                  onClick={() => {
                    // TODO: Integrate Stripe checkout
                    console.log('Starting Agency trial...');
                  }}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 mb-6"
                >
                  Contact Sales
                </button>

                <div className="space-y-3">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Everything in Pro, plus</p>

                  <FeatureItem included highlight>
                    <span className="font-semibold text-gray-900">Reduced platform fee</span>
                    <span className="block text-xs text-gray-500 mt-0.5">10% vs 15% on consultations</span>
                  </FeatureItem>
                  <FeatureItem included><strong>30 free credits</strong> per month</FeatureItem>
                  <FeatureItem included>Unlimited service packages</FeatureItem>
                  <FeatureItem included>100MB file uploads</FeatureItem>
                  <FeatureItem included>Advanced analytics + export</FeatureItem>
                  <FeatureItem included>Team collaboration (5 users)</FeatureItem>
                  <FeatureItem included><strong>5x</strong> priority search ranking</FeatureItem>
                  <FeatureItem included>Premium support (4h response)</FeatureItem>
                  <FeatureItem included>White-label consultation links</FeatureItem>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Feature Comparison Table */}
        <div className="mx-auto mt-24 max-w-7xl px-6 sm:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Compare Plans</h2>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200">
                <tr>
                  <th className="text-left p-4 text-sm font-semibold text-gray-700">Feature</th>
                  <th className="text-center p-4 text-sm font-semibold text-gray-700">Free</th>
                  <th className="text-center p-4 text-sm font-semibold text-gray-700 bg-blue-50">Pro</th>
                  <th className="text-center p-4 text-sm font-semibold text-gray-700">Agency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {/* Consultations */}
                <tr>
                  <td className="p-4 text-sm text-gray-900 font-medium" colSpan={4}>Consultations</td>
                </tr>
                <tr>
                  <td className="p-4 text-sm text-gray-600 pl-8">Offer FREE consultations</td>
                  <td className="p-4 text-center"><TableX /></td>
                  <td className="p-4 text-center bg-blue-50"><TableCheck /></td>
                  <td className="p-4 text-center"><TableCheck /></td>
                </tr>
                <tr>
                  <td className="p-4 text-sm text-gray-600 pl-8">Offer PAID consultations</td>
                  <td className="p-4 text-center"><TableX /></td>
                  <td className="p-4 text-center bg-blue-50"><TableCheck /></td>
                  <td className="p-4 text-center"><TableCheck /></td>
                </tr>
                <tr>
                  <td className="p-4 text-sm text-gray-600 pl-8">Platform fee on consultations</td>
                  <td className="p-4 text-center text-gray-400">—</td>
                  <td className="p-4 text-center bg-blue-50 text-sm">15%</td>
                  <td className="p-4 text-center text-sm font-semibold text-green-700">10%</td>
                </tr>

                {/* Credits & Unlocking */}
                <tr>
                  <td className="p-4 text-sm text-gray-900 font-medium" colSpan={4}>Credits & Unlocking</td>
                </tr>
                <tr>
                  <td className="p-4 text-sm text-gray-600 pl-8">Monthly free credits</td>
                  <td className="p-4 text-center text-sm">0</td>
                  <td className="p-4 text-center bg-blue-50 text-sm font-semibold">10</td>
                  <td className="p-4 text-center text-sm font-semibold">30</td>
                </tr>

                {/* Content Limits */}
                <tr>
                  <td className="p-4 text-sm text-gray-900 font-medium" colSpan={4}>Content Limits</td>
                </tr>
                <tr>
                  <td className="p-4 text-sm text-gray-600 pl-8">Service packages</td>
                  <td className="p-4 text-center text-sm">3</td>
                  <td className="p-4 text-center bg-blue-50 text-sm">12</td>
                  <td className="p-4 text-center text-sm">Unlimited</td>
                </tr>
                <tr>
                  <td className="p-4 text-sm text-gray-600 pl-8">File upload size</td>
                  <td className="p-4 text-center text-sm">2MB</td>
                  <td className="p-4 text-center bg-blue-50 text-sm">25MB</td>
                  <td className="p-4 text-center text-sm">100MB</td>
                </tr>

                {/* Visibility */}
                <tr>
                  <td className="p-4 text-sm text-gray-900 font-medium" colSpan={4}>Visibility</td>
                </tr>
                <tr>
                  <td className="p-4 text-sm text-gray-600 pl-8">Search ranking boost</td>
                  <td className="p-4 text-center text-sm">1x</td>
                  <td className="p-4 text-center bg-blue-50 text-sm font-semibold">2x</td>
                  <td className="p-4 text-center text-sm font-semibold">5x</td>
                </tr>

                {/* Analytics & Insights */}
                <tr>
                  <td className="p-4 text-sm text-gray-900 font-medium" colSpan={4}>Analytics & Insights</td>
                </tr>
                <tr>
                  <td className="p-4 text-sm text-gray-600 pl-8">Basic analytics</td>
                  <td className="p-4 text-center"><TableX /></td>
                  <td className="p-4 text-center bg-blue-50"><TableCheck /></td>
                  <td className="p-4 text-center"><TableCheck /></td>
                </tr>
                <tr>
                  <td className="p-4 text-sm text-gray-600 pl-8">Advanced analytics</td>
                  <td className="p-4 text-center"><TableX /></td>
                  <td className="p-4 text-center bg-blue-50"><TableX /></td>
                  <td className="p-4 text-center"><TableCheck /></td>
                </tr>

                {/* Support & Collaboration */}
                <tr>
                  <td className="p-4 text-sm text-gray-900 font-medium" colSpan={4}>Support & Collaboration</td>
                </tr>
                <tr>
                  <td className="p-4 text-sm text-gray-600 pl-8">Support tier</td>
                  <td className="p-4 text-center text-sm">Standard</td>
                  <td className="p-4 text-center bg-blue-50 text-sm">Priority (24h)</td>
                  <td className="p-4 text-center text-sm">Premium (4h)</td>
                </tr>
                <tr>
                  <td className="p-4 text-sm text-gray-600 pl-8">Team members</td>
                  <td className="p-4 text-center text-sm">1</td>
                  <td className="p-4 text-center bg-blue-50 text-sm">1</td>
                  <td className="p-4 text-center text-sm">5</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mx-auto mb-16 mt-24 max-w-3xl px-6 sm:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Frequently Asked Questions</h2>

          <div className="space-y-4">
            <details className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 group">
              <summary className="font-semibold text-gray-900 cursor-pointer list-none flex items-center justify-between">
                How do credits work?
                <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-3 text-sm text-gray-600">
                Credits are used to unlock visa requests. Each credit costs ฿100 and unlocks one request, allowing you to view contact details and send quotes. PRO plans include 10 free credits/month, AGENCY plans include 30 free credits/month.
              </p>
            </details>

            <details className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 group">
              <summary className="font-semibold text-gray-900 cursor-pointer list-none flex items-center justify-between">
                What's the platform fee for consultations?
                <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-3 text-sm text-gray-600">
                PRO plan: 15% platform fee. AGENCY plan: 10% platform fee. If you charge ฿2,500 for a consultation, you keep ฿2,125 (PRO) or ฿2,250 (AGENCY). FREE plans cannot offer consultations.
              </p>
            </details>

            <details className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 group">
              <summary className="font-semibold text-gray-900 cursor-pointer list-none flex items-center justify-between">
                Can I cancel anytime?
                <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-3 text-sm text-gray-600">
                Yes! You can cancel your subscription at any time. Your access continues until the end of your current billing period, then you'll be downgraded to the FREE plan.
              </p>
            </details>

            <details className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 group">
              <summary className="font-semibold text-gray-900 cursor-pointer list-none flex items-center justify-between">
                Do monthly credits roll over?
                <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-3 text-sm text-gray-600">
                No, monthly free credits don't roll over. They reset on the 1st of each month. This "use it or lose it" model encourages active engagement with leads.
              </p>
            </details>
          </div>
        </div>

      </div>

      <Footer />
    </div>
  );
}

// Feature item component for plan cards
function FeatureItem({ 
  children, 
  included, 
  highlight = false 
}: { 
  children: React.ReactNode; 
  included: boolean;
  highlight?: boolean;
}) {
  if (included) {
    return (
      <div className="flex items-start gap-3">
        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
        <span className={`text-sm ${highlight ? '' : 'text-gray-700'}`}>{children}</span>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 opacity-50">
      <X className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
      <span className="text-sm text-gray-500 line-through">{children}</span>
    </div>
  );
}

// Table checkmark
function TableCheck() {
  return <span className="text-green-600 font-bold">✓</span>;
}

// Table X mark
function TableX() {
  return <span className="text-red-500 font-bold">✗</span>;
}
