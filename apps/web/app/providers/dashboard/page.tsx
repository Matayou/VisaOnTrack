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
       return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Unlocked</span>;
    }
    return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"><Unlock className="w-3 h-3 mr-1" /> Locked</span>;
  };

  return (
    <div className="min-h-screen bg-bg-secondary relative overflow-hidden">
      <ProviderHeader />
      <div className="relative z-10 max-w-6xl mx-auto space-y-6 p-6 lg:p-10">
        
        {/* Header & Credits Widget */}
        <header className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center bg-white border border-border-light rounded-xl p-6 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-text-primary mb-1">Provider Dashboard</h1>
            <p className="text-text-secondary text-sm">Manage leads, proposals, and active cases.</p>
          </div>
          
          <div className="flex items-center gap-4 bg-blue-50 px-4 py-3 rounded-lg border border-blue-100">
            <div className="text-right">
              <div className="text-xs uppercase text-blue-600 font-bold tracking-wider">Credit Balance</div>
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Main Feed: Marketplace Leads */}
            <section className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <Search className="w-5 h-5 text-text-tertiary" />
                  Recent Leads
                </h2>
                <Button variant="ghost" size="sm" onClick={() => router.push('/requests')}>View All</Button>
              </div>

              {error && (
                <div className="bg-red-50 text-red-800 p-4 rounded-lg border border-red-200 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  {error}
                </div>
              )}

              {requests.length === 0 && !error && (
                 <div className="bg-white p-8 text-center rounded-xl border border-gray-200 text-gray-500">
                   No open requests found at the moment.
                 </div>
              )}

              {requests.map((req) => (
                <div key={req.id} className="bg-white border border-border-light rounded-xl p-5 shadow-sm hover:border-primary/30 transition-all">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="flex gap-2 mb-2">
                        {req.visaType && <span className="text-xs font-semibold bg-gray-100 px-2 py-1 rounded text-gray-600">{req.visaType}</span>}
                        {/* Simulate urgency for now as it's not in DTO yet */}
                        {/* <span className="text-xs font-semibold bg-red-50 text-red-600 px-2 py-1 rounded">Urgent</span> */}
                      </div>
                      <h3 className="text-lg font-semibold text-text-primary mb-1">{req.title}</h3>
                      <p className="text-sm text-text-secondary line-clamp-2">{req.description}</p>
                    </div>
                    {getStatusBadge(req)}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-text-tertiary mb-4 border-t border-gray-50 pt-3">
                    {(req.budgetMin || req.budgetMax) && (
                         <div className="flex items-center gap-1"><Wallet className="w-4 h-4" /> 
                           {req.budgetMin && req.budgetMax ? `฿${req.budgetMin} - ฿${req.budgetMax}` : `฿${req.budgetMin}+`}
                         </div>
                    )}
                    {req.location && <div className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {req.location}</div>}
                    <div className="flex items-center gap-1 ml-auto"><Clock className="w-4 h-4" /> {new Date(req.createdAt).toLocaleDateString()}</div>
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
                          <Unlock className="w-4 h-4 mr-2" />
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
              <div className="bg-white border border-border-light rounded-xl p-5 shadow-sm">
                <h3 className="text-md font-bold mb-4 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-text-tertiary" />
                  Active Cases
                </h3>
                <div className="space-y-3">
                  {/* Placeholder for when cases are implemented */}
                  <div className="p-3 border border-dashed border-gray-200 rounded-lg text-center text-sm text-gray-400 py-6">
                    No active cases
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4" onClick={() => router.push('/cases')}>Open Case Manager</Button>
              </div>

              {/* Verification Status */}
              <div className="bg-gradient-to-br from-green-50 to-white border border-green-100 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-2">
                  <ShieldCheck className="w-6 h-6 text-green-600" />
                  <span className="font-bold text-green-800">Verified Partner</span>
                </div>
                <p className="text-xs text-green-700 mb-3">Your badge is active. You appear in search results.</p>
                <Button variant="ghost" size="sm" className="text-green-700 hover:bg-green-100 hover:text-green-900 p-0 h-auto">View Profile</Button>
              </div>

            </aside>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
