'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  ChevronRight,
  Clock,
  CreditCard,
  MapPin,
  MessageSquare,
  Plus,
  Search,
  ShieldCheck,
  TrendingUp,
  Unlock,
  Wallet,
  Zap,
} from 'lucide-react';
import { ProviderHeader } from '@/components/ProviderHeader';
import { Footer } from '@/components/ui';
import { Button, Spinner, Card } from '@/components/ui';
import { api, type Request } from '@visaontrack/client';
import { getErrorDisplayMessage } from '@/lib/error-handling';
import { FeatureGate } from '@/components/FeatureGate';

interface ProviderRequest extends Request {
  unlockStatus?: 'LOCKED' | 'UNLOCKED';
}

export default function ProviderDashboardPage() {
  const router = useRouter();
  const [credits, setCredits] = useState<number>(0);
  const [requests, setRequests] = useState<ProviderRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUnlocking, setIsUnlocking] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Mock stats (would come from API)
  const stats = {
    activeProposals: 3,
    unreadMessages: 2,
    leadsThisMonth: 12,
    wonThisMonth: 2,
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [creditsRes, requestsRes] = await Promise.all([
          api.credits.getBalance(),
          api.requests.listRequests({ status: 'OPEN' as any }),
        ]);
        setCredits(creditsRes.credits);
        setRequests(requestsRes.data as ProviderRequest[]);
      } catch (err: unknown) {
        const errorObj = err as { status?: number };
        if (errorObj?.status === 401) {
          router.replace('/auth/login');
          return;
        }
        setError(getErrorDisplayMessage(err, 'load dashboard data'));
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [router]);

  const handleUnlock = async (requestId: string) => {
    if (credits < 1) {
      alert('Insufficient credits. Please top up.');
      return;
    }
    setIsUnlocking(requestId);
    try {
      const result = await api.requests.unlockRequest({ id: requestId });
      setCredits(result.remainingCredits);
      setRequests((prev) =>
        prev.map((req) =>
          req.id === requestId ? { ...req, unlockStatus: 'UNLOCKED' } : req
        )
      );
    } catch (err) {
      alert(getErrorDisplayMessage(err, 'unlock request'));
    } finally {
      setIsUnlocking(null);
    }
  };

  const formatDate = (value: string) =>
    new Intl.DateTimeFormat('en', { day: 'numeric', month: 'short' }).format(new Date(value));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-secondary">
        <ProviderHeader />
        <div className="flex items-center justify-center py-32">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-bg-secondary">
      <ProviderHeader />

      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-4 sm:px-8 lg:py-6">
        {/* Compact Header with Inline Stats */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-bold text-text-primary lg:text-2xl">Dashboard</h1>
            <p className="text-sm text-text-secondary">
              {requests.length} leads available
            </p>
          </div>
          
          {/* Inline Stats Bar */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => router.push('/billing/credits')}
              className="flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-primary/15"
            >
              <Wallet className="h-4 w-4" />
              <span>{credits} credits</span>
              <Plus className="h-3.5 w-3.5" />
            </button>
            
            {stats.unreadMessages > 0 && (
              <button
                onClick={() => router.push('/messages')}
                className="flex items-center gap-1.5 rounded-full bg-warning/10 px-3 py-1.5 text-sm font-medium text-warning transition-colors hover:bg-warning/15"
              >
                <MessageSquare className="h-4 w-4" />
                <span>{stats.unreadMessages}</span>
              </button>
            )}
            
            <button
              onClick={() => router.push('/quotes')}
              className="flex items-center gap-1.5 rounded-full bg-bg-tertiary px-3 py-1.5 text-sm font-medium text-text-secondary transition-colors hover:bg-border-light"
            >
              {stats.activeProposals} active
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid gap-4 lg:grid-cols-3 lg:gap-6">
          {/* Leads Column */}
          <div className="lg:col-span-2">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-text-primary">
                <Zap className="h-4 w-4 text-warning" />
                Recent Leads
              </h2>
              <button
                onClick={() => router.push('/providers/marketplace')}
                className="flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary-hover"
              >
                Browse all
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            {error && (
              <Card variant="muted" padding="sm" className="mb-3 border-error/20 bg-error-light">
                <p className="text-sm text-error">{error}</p>
              </Card>
            )}

            {requests.length === 0 && !error ? (
              <Card padding="lg" className="text-center">
                <Search className="mx-auto mb-3 h-8 w-8 text-text-tertiary" />
                <h3 className="font-semibold text-text-primary">No leads available</h3>
                <p className="mx-auto mt-1 max-w-xs text-sm text-text-secondary">
                  New visa requests will appear here.
                </p>
                <Button
                  size="sm"
                  className="mt-4"
                  onClick={() => router.push('/providers/marketplace')}
                >
                  Browse Marketplace
                </Button>
              </Card>
            ) : (
              <div className="space-y-2">
                {requests.slice(0, 6).map((req) => (
                  <Card
                    key={req.id}
                    padding="sm"
                    className="transition-all hover:shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex flex-wrap items-center gap-2">
                          {req.visaType && (
                            <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                              {req.visaType}
                            </span>
                          )}
                          <span className="text-xs text-text-tertiary">
                            {formatDate(req.createdAt)}
                          </span>
                          {req.unlockStatus === 'UNLOCKED' ? (
                            <span className="rounded bg-success/10 px-1.5 py-0.5 text-xs font-medium text-success">
                              Unlocked
                            </span>
                          ) : (
                            <span className="flex items-center gap-0.5 text-xs text-text-tertiary">
                              <Unlock className="h-3 w-3" /> Locked
                            </span>
                          )}
                        </div>
                        <h3 className="text-sm font-medium text-text-primary line-clamp-1">
                          {req.title}
                        </h3>
                        <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-text-tertiary">
                          {(req.budgetMin || req.budgetMax) && (
                            <span className="flex items-center gap-1">
                              <Wallet className="h-3 w-3" />
                              ฿{((req.budgetMin || req.budgetMax) ?? 0).toLocaleString()}
                              {req.budgetMax && req.budgetMin && '+'}
                            </span>
                          )}
                          {req.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {req.location}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex-shrink-0">
                        {req.unlockStatus !== 'UNLOCKED' ? (
                          <Button
                            size="sm"
                            className="h-8 text-xs"
                            onClick={() => handleUnlock(req.id)}
                            disabled={isUnlocking === req.id || credits < 1}
                          >
                            {isUnlocking === req.id ? (
                              <Spinner size="xs" color="white" />
                            ) : (
                              'Unlock'
                            )}
                          </Button>
                        ) : (
                          <div className="flex gap-2">
                            <FeatureGate
                              feature="messaging.enabled"
                              fallback={
                                <button
                                  onClick={() => router.push('/pricing')}
                                  className="flex h-8 items-center gap-1 rounded-lg border border-amber-300 bg-amber-50 px-2 text-xs font-medium text-amber-800 hover:bg-amber-100"
                                  title="Upgrade to PRO to message clients"
                                >
                                  <MessageSquare className="h-3 w-3" />
                                  PRO
                                </button>
                              }
                            >
                              <button
                                onClick={() => router.push(`/requests/${req.id}/thread`)}
                                className="flex h-8 items-center gap-1 rounded-lg bg-primary px-2 text-xs font-medium text-white hover:bg-primary-hover"
                              >
                                <MessageSquare className="h-3 w-3" />
                                Message
                              </button>
                            </FeatureGate>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 text-xs"
                              onClick={() => router.push(`/requests/${req.id}`)}
                            >
                              View
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar - More Compact */}
          <aside className="space-y-4">
            {/* Quick Stats */}
            <Card padding="sm">
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-tertiary">
                This Month
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-md bg-bg-secondary p-2 text-center">
                  <span className="block text-lg font-bold text-text-primary">{stats.leadsThisMonth}</span>
                  <span className="text-[10px] uppercase text-text-tertiary">Unlocked</span>
                </div>
                <div className="rounded-md bg-bg-secondary p-2 text-center">
                  <span className="block text-lg font-bold text-text-primary">{stats.wonThisMonth}</span>
                  <span className="text-[10px] uppercase text-text-tertiary">Won</span>
                </div>
              </div>
            </Card>

            {/* Verification Badge */}
            <Card padding="sm" className="border-success/20 bg-success-light/30">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-success" />
                <div>
                  <p className="text-sm font-semibold text-success">Verified</p>
                  <p className="text-xs text-success/80">Profile active</p>
                </div>
              </div>
            </Card>

            {/* Upgrade CTA - Compact */}
            <Card padding="sm" className="bg-gradient-to-br from-primary to-primary-hover text-white">
              <div className="flex items-start gap-3">
                <TrendingUp className="h-5 w-5 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-sm font-semibold">Upgrade to Pro</h3>
                  <p className="mt-0.5 text-xs text-white/80">
                    10 free credits/mo + 2x visibility
                  </p>
                  <button
                    onClick={() => router.push('/pricing')}
                    className="mt-2 inline-flex h-7 items-center justify-center rounded-md bg-white px-3 text-xs font-medium text-primary transition-all hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white/50"
                  >
                    View Plans
                  </button>
                </div>
              </div>
            </Card>

            {/* Quick Links */}
            <div className="space-y-1">
              <button
                onClick={() => router.push('/providers/profile/manage')}
                className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm text-text-secondary transition-colors hover:bg-bg-tertiary"
              >
                Edit Profile
                <ChevronRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => router.push('/account/billing')}
                className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm text-text-secondary transition-colors hover:bg-bg-tertiary"
              >
                Billing & Credits
                <ChevronRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => router.push('/help')}
                className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm text-text-secondary transition-colors hover:bg-bg-tertiary"
              >
                Help Center
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
