'use client';

import { useEffect, useState, useRef, Suspense, useMemo } from 'react';
import {
  AlertCircle,
  ArrowRight,
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  FileText,
  Globe,
  MapPin,
  MessageSquare,
  MoreVertical,
  PlusCircle,
  User,
  Wallet,
  Briefcase,
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { api, type Request, type RequestStatus } from '@visaontrack/client';
import { Button, Spinner, PageBackground, GradientText, Footer } from '@/components/ui';
import { LOADING_GENERIC } from '@/lib/loading-messages';
import { getErrorDisplayMessage } from '@/lib/error-handling';
import { SeekerHeader } from '@/components/SeekerHeader';
import { estimateBudgetFromSavings, mapDurationToTimeline, mapLocation, mapEligibilityCodeToVisaType, mapAgeRange } from '@/lib/eligibilityMapping';

const statusLabels: Record<RequestStatus, string> = {
  DRAFT: 'Draft',
  OPEN: 'Active',
  CLOSED: 'Closed',
  HIRED: 'Hired',
};

const statusStyles: Record<RequestStatus, string> = {
  DRAFT: 'bg-amber-50 text-amber-800 ring-amber-600/10',
  OPEN: 'bg-emerald-50 text-emerald-800 ring-emerald-600/10',
  CLOSED: 'bg-gray-100 text-gray-700 ring-gray-400/20',
  HIRED: 'bg-blue-50 text-blue-800 ring-blue-600/10',
};

const statusBorderColors: Record<RequestStatus, string> = {
  DRAFT: 'border-l-amber-400',
  OPEN: 'border-l-emerald-500',
  CLOSED: 'border-l-gray-400',
  HIRED: 'border-l-blue-500',
};
const statusChipBase = 'inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg ring-1 ring-inset';

// Key for localStorage persistence (MUST match GetStartedPage)
const INTAKE_DATA_KEY = 'vot_intake_data';

// Helper function to format budget range
const formatBudget = (min: number | null | undefined, max: number | null | undefined): string | null => {
  if (min == null && max == null) return null;
  if (min != null && max != null) {
    return `฿${min.toLocaleString('en-US')} - ฿${max.toLocaleString('en-US')}`;
  }
  if (min != null) {
    return `From ฿${min.toLocaleString('en-US')}`;
  }
  return `Up to ฿${max!.toLocaleString('en-US')}`;
};

// Helper function to format relative date
const formatRelativeDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7);
    return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
  }
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined });
};

type FAQItem = {
  question: string;
  answer: string;
};

type FAQCategory = {
  id: string;
  label: string;
  items: FAQItem[];
};

const faqData: FAQCategory[] = [
  {
    id: 'basics',
    label: 'Basics',
    items: [
      {
        question: 'How do I post a request?',
        answer:
          'Click "Start new request" to create a new visa request. Fill in your visa type, budget, location, and description. You can save it as a draft or publish it immediately to receive offers from providers.',
      },
      {
        question: 'How do offers work?',
        answer:
          'Once you publish a request, verified providers can submit offers with pricing, deliverables, and timelines. You\'ll receive notifications when offers are submitted. Review and compare offers to choose the best provider for your needs.',
      },
      {
        question: 'What happens after I receive offers?',
        answer:
          'You can review all offers on your request detail page. Compare providers, their pricing, experience, and reviews. When ready, accept an offer to create an order and start working with the provider.',
      },
      {
        question: 'How do I choose a provider?',
        answer:
          'Consider factors like pricing, estimated timeline, provider experience, languages spoken, and reviews from other seekers. You can also message providers directly to ask questions before accepting an offer.',
      },
      {
        question: 'What is the payment process?',
        answer:
          'Payments are handled securely through our escrow system. Funds are held until work milestones are completed. You release payment only when you\'re satisfied with the completed work. This protects both you and the provider.',
      },
      {
        question: 'How do I track my order progress?',
        answer:
          'Once you accept an offer, an order is created. You can track progress through milestones, view uploaded documents, communicate with your provider, and see real-time updates on your order detail page.',
      },
    ],
  },
  {
    id: 'troubleshooting',
    label: 'Troubleshooting',
    items: [
      {
        question: 'Why can\'t I see my request?',
        answer:
          'If your request is saved as a draft, it won\'t be visible to providers. Publish your request to make it visible. If it\'s published but you still can\'t see it, check that the status is "Active" and refresh the page.',
      },
      {
        question: 'I\'m not receiving offers - what should I do?',
        answer:
          'Make sure your request is published (status should be "Active"). Provide detailed information about your visa needs, budget, and timeline. The more specific you are, the more likely providers will respond. You can also edit your request to add more details.',
      },
      {
        question: 'How do I update my request?',
        answer:
          'Go to your request detail page and click "Edit" if the request is still in draft or active status. You can update the description, budget, visa type, or any other details. Changes will be visible to providers immediately.',
      },
      {
        question: 'Can I cancel or close my request?',
        answer:
          'Yes, you can close your request at any time from the request detail page. If you have an active order, you may need to complete or cancel the order first. Closed requests won\'t receive new offers but you can still view past offers and messages.',
      },
      {
        question: 'How do I contact a provider?',
        answer:
          'You can message providers directly through the request detail page. Click on an offer to view provider details and send a message. All communication happens within the platform for security and record-keeping.',
      },
      {
        question: 'What if I have issues with an order?',
        answer:
          'If you encounter any issues with an order, first try communicating directly with your provider through the order messages. If the issue persists, you can contact our support team. Our escrow system protects your payment until you\'re satisfied.',
      },
    ],
  },
];

type StatusFilter = 'ALL' | RequestStatus;

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isLoadingRequests, setIsLoadingRequests] = useState(false);
  const [isProcessingIntake, setIsProcessingIntake] = useState(false);
  const [requests, setRequests] = useState<Request[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('basics');
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const autoCreateAttemptedRef = useRef(false);

  // Calculate metrics
  const metrics = useMemo(() => {
    const total = requests.length;
    const active = requests.filter(r => r.status === 'OPEN').length;
    const draft = requests.filter(r => r.status === 'DRAFT').length;
    const hired = requests.filter(r => r.status === 'HIRED').length;
    const proposals = 0; // TODO: Calculate from proposals data when available

    return { total, active, draft, hired, proposals };
  }, [requests]);

  // Filter requests based on status
  const filteredRequests = useMemo(() => {
    if (statusFilter === 'ALL') return requests;
    return requests.filter(r => r.status === statusFilter);
  }, [requests, statusFilter]);

  useEffect(() => {
    const run = async () => {
      try {
        const user = await api.users.getCurrentUser();
        if (user.role === 'PROVIDER' || user.role === 'ADMIN') {
          router.replace('/providers/dashboard');
          return;
        }
        setIsLoadingUser(false);
        setIsLoadingRequests(true);

        // Check for intake data saved from public flow (or legacy query param)
        const intakeDataJson = typeof window !== 'undefined' ? localStorage.getItem(INTAKE_DATA_KEY) : null;
        const hasIntakeData = Boolean(intakeDataJson);
        const legacyAutoCreateParam = searchParams.get('autoCreate') === 'true';
        const shouldAutoCreate = !autoCreateAttemptedRef.current && (hasIntakeData || legacyAutoCreateParam);

        if (shouldAutoCreate && intakeDataJson) {
          autoCreateAttemptedRef.current = true;
          setIsProcessingIntake(true);
          try {
            const intakeData = JSON.parse(intakeDataJson);
            
            // Convert intake data to request payload
            const budget = estimateBudgetFromSavings(intakeData.savings);
            const locationLabel = intakeData.location === 'Inside Thailand' ? 'Inside Thailand' : 'Outside Thailand';
            
            const requestPayload = {
              title: `Visa application for ${mapEligibilityCodeToVisaType(intakeData.selectedCode)}`,
              description: intakeData.fields?.join(', ') || 'None', // Use simpler description
              visaType: mapEligibilityCodeToVisaType(intakeData.selectedCode),
              budgetMin: budget.min,
              budgetMax: budget.max,
              location: locationLabel,
              intakeData: intakeData,
            };

            // Create the request
            const newRequest = await api.requests.createRequest({
              requestBody: requestPayload,
            });

            // Clear intake data so we don't re-create
            localStorage.removeItem(INTAKE_DATA_KEY);
            
            // Redirect to the new request
            router.push(`/requests/${newRequest.id}`);
            return;
          } catch (createErr) {
            console.error('[SeekerDashboard] Auto-create request error:', createErr);
            // Fallback to normal load if creation fails
            setError('Failed to create your request automatically. Please try creating it manually.');
          } finally {
            setIsProcessingIntake(false);
          }
        } else if (shouldAutoCreate && !intakeDataJson) {
          // Avoid retry loops if query param exists but no saved data
          autoCreateAttemptedRef.current = true;
        }

        const response = await api.requests.listRequests({ page: 1, limit: 5, seekerId: user.id });
        setRequests(response.data ?? []);
      } catch (err: unknown) {
        const errorObj = err as { status?: number };
        if (errorObj?.status === 401) {
          router.replace('/auth/login');
          return;
        }
        setError(getErrorDisplayMessage(err, 'load your account'));
        console.error('[SeekerDashboard] load error', err);
      } finally {
        setIsLoadingRequests(false);
      }
    };

    run();
  }, [router, searchParams]);

  const showEmptyState = !requests.length && !isLoadingRequests && !error && !isProcessingIntake;
  const showFilteredEmptyState = filteredRequests.length === 0 && requests.length > 0;

  const toggleQuestion = (questionId: string) => {
    setExpandedQuestions((prev) => {
      const next = new Set(prev);
      if (next.has(questionId)) {
        next.delete(questionId);
      } else {
        next.add(questionId);
      }
      return next;
    });
  };

  const activeCategory = faqData.find((cat) => cat.id === activeTab) || faqData[0];

  if (isProcessingIntake) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="space-y-4 text-center">
          <Spinner size="lg" />
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Setting up your workspace</h2>
            <p className="mt-1 text-gray-600">Creating your request from your answers...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gray-50">
      <PageBackground />
      <SeekerHeader />
      <div className="relative z-10 mx-auto w-full max-w-7xl space-y-6 px-6 py-6 sm:px-8 lg:py-10">
        {/* Header with Metrics */}
        <header className="ios-card relative overflow-hidden px-6 py-6">
          <div className="pointer-events-none absolute right-0 top-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-gradient-to-br from-indigo-50/40 to-transparent"></div>
          <div className="relative">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="mb-1 text-xs font-bold uppercase tracking-wider text-gray-400">Your Requests</p>
                <h1 className="text-2xl font-bold text-gray-900 lg:text-3xl">
                  Manage your visa requests
                </h1>
              </div>
              <Button
                type="button"
                onClick={() => router.push('/requests/new')}
                icon={<PlusCircle className="h-4 w-4" />}
                iconPosition="left"
                className="hidden sm:inline-flex"
              >
                Start new request
              </Button>
            </div>

            {/* Mobile CTA */}
            <div className="sm:hidden">
              <Button
                type="button"
                onClick={() => router.push('/requests/new')}
                icon={<PlusCircle className="h-4 w-4" />}
                iconPosition="left"
                className="w-full"
              >
                Start new request
              </Button>
            </div>
          </div>
        </header>

        {/* Status Filter Tabs - Compact pill row */}
        {!isLoadingRequests && requests.length > 0 && (
          <div className="ios-card px-4 py-3 sm:px-6">
            <div className="no-scrollbar flex gap-2 overflow-x-auto sm:gap-3">
              <button
                type="button"
                onClick={() => setStatusFilter('ALL')}
                className={`inline-flex items-center gap-2 whitespace-nowrap rounded-lg border px-3.5 py-2 text-sm font-semibold transition-all ${
                  statusFilter === 'ALL'
                    ? 'bg-primary/10 border-primary/20 text-primary shadow-sm'
                    : 'border-transparent bg-white text-gray-600 hover:border-gray-200'
                }`}
              >
                All
                {requests.length > 0 && <span className="text-xs font-semibold text-gray-500">({requests.length})</span>}
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('OPEN')}
                className={`inline-flex items-center gap-2 whitespace-nowrap rounded-lg border px-3.5 py-2 text-sm font-semibold transition-all ${
                  statusFilter === 'OPEN'
                    ? 'bg-primary/10 border-primary/20 text-primary shadow-sm'
                    : 'border-transparent bg-white text-gray-600 hover:border-gray-200'
                }`}
              >
                Active
                {metrics.active > 0 && <span className="text-xs font-semibold text-gray-500">({metrics.active})</span>}
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('DRAFT')}
                className={`inline-flex items-center gap-2 whitespace-nowrap rounded-lg border px-3.5 py-2 text-sm font-semibold transition-all ${
                  statusFilter === 'DRAFT'
                    ? 'bg-primary/10 border-primary/20 text-primary shadow-sm'
                    : 'border-transparent bg-white text-gray-600 hover:border-gray-200'
                }`}
              >
                Draft
                {metrics.draft > 0 && <span className="text-xs font-semibold text-gray-500">({metrics.draft})</span>}
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('HIRED')}
                className={`inline-flex items-center gap-2 whitespace-nowrap rounded-lg border px-3.5 py-2 text-sm font-semibold transition-all ${
                  statusFilter === 'HIRED'
                    ? 'bg-primary/10 border-primary/20 text-primary shadow-sm'
                    : 'border-transparent bg-white text-gray-600 hover:border-gray-200'
                }`}
              >
                Hired
                {metrics.hired > 0 && <span className="text-xs font-semibold text-gray-500">({metrics.hired})</span>}
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('CLOSED')}
                className={`inline-flex items-center gap-2 whitespace-nowrap rounded-lg border px-3.5 py-2 text-sm font-semibold transition-all ${
                  statusFilter === 'CLOSED'
                    ? 'bg-primary/10 border-primary/20 text-primary shadow-sm'
                    : 'border-transparent bg-white text-gray-600 hover:border-gray-200'
                }`}
              >
                Completed
              </button>
            </div>
          </div>
        )}

        {isLoadingUser || isLoadingRequests ? (
          <div className="ios-card flex items-center gap-3 p-6 text-gray-600">
            <Spinner size="sm" />
            <span>{LOADING_GENERIC}</span>
          </div>
        ) : null}

        {showEmptyState && (
          <div className="relative overflow-hidden rounded-2xl border border-gray-200/60 bg-gradient-to-br from-indigo-50/30 via-white to-blue-50/30 px-4 py-12 text-center sm:py-16">
            <div className="from-primary/5 pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr to-transparent blur-3xl"></div>
            <div className="relative z-10 mx-auto max-w-md">
              <div className="bg-primary/10 ring-primary/5 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl ring-4 sm:mb-6 sm:h-20 sm:w-20">
                <FileText className="h-8 w-8 text-primary sm:h-10 sm:w-10" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-900 sm:mb-3 sm:text-2xl">Ready to start your visa journey?</h3>
              <p className="mb-4 text-sm leading-relaxed text-gray-600 sm:mb-2 sm:text-base">
                Create your first visa request to connect with verified providers.
                They'll review your requirements and send personalized proposals.
              </p>
              <div className="mb-6 flex flex-col items-center justify-center gap-2 pt-2 text-xs text-gray-500 sm:mb-8 sm:flex-row sm:gap-6 sm:text-sm">
                <span className="flex items-center gap-1.5">
                  <Check className="h-4 w-4 flex-shrink-0 text-emerald-500" />
                  Free to post
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="h-4 w-4 flex-shrink-0 text-emerald-500" />
                  Multiple quotes
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="h-4 w-4 flex-shrink-0 text-emerald-500" />
                  Secure payments
                </span>
              </div>
              <div className="flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center sm:gap-4">
                <Button
                  type="button"
                  size="lg"
                  onClick={() => router.push('/requests/new')}
                  icon={<PlusCircle className="h-5 w-5" />}
                  iconPosition="left"
                  className="w-full sm:w-auto"
                >
                  Start new request
                </Button>
                <button
                  onClick={() => router.push('/providers')}
                  className="hover:border-primary/30 w-full rounded-xl border border-gray-200 bg-white px-6 py-3 text-base font-semibold text-gray-700 shadow-sm transition-all hover:text-primary hover:shadow sm:w-auto"
                >
                  Browse providers
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Filtered Empty State */}
        {showFilteredEmptyState && (
          <div className="ios-card py-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-50">
              <FileText className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="mb-2 font-semibold text-gray-900">No {statusFilter.toLowerCase()} requests</h3>
            <p className="mb-4 text-sm text-gray-500">
              Try selecting a different filter to view other requests
            </p>
            <button
              type="button"
              onClick={() => setStatusFilter('ALL')}
              className="hover:text-primary/80 text-sm font-medium text-primary underline"
            >
              View all requests
            </button>
          </div>
        )}

        {error && (
          <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">
            <AlertCircle className="h-5 w-5" aria-hidden="true" />
            <div className="flex-1">
              <p className="text-sm font-semibold">We couldn&apos;t load your requests</p>
              <p className="text-sm">{error}</p>
              <button
                type="button"
                className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-red-600 underline hover:text-red-700"
                onClick={() => router.refresh()}
              >
                Try again
              </button>
            </div>
          </div>
        )}

        {/* Request Cards */}
        {!showEmptyState && !showFilteredEmptyState && filteredRequests.length > 0 && (
          <div className="space-y-4">
            {filteredRequests.map((request) => {
              const budgetText = formatBudget(request.budgetMin, request.budgetMax);
              const dateText = formatRelativeDate(request.createdAt);
              const intakeData = request.intakeData as any;

              // Extract rich data from intakeData if available
              const nationality = intakeData?.nationality || 'Not specified';
              const ageRange = intakeData?.ageRange || mapAgeRange(intakeData?.fields) || 'Not specified';
              const purpose = intakeData?.purpose || 'Not specified';

              return (
                <article
                  key={request.id}
                  className="cursor-pointer rounded-lg border border-gray-200 bg-white p-5 transition-shadow hover:shadow-md"
                  onClick={() => router.push(`/requests/${request.id}`)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      router.push(`/requests/${request.id}`);
                    }
                  }}
                >
                  {/* Header */}
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex flex-1 items-center gap-2">
                      <FileText className="h-4 w-4 flex-shrink-0 text-primary" />
                      {request.visaType && (
                        <span className="inline-flex items-center rounded border border-blue-100 bg-blue-50 px-2 py-0.5 text-xs font-medium text-primary">
                          {request.visaType}
                        </span>
                      )}
                      <span className={`${statusChipBase} ${statusStyles[request.status]}`}>
                        {statusLabels[request.status]}
                      </span>
                    </div>
                    <button
                      type="button"
                      className="flex-shrink-0 rounded p-1 transition-colors hover:bg-gray-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        // TODO: Add menu actions
                      }}
                      aria-label="More options"
                    >
                      <MoreVertical className="h-4 w-4 text-gray-400" />
                    </button>
                  </div>

                  {/* Title */}
                  <h2 className="mb-4 text-lg font-semibold text-gray-900">
                    {request.title}
                  </h2>

                  {/* Clean Info Grid */}
                  <div className="mb-4 grid grid-cols-2 gap-x-6 gap-y-3 border-b border-gray-200 pb-4 md:grid-cols-4">
                    <div>
                      <div className="mb-1 flex items-center gap-1.5 text-xs text-gray-500">
                        <Globe className="h-3.5 w-3.5" />
                        <span>Nationality</span>
                      </div>
                      <p className="text-sm font-medium text-gray-900">{nationality}</p>
                    </div>
                    <div>
                      <div className="mb-1 flex items-center gap-1.5 text-xs text-gray-500">
                        <User className="h-3.5 w-3.5" />
                        <span>Age Range</span>
                      </div>
                      <p className="text-sm font-medium text-gray-900">{ageRange}</p>
                    </div>
                    <div>
                      <div className="mb-1 flex items-center gap-1.5 text-xs text-gray-500">
                        <MapPin className="h-3.5 w-3.5" />
                        <span>Location</span>
                      </div>
                      <p className="text-sm font-medium text-gray-900">{request.location || 'Not specified'}</p>
                    </div>
                    <div>
                      <div className="mb-1 flex items-center gap-1.5 text-xs text-gray-500">
                        <Briefcase className="h-3.5 w-3.5" />
                        <span>Purpose</span>
                      </div>
                      <p className="text-sm font-medium capitalize text-gray-900">{purpose}</p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-gray-500">
                      <span className="flex items-center gap-1.5">
                        <MessageSquare className="h-3.5 w-3.5" />
                        0 proposals
                      </span>
                      {budgetText && (
                        <span className="flex items-center gap-1.5">
                          <Wallet className="h-3.5 w-3.5" />
                          {budgetText}
                        </span>
                      )}
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        {dateText}
                      </span>
                    </div>
                    <button
                      type="button"
                      className="hover:text-primary/80 flex items-center gap-1 self-end text-sm font-medium text-primary sm:self-auto"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/requests/${request.id}`);
                      }}
                    >
                      View details
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* FAQ Section */}
        <section className="ios-card" aria-label="Frequently asked questions">
          <div className="p-6 md:p-8">
            <div className="mb-8">
              <h2 className="mb-2 text-xl font-bold text-gray-900">Frequently Asked Questions</h2>
              <p className="text-sm text-gray-500">Find answers to common questions about using VisaOnTrack</p>
            </div>

            {/* Tab Navigation */}
            <div className="mb-8 flex w-fit gap-1 rounded-xl bg-gray-50/80 p-1" role="tablist" aria-label="FAQ categories">
              {faqData.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === category.id}
                  aria-controls={`faq-panel-${category.id}`}
                  id={`faq-tab-${category.id}`}
                  onClick={() => {
                    setActiveTab(category.id);
                    setExpandedQuestions(new Set());
                  }}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                    activeTab === category.id
                      ? 'bg-white text-gray-900 shadow-sm ring-1 ring-black/5'
                      : 'text-gray-500 hover:bg-gray-100/50 hover:text-gray-700'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>

            {/* FAQ Content */}
            <div
              id={`faq-panel-${activeTab}`}
              role="tabpanel"
              aria-labelledby={`faq-tab-${activeTab}`}
              className="space-y-3"
            >
              {activeCategory.items.map((item, index) => {
                const questionId = `${activeTab}-${index}`;
                const isExpanded = expandedQuestions.has(questionId);
                return (
                  <div
                    key={questionId}
                    className="overflow-hidden rounded-xl border border-gray-100 transition-all duration-200 hover:border-gray-200"
                  >
                    <button
                      type="button"
                      onClick={() => toggleQuestion(questionId)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          toggleQuestion(questionId);
                        }
                      }}
                      className="flex w-full items-center justify-between gap-4 px-4 py-3.5 text-left transition-colors duration-150 hover:bg-gray-50/50 focus:outline-none"
                      aria-expanded={isExpanded}
                      aria-controls={`faq-answer-${questionId}`}
                    >
                      <span className="text-sm font-semibold text-gray-900">{item.question}</span>
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 flex-shrink-0 text-gray-400" aria-hidden="true" />
                      ) : (
                        <ChevronDown className="h-4 w-4 flex-shrink-0 text-gray-400" aria-hidden="true" />
                      )}
                    </button>
                    {isExpanded && (
                      <div
                        id={`faq-answer-${questionId}`}
                        className="px-4 pb-4 pt-0 text-sm leading-relaxed text-gray-600"
                      >
                        {item.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="space-y-4 text-center">
          <Spinner size="lg" />
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Loading your dashboard...</h2>
          </div>
        </div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
