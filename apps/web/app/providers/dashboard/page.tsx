'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  AlertCircle,
  ArrowRight,
  Briefcase,
  Clock,
  MapPin,
  Search,
  ShieldCheck,
  Unlock,
  Wallet,
  CheckCircle2,
} from 'lucide-react';
import { ProviderHeader } from '@/components/ProviderHeader';
import { Footer } from '@/components/ui';
import { Button, Spinner } from '@/components/ui';
import { api, type Request } from '@visaontrack/client';
import { LOADING_GENERIC } from '@/lib/loading-messages';
import { getErrorDisplayMessage } from '@/lib/error-handling';

// Extends the Request type with the added unlockStatus
interface ProviderRequest extends Request {
  unlockStatus?: 'LOCKED' | 'UNLOCKED';
}

export default function ProviderDashboardPage() {
  const router = useRouter();
  const [credits, setCredits] = useState<number>(0);
  const [requests, setRequests] = useState<ProviderRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUnlocking, setIsUnlocking] = useState<string | null>(null); // requestId being unlocked
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Parallel fetch for credits and requests
        const [creditsRes, requestsRes] = await Promise.all([
          api.credits.getBalance(),
          api.requests.listRequests({ status: 'OPEN' as any }), // Fetch OPEN requests
        ]);

        setCredits(creditsRes.credits);
        setRequests(requestsRes.data as ProviderRequest[]); // Type assertion due to manual DTO update
      } catch (err: unknown) {
        const errorObj = err as { status?: number };
        if (errorObj?.status === 401) {
          router.replace('/auth/login');
          return;
        }
        setError(getErrorDisplayMessage(err, 'load dashboard data'));
        console.error('[ProviderDashboard] load error', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleUnlock = async (requestId: string) => {
    if (credits < 1) {
      alert('Insufficient credits. Please top up.'); // Replace with toast/modal later
      return;
    }

    setIsUnlocking(requestId);
    try {
      const result = await api.requests.unlockRequest({ id: requestId });
      
      // Update local state
      setCredits(result.remainingCredits);
      setRequests((prev) =>
        prev.map((req) =>
          req.id === requestId ? { ...req, unlockStatus: 'UNLOCKED' } : req
        )
      );
      
      // Optional: Show success message
    } catch (err) {
      console.error('Unlock failed', err);
      alert(getErrorDisplayMessage(err, 'unlock request'));
    } finally {
      setIsUnlocking(null);
    }
  };

  const getStatusBadge = (req: ProviderRequest) => {
    // If provider has unlocked it, show "Unlocked" or "Proposal Sent" status
    // For MVP, just distinguishing Locked vs Unlocked
    if (req.unlockStatus === 'UNLOCKED') {
       return <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">Unlocked</span>;
    }
    return <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800"><Unlock className="mr-1 h-3 w-3" /> Locked</span>;
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-bg-secondary">
      <ProviderHeader />
      <div className="relative z-10 mx-auto max-w-6xl space-y-6 p-6 lg:p-10">
        
        {/* Header & Credits Widget */}
        <header className="flex flex-col items-start justify-between gap-6 rounded-xl border border-border-light bg-white p-6 shadow-sm md:flex-row md:items-center">
          <div>
            <h1 className="mb-1 text-2xl font-bold text-text-primary">Provider Dashboard</h1>
            <p className="text-sm text-text-secondary">Manage leads, proposals, and active cases.</p>
          </div>
          
          <div className="flex items-center gap-4 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3">
            <div className="text-right">
              <div className="text-xs font-bold uppercase tracking-wider text-blue-600">Credit Balance</div>
              <div className="text-2xl font-bold text-blue-900">{credits} <span className="text-sm font-normal text-blue-600">credits</span></div>
            </div>
            <Button size="sm" onClick={() => router.push('/billing/credits')}>Top Up</Button>
          </div>
        </header>

        {isLoading ? (
           <div className="flex justify-center p-12">
             <Spinner size="lg" />
           </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            
            {/* Main Feed: Marketplace Leads */}
            <section className="space-y-4 lg:col-span-2">
              <div className="flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-lg font-bold">
                  <Search className="h-5 w-5 text-text-tertiary" />
                  Recent Leads
                </h2>
                <Button variant="ghost" size="sm" onClick={() => router.push('/requests')}>View All</Button>
              </div>

              {error && (
                <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
                  <AlertCircle className="h-5 w-5" />
                  {error}
                </div>
              )}

              {requests.length === 0 && !error && (
                 <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-gray-500">
                   No open requests found at the moment.
                 </div>
              )}

              {requests.map((req) => (
                <div key={req.id} className="hover:border-primary/30 rounded-xl border border-border-light bg-white p-5 shadow-sm transition-all">
                  <div className="mb-3 flex items-start justify-between">
                    <div>
                      <div className="mb-2 flex gap-2">
                        {req.visaType && <span className="rounded bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-600">{req.visaType}</span>}
                        {/* Simulate urgency for now as it's not in DTO yet */}
                        {/* <span className="text-xs font-semibold bg-red-50 text-red-600 px-2 py-1 rounded">Urgent</span> */}
                      </div>
                      <h3 className="mb-1 text-lg font-semibold text-text-primary">{req.title}</h3>
                      <p className="line-clamp-2 text-sm text-text-secondary">{req.description}</p>
                    </div>
                    {getStatusBadge(req)}
                  </div>

                  <div className="mb-4 flex items-center gap-4 border-t border-gray-50 pt-3 text-sm text-text-tertiary">
                    {(req.budgetMin || req.budgetMax) && (
                         <div className="flex items-center gap-1"><Wallet className="h-4 w-4" /> 
                           {req.budgetMin && req.budgetMax ? `฿${req.budgetMin} - ฿${req.budgetMax}` : `฿${req.budgetMin}+`}
                         </div>
                    )}
                    {req.location && <div className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {req.location}</div>}
                    <div className="ml-auto flex items-center gap-1"><Clock className="h-4 w-4" /> {new Date(req.createdAt).toLocaleDateString()}</div>
                  </div>

                  <div className="flex justify-end gap-2">
                    {req.unlockStatus !== 'UNLOCKED' ? (
                      <Button 
                        size="sm" 
                        onClick={() => handleUnlock(req.id)}
                        disabled={isUnlocking === req.id || credits < 1}
                      >
                        {isUnlocking === req.id ? (
                          <Spinner size="sm" className="mr-2" />
                        ) : (
                          <Unlock className="mr-2 h-4 w-4" />
                        )}
                        Unlock (1 Credit)
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline" onClick={() => router.push(`/requests/${req.id}`)}>
                        Manage Proposal
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </section>

            {/* Sidebar: Active Cases & Tools */}
            <aside className="space-y-6">
              
              {/* Active Cases Widget (Still Mock Data for now as Case API not wired yet) */}
              <div className="rounded-xl border border-border-light bg-white p-5 shadow-sm">
                <h3 className="mb-4 flex items-center gap-2 text-md font-bold">
                  <Briefcase className="h-5 w-5 text-text-tertiary" />
                  Active Cases
                </h3>
                <div className="space-y-3">
                  {/* Placeholder for when cases are implemented */}
                  <div className="rounded-lg border border-dashed border-gray-200 p-3 py-6 text-center text-sm text-gray-400">
                    No active cases
                  </div>
                </div>
                <Button variant="outline" className="mt-4 w-full" onClick={() => router.push('/cases')}>Open Case Manager</Button>
              </div>

              {/* Verification Status */}
              <div className="rounded-xl border border-green-100 bg-gradient-to-br from-green-50 to-white p-5">
                <div className="mb-2 flex items-center gap-3">
                  <ShieldCheck className="h-6 w-6 text-green-600" />
                  <span className="font-bold text-green-800">Verified Partner</span>
                </div>
                <p className="mb-3 text-xs text-green-700">Your badge is active. You appear in search results.</p>
                <Button variant="ghost" size="sm" className="h-auto p-0 text-green-700 hover:bg-green-100 hover:text-green-900">View Profile</Button>
              </div>

            </aside>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
