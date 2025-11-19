'use client';

import { useEffect, useMemo, useState, type SVGProps } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AlertCircle, ArrowLeft, ArrowRight, Calendar, Loader, MapPin, RefreshCw, Wallet } from 'lucide-react';
import { api, type Request, type RequestStatus } from '@visaontrack/client';

import { SeekerHeader } from '@/components/SeekerHeader';

const statusMeta: Record<
  RequestStatus,
  {
    label: string;
    badgeClass: string;
    description: string;
  }
> = {
  DRAFT: {
    label: 'Draft',
    badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
    description: 'This request is private. Publish it to invite providers to respond.',
  },
  OPEN: {
    label: 'Open',
    badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    description: 'Providers can see this brief and send offers.',
  },
  CLOSED: {
    label: 'Closed',
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
    description: 'This request is closed. Reopen or post another brief if you need more help.',
  },
  HIRED: {
    label: 'Hired',
    badgeClass: 'bg-primary/10 text-primary border-primary/40',
    description: 'You selected a provider for this request.',
  },
};

const currencyFormatter = new Intl.NumberFormat('th-TH', {
  style: 'currency',
  currency: 'THB',
  maximumFractionDigits: 0,
});

export default function RequestDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const requestId = Array.isArray(params?.id) ? params?.id[0] : params?.id;

  const [request, setRequest] = useState<Request | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!requestId) {
      setError('Request ID is missing.');
      setIsLoading(false);
      return;
    }

    const loadRequest = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await api.requests.getRequest({ id: requestId });
        setRequest(data);
      } catch (err: unknown) {
        const errorObj = err as { status?: number; body?: { message?: string } };
        if (errorObj?.status === 401) {
          router.replace('/auth/login');
          return;
        }
        if (errorObj?.status === 404) {
          setError('We could not find that request. It may have been removed or never existed.');
        } else {
          setError(errorObj?.body?.message ?? 'Unable to load this request right now. Please try again.');
        }
        console.error('[RequestDetailPage] load error', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadRequest();
  }, [requestId, router]);

  const descriptionBlocks = useMemo(() => {
    if (!request?.description) {
      return [];
    }
    return request.description.split(/\n{2,}/).map((block) => block.trim());
  }, [request]);

  const meta = request ? statusMeta[request.status] : null;
  const createdLabel = request
    ? new Intl.DateTimeFormat('en-GB', {
        dateStyle: 'long',
        timeStyle: 'short',
      }).format(new Date(request.createdAt))
    : '';

  const budgetLabel = useMemo(() => {
    if (!request) {
      return '—';
    }
    const { budgetMin, budgetMax } = request;
    if (budgetMin == null && budgetMax == null) {
      return 'Not provided';
    }
    if (budgetMin != null && budgetMax != null) {
      return `${currencyFormatter.format(budgetMin)} – ${currencyFormatter.format(budgetMax)}`;
    }
    if (budgetMin != null) {
      return `From ${currencyFormatter.format(budgetMin)}`;
    }
    return `Up to ${currencyFormatter.format(budgetMax as number)}`;
  }, [request]);

  return (
    <div className="min-h-screen bg-bg-secondary">
      <SeekerHeader />
      <div className="mx-auto w-full max-w-6xl px-6 py-8 lg:py-12">
        <div className="mb-6 flex flex-wrap items-center gap-3 text-sm text-text-secondary">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 rounded-base border border-border-light px-3 py-1.5 text-text-secondary hover:text-text-primary hover:border-border transition"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back
          </button>
          {request && (
            <span className="text-xs text-text-tertiary">Request ID: {request.id}</span>
          )}
        </div>

        {isLoading ? (
          <div className="rounded-base border border-border-light bg-bg-primary p-6 flex items-center gap-3 text-text-secondary">
            <Loader className="h-5 w-5 animate-spin" aria-hidden="true" />
            <span>Loading request...</span>
          </div>
        ) : null}

        {!isLoading && error ? (
          <div className="rounded-base border border-error/30 bg-bg-primary p-6 text-error">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5" aria-hidden="true" />
              <div className="space-y-3">
                <div>
                  <p className="text-base font-semibold text-text-primary">Something went wrong</p>
                  <p className="text-sm">{error}</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-base border border-border-light px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary hover:border-border transition"
                    onClick={() => router.push('/dashboard')}
                  >
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                    Return to dashboard
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-base bg-gradient-to-b from-primary to-primary-hover px-4 py-2 text-sm font-semibold text-white shadow-xs transition-all duration-200 hover:shadow-md hover:shadow-primary/15 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    onClick={() => router.push('/requests/new')}
                  >
                    Start new request
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {!isLoading && !error && request && meta ? (
          <div className="space-y-6">
            <section className="rounded-base border border-border-light bg-bg-primary p-6 shadow-sm">
              <div className="flex flex-wrap items-center gap-3">
                <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${meta.badgeClass}`}>
                  <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
                  {meta.label}
                </span>
                <span className="text-xs text-text-tertiary">
                  Created {createdLabel}
                </span>
              </div>
              <div className="mt-4 space-y-3">
                <h1 className="text-3xl font-semibold text-text-primary">{request.title}</h1>
                <p className="text-sm text-text-secondary">{meta.description}</p>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-base border border-border-light px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary hover:border-border transition"
                  onClick={() => router.push('/dashboard')}
                >
                  View all requests
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-base bg-gradient-to-b from-primary to-primary-hover px-5 py-2 text-sm font-semibold text-white shadow-xs transition-all duration-200 hover:shadow-md hover:shadow-primary/15 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  onClick={() => router.push('/requests/new')}
                >
                  Post another request
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </section>

            <section className="grid gap-4 md:grid-cols-3">
              <div className="rounded-base border border-border-light bg-bg-primary p-5">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-text-tertiary">
                  <FileIcon className="h-4 w-4" />
                  Visa plan
                </div>
                <p className="mt-2 text-lg font-semibold text-text-primary">
                  {request.visaType || 'Not specified'}
                </p>
                <p className="mt-1 text-sm text-text-secondary">
                  The seeker selected this as their target visa. Providers can suggest alternatives if needed.
                </p>
              </div>

              <div className="rounded-base border border-border-light bg-bg-primary p-5">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-text-tertiary">
                  <MapPin className="h-4 w-4" aria-hidden="true" />
                  Preferred location
                </div>
                <p className="mt-2 text-lg font-semibold text-text-primary">
                  {request.location || 'Not specified'}
                </p>
                <p className="mt-1 text-sm text-text-secondary">
                  Location helps providers tailor offers and highlight local compliance steps.
                </p>
              </div>

              <div className="rounded-base border border-border-light bg-bg-primary p-5">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-text-tertiary">
                  <Wallet className="h-4 w-4" aria-hidden="true" />
                  Budget range
                </div>
                <p className="mt-2 text-lg font-semibold text-text-primary">{budgetLabel}</p>
                <p className="mt-1 text-sm text-text-secondary">
                  Shared privately with vetted providers only.
                </p>
              </div>
            </section>

            <section className="grid gap-4 md:grid-cols-[2fr_1fr]">
              <article className="rounded-base border border-border-light bg-bg-primary p-6">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-text-tertiary">
                  Brief summary
                </div>
                <div className="mt-4 space-y-4 text-sm text-text-secondary">
                  {descriptionBlocks.length === 0 ? (
                    <p>No additional details were provided.</p>
                  ) : (
                    descriptionBlocks.map((block, index) => (
                      <p key={index} className="whitespace-pre-wrap leading-relaxed">
                        {block}
                      </p>
                    ))
                  )}
                </div>
              </article>

              <aside className="rounded-base border border-border-light bg-bg-primary p-6 space-y-4 text-sm text-text-secondary">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-text-tertiary">
                  Fast facts
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-text-tertiary">Status</p>
                    <p className="text-sm font-semibold text-text-primary">{meta.label}</p>
                  </div>
                  <div>
                    <p className="text-xs text-text-tertiary">Created</p>
                    <p className="text-sm font-semibold text-text-primary">{createdLabel}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-text-tertiary" aria-hidden="true" />
                    <span>This brief updates automatically as providers respond.</span>
                  </div>
                </div>
              </aside>
            </section>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function FileIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <path d="M7 3h6l4 4v14H7z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13 3v5h5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

