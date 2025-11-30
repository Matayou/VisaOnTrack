'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  CreditCard,
  Download,
  TrendingUp,
  FileText,
  HelpCircle,
  ArrowRight,
  Wallet,
  Calendar,
  ChevronLeft,
  Plus,
  CheckCircle2,
} from 'lucide-react';
import { ProviderHeader } from '@/components/ProviderHeader';
import { Button, Spinner, Card, Footer } from '@/components/ui';
import { api, type EntitlementsResponse, type PlanCode } from '@visaontrack/client';
import { LOADING_GENERIC } from '@/lib/loading-messages';
import { getErrorDisplayMessage } from '@/lib/error-handling';

interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: string;
  url: string;
}

export default function BillingSettingsPage() {
  const router = useRouter();
  const [entitlements, setEntitlements] = useState<EntitlementsResponse | null>(null);
  const [credits, setCredits] = useState<number>(0);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [entitlementsRes, creditsRes] = await Promise.all([
          api.billing.getEntitlements(),
          api.credits.getBalance(),
        ]);

        setEntitlements(entitlementsRes);
        setCredits(creditsRes.credits);

        // TODO: Fetch real invoices from Stripe
        setInvoices([
          { id: '1', date: 'Nov 1, 2024', amount: 1490, status: 'Paid', url: '#' },
          { id: '2', date: 'Oct 1, 2024', amount: 1490, status: 'Paid', url: '#' },
        ]);
      } catch (err: unknown) {
        const errorObj = err as { status?: number };
        if (errorObj?.status === 401) {
          router.push('/auth/login');
          return;
        }
        setError(getErrorDisplayMessage(err));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const getPlanBadgeColor = (planCode: PlanCode): string => {
    const colors: Record<PlanCode, string> = {
      FREE: 'bg-bg-tertiary text-text-secondary',
      PRO: 'bg-primary/10 text-primary',
      AGENCY: 'bg-primary/20 text-primary',
    };
    return colors[planCode];
  };

  const getUsagePercentage = (used: number, max: number): number => {
    return max > 0 ? (used / max) * 100 : 0;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-secondary">
        <ProviderHeader />
        <div className="flex items-center justify-center py-32">
          <div className="text-center">
            <Spinner size="lg" />
            <p className="mt-4 text-text-secondary">{LOADING_GENERIC}</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !entitlements) {
    return (
      <div className="min-h-screen bg-bg-secondary">
        <ProviderHeader />
        <div className="flex items-center justify-center p-4 py-32">
          <Card padding="lg" className="max-w-md rounded-lg text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-error-light">
              <HelpCircle className="h-6 w-6 text-error" />
            </div>
            <h2 className="mb-2 text-xl font-bold text-text-primary">
              Failed to Load Billing Settings
            </h2>
            <p className="mb-6 text-text-secondary">{error || 'An error occurred'}</p>
            <Button onClick={() => router.push('/providers/dashboard')}>
              Back to Dashboard
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  const nextBillingDate = new Date();
  nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
  nextBillingDate.setDate(1);

  const creditsUsagePercent = entitlements.usage.monthlyFreeCredits > 0
    ? getUsagePercentage(
        entitlements.usage.creditsUsedThisMonth,
        entitlements.usage.monthlyFreeCredits
      )
    : 0;

  const packagesUsagePercent = getUsagePercentage(
    entitlements.usage.packagesCreated,
    entitlements.usage.packagesMax
  );

  const getPlanPrice = (planCode: PlanCode): string => {
    const prices: Record<PlanCode, string> = {
      FREE: '฿0',
      PRO: '฿1,490',
      AGENCY: '฿4,990',
    };
    return prices[planCode];
  };

  return (
    <div className="min-h-screen bg-bg-secondary">
      <ProviderHeader />

      <main className="mx-auto max-w-7xl px-6 py-8 sm:px-8 lg:py-10">
        {/* Page Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/providers/dashboard')}
            className="mb-3 flex items-center gap-1 text-sm text-text-tertiary transition-colors hover:text-text-secondary"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Dashboard
          </button>
          <h1 className="text-2xl font-bold text-text-primary lg:text-3xl">
            Billing & Subscription
          </h1>
          <p className="mt-1 text-text-secondary">
            Manage your plan, credits, and payment methods
          </p>
        </div>

        {/* Credit Balance Hero Card */}
        <Card className="mb-8 overflow-hidden rounded-lg bg-primary text-white" padding="lg">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-white/20">
                <Wallet className="h-7 w-7" />
              </div>
              <div>
                <p className="text-sm font-medium text-white/80">Credit Balance</p>
                <p className="text-4xl font-bold">{credits}</p>
              </div>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <button
                onClick={() => console.log('Buy credits...')}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-white px-6 font-medium text-primary transition-all hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white/50"
              >
                <Plus className="h-4 w-4" />
                Buy Credits
              </button>
              {entitlements.usage.monthlyFreeCredits > 0 && (
                <p className="text-center text-sm text-white/70 sm:ml-4 sm:text-left">
                  {entitlements.usage.monthlyFreeCredits - entitlements.usage.creditsUsedThisMonth} free credits remaining this month
                </p>
              )}
            </div>
          </div>
        </Card>

        <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
          {/* Main Content */}
          <div className="space-y-6 lg:col-span-2">
            {/* Current Plan Card */}
            <Card padding="lg" elevated className="rounded-lg">
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <span
                    className={`mb-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold ${getPlanBadgeColor(
                      entitlements.planCode
                    )}`}
                  >
                    {entitlements.planName}
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-text-primary">
                      {getPlanPrice(entitlements.planCode)}
                    </span>
                    <span className="text-text-tertiary">/month</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button variant="secondary" onClick={() => router.push('/pricing')}>
                    {entitlements.planCode === 'FREE' ? 'Upgrade Plan' : 'Change Plan'}
                  </Button>
                  {entitlements.planCode !== 'FREE' && (
                    <Button variant="outline" onClick={() => console.log('Opening customer portal...')}>
                      Manage Subscription
                    </Button>
                  )}
                </div>
              </div>

              {entitlements.planCode !== 'FREE' && (
                <div className="border-t border-border-light pt-4">
                  <div className="flex items-center gap-2 text-sm text-text-secondary">
                    <Calendar className="h-4 w-4 text-text-tertiary" />
                    <span>Next billing date:</span>
                    <span className="font-semibold text-text-primary">
                      {nextBillingDate.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
              )}
            </Card>

            {/* Usage Metrics */}
            <Card padding="lg" elevated className="rounded-lg">
              <h2 className="mb-6 text-xl font-bold text-text-primary">Usage This Month</h2>

              <div className="space-y-6">
                {/* Monthly Free Credits */}
                {entitlements.usage.monthlyFreeCredits > 0 && (
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-medium text-text-secondary">
                        Monthly Free Credits
                      </span>
                      <span className="text-sm font-semibold text-text-primary">
                        {entitlements.usage.creditsUsedThisMonth} / {entitlements.usage.monthlyFreeCredits} used
                      </span>
                    </div>
                    <div className="mb-2 h-2 overflow-hidden rounded-full bg-bg-tertiary">
                      <div
                        className="h-2 rounded-full bg-primary transition-all"
                        style={{ width: `${Math.min(creditsUsagePercent, 100)}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Service Packages */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium text-text-secondary">Service Packages</span>
                    <span className="text-sm font-semibold text-text-primary">
                      {entitlements.usage.packagesCreated} /{' '}
                      {entitlements.usage.packagesMax === 999 ? 'Unlimited' : entitlements.usage.packagesMax}
                    </span>
                  </div>
                  {entitlements.usage.packagesMax < 999 && (
                    <div className="h-2 overflow-hidden rounded-full bg-bg-tertiary">
                      <div
                        className="h-2 rounded-full bg-primary transition-all"
                        style={{ width: `${Math.min(packagesUsagePercent, 100)}%` }}
                      />
                    </div>
                  )}
                </div>

                {/* Consultations */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium text-text-secondary">Consultations Offered</span>
                    <span className="text-sm font-semibold text-text-primary">
                      {entitlements.usage.consultationsOffered} total
                    </span>
                  </div>
                  <p className="text-xs text-text-tertiary">
                    {entitlements.entitlements['consultations.canOffer']
                      ? `Platform fee: ${(entitlements.entitlements['consultations.platformFee'] as number) * 100}%`
                      : 'Upgrade to Pro or Agency to offer consultations'}
                  </p>
                </div>
              </div>
            </Card>

            {/* Payment Method */}
            <Card padding="lg" elevated className="rounded-lg">
              <h2 className="mb-4 text-xl font-bold text-text-primary">Payment Method</h2>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-bg-tertiary">
                  <CreditCard className="h-6 w-6 text-text-tertiary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-text-primary">Visa ending in 4242</p>
                  <p className="text-sm text-text-tertiary">Expires 12/2025</p>
                </div>
                <Button variant="outline" size="sm">Update</Button>
              </div>
            </Card>

            {/* Billing History */}
            <Card padding="lg" elevated className="rounded-lg">
              <h2 className="mb-4 text-xl font-bold text-text-primary">Billing History</h2>
              {invoices.length === 0 ? (
                <p className="text-sm text-text-tertiary">No invoices yet</p>
              ) : (
                <div className="space-y-1">
                  {invoices.map((invoice) => (
                    <div
                      key={invoice.id}
                      className="flex items-center justify-between rounded-lg border-b border-border-light py-4 transition-colors last:border-0 hover:bg-bg-secondary"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-bg-tertiary">
                          <FileText className="h-5 w-5 text-text-tertiary" />
                        </div>
                        <div>
                          <p className="font-medium text-text-primary">{invoice.date}</p>
                          <p className="text-sm text-text-tertiary">{invoice.status}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-semibold text-text-primary">฿{invoice.amount.toLocaleString()}</span>
                        <a
                          href={invoice.url}
                          className="rounded-md p-2 text-primary transition-colors hover:bg-primary/10 hover:text-primary-hover"
                        >
                          <Download className="h-5 w-5" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Plan Features */}
            <Card padding="lg" elevated className="rounded-lg">
              <h3 className="mb-4 text-lg font-bold text-text-primary">Your Plan Includes</h3>
              <ul className="space-y-3">
                {entitlements.planCode === 'FREE' && (
                  <>
                    <PlanFeature>Basic provider profile</PlanFeature>
                    <PlanFeature>Buy credits as needed</PlanFeature>
                    <PlanFeature>Up to 3 service packages</PlanFeature>
                    <PlanFeature>2MB file uploads</PlanFeature>
                  </>
                )}
                {entitlements.planCode === 'PRO' && (
                  <>
                    <PlanFeature>Offer consultations</PlanFeature>
                    <PlanFeature>10 free credits/month</PlanFeature>
                    <PlanFeature>Up to 12 service packages</PlanFeature>
                    <PlanFeature>25MB file uploads</PlanFeature>
                    <PlanFeature>2x search ranking</PlanFeature>
                    <PlanFeature>Analytics dashboard</PlanFeature>
                  </>
                )}
                {entitlements.planCode === 'AGENCY' && (
                  <>
                    <PlanFeature>Offer consultations (10% fee)</PlanFeature>
                    <PlanFeature>30 free credits/month</PlanFeature>
                    <PlanFeature>Unlimited service packages</PlanFeature>
                    <PlanFeature>100MB file uploads</PlanFeature>
                    <PlanFeature>5x search ranking</PlanFeature>
                    <PlanFeature>Advanced analytics</PlanFeature>
                    <PlanFeature>Team collaboration (5 members)</PlanFeature>
                  </>
                )}
              </ul>
            </Card>

            {/* Upgrade Prompt */}
            {entitlements.planCode !== 'AGENCY' && (
              <Card padding="lg" className="rounded-lg bg-gradient-to-br from-primary to-primary-hover text-white">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-white/20">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold">
                  {entitlements.planCode === 'FREE' ? 'Upgrade to Pro' : 'Upgrade to Agency'}
                </h3>
                <p className="mt-2 text-sm text-white/80">
                  {entitlements.planCode === 'FREE'
                    ? 'Unlock consultations, get 10 free credits monthly, and boost your visibility.'
                    : 'Get lower fees (10%), 30 free credits monthly, and team collaboration.'}
                </p>
                <button
                  onClick={() => router.push('/pricing')}
                  className="mt-4 inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-white px-6 font-medium text-primary transition-all hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white/50"
                >
                  View Plans <ArrowRight className="h-4 w-4" />
                </button>
              </Card>
            )}

            {/* Help Card */}
            <Card padding="lg" elevated className="rounded-lg">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-bg-tertiary">
                <HelpCircle className="h-6 w-6 text-text-tertiary" />
              </div>
              <h3 className="text-lg font-bold text-text-primary">Need Help?</h3>
              <p className="mt-2 text-sm text-text-secondary">
                Have questions about billing or your subscription?
              </p>
              <Button variant="outline" className="mt-4 w-full">Contact Support</Button>
            </Card>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}

// Plan feature item with checkmark
function PlanFeature({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-success" />
      <span className="text-sm text-text-secondary">{children}</span>
    </li>
  );
}
