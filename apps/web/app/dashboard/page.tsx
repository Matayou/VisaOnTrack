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
  DRAFT: 'bg-amber-50 text-amber-800 border-amber-200',
  OPEN: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  CLOSED: 'bg-gray-100 text-gray-700 border-gray-200',
  HIRED: 'bg-blue-50 text-blue-800 border-blue-200',
};

const statusBorderColors: Record<RequestStatus, string> = {
  DRAFT: 'border-l-amber-400',
  OPEN: 'border-l-emerald-500',
  CLOSED: 'border-l-gray-400',
  HIRED: 'border-l-blue-500',
};

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Spinner size="lg" />
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Setting up your workspace</h2>
            <p className="text-gray-600 mt-1">Creating your request from your answers...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      <PageBackground />
      <SeekerHeader />
      <div className="relative z-10 w-full mx-auto space-y-6 px-4 sm:px-6 lg:px-8 py-6 lg:py-10 max-w-7xl">
        {/* Header with Metrics */}
        <header className="ios-card px-6 py-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-50/40 to-transparent rounded-full -mr-20 -mt-20 pointer-events-none"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Your Requests</p>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                  Manage your visa requests
                </h1>
              </div>
              <Button
                type="button"
                onClick={() => router.push('/requests/new')}
                icon={<PlusCircle className="w-4 h-4" />}
                iconPosition="left"
                className="hidden sm:inline-flex"
              >
                Start new request
              </Button>
            </div>

            {/* Metrics Cards - Compact on Mobile */}
            {!isLoadingRequests && requests.length > 0 && (
              <div className="grid grid-cols-4 gap-2 sm:gap-3 mb-6">
                <div className="border border-gray-200 rounded-lg p-2 sm:p-3">
                  <p className="text-[10px] sm:text-xs text-gray-500 mb-0.5 sm:mb-1">Total</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">{metrics.total}</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-2 sm:p-3">
                  <p className="text-[10px] sm:text-xs text-emerald-600 mb-0.5 sm:mb-1">Active</p>
                  <p className="text-lg sm:text-2xl font-bold text-emerald-600">{metrics.active}</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-2 sm:p-3">
                  <p className="text-[10px] sm:text-xs text-blue-600 mb-0.5 sm:mb-1">Proposals</p>
                  <p className="text-lg sm:text-2xl font-bold text-blue-600">{metrics.proposals}</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-2 sm:p-3">
                  <p className="text-[10px] sm:text-xs text-purple-600 mb-0.5 sm:mb-1">Hired</p>
                  <p className="text-lg sm:text-2xl font-bold text-purple-600">{metrics.hired}</p>
                </div>
              </div>
            )}

            {/* Mobile CTA */}
            <div className="sm:hidden">
              <Button
                type="button"
                onClick={() => router.push('/requests/new')}
                icon={<PlusCircle className="w-4 h-4" />}
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
          <div className="ios-card px-4 sm:px-6 py-3">
            <div className="flex gap-2 sm:gap-3 overflow-x-auto no-scrollbar">
              <button
                type="button"
                onClick={() => setStatusFilter('ALL')}
                className={`inline-flex items-center gap-2 px-3.5 py-2 text-sm font-semibold rounded-lg border transition-all whitespace-nowrap ${
                  statusFilter === 'ALL'
                    ? 'bg-primary/10 text-primary border-primary/20 shadow-sm'
                    : 'bg-white text-gray-600 border-transparent hover:border-gray-200'
                }`}
              >
                All
                {requests.length > 0 && <span className="text-xs font-semibold text-gray-500">({requests.length})</span>}
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('OPEN')}
                className={`inline-flex items-center gap-2 px-3.5 py-2 text-sm font-semibold rounded-lg border transition-all whitespace-nowrap ${
                  statusFilter === 'OPEN'
                    ? 'bg-primary/10 text-primary border-primary/20 shadow-sm'
                    : 'bg-white text-gray-600 border-transparent hover:border-gray-200'
                }`}
              >
                Active
                {metrics.active > 0 && <span className="text-xs font-semibold text-gray-500">({metrics.active})</span>}
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('DRAFT')}
                className={`inline-flex items-center gap-2 px-3.5 py-2 text-sm font-semibold rounded-lg border transition-all whitespace-nowrap ${
                  statusFilter === 'DRAFT'
                    ? 'bg-primary/10 text-primary border-primary/20 shadow-sm'
                    : 'bg-white text-gray-600 border-transparent hover:border-gray-200'
                }`}
              >
                Draft
                {metrics.draft > 0 && <span className="text-xs font-semibold text-gray-500">({metrics.draft})</span>}
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('HIRED')}
                className={`inline-flex items-center gap-2 px-3.5 py-2 text-sm font-semibold rounded-lg border transition-all whitespace-nowrap ${
                  statusFilter === 'HIRED'
                    ? 'bg-primary/10 text-primary border-primary/20 shadow-sm'
                    : 'bg-white text-gray-600 border-transparent hover:border-gray-200'
                }`}
              >
                Hired
                {metrics.hired > 0 && <span className="text-xs font-semibold text-gray-500">({metrics.hired})</span>}
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('CLOSED')}
                className={`inline-flex items-center gap-2 px-3.5 py-2 text-sm font-semibold rounded-lg border transition-all whitespace-nowrap ${
                  statusFilter === 'CLOSED'
                    ? 'bg-primary/10 text-primary border-primary/20 shadow-sm'
                    : 'bg-white text-gray-600 border-transparent hover:border-gray-200'
                }`}
              >
                Completed
              </button>
            </div>
          </div>
        )}

        {isLoadingUser || isLoadingRequests ? (
          <div className="ios-card p-6 flex items-center gap-3 text-gray-600">
            <Spinner size="sm" />
            <span>{LOADING_GENERIC}</span>
          </div>
        ) : null}

        {showEmptyState && (
          <div className="text-center py-12 sm:py-16 px-4 relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-50/30 via-white to-blue-50/30 border border-gray-200/60">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-tr from-primary/5 to-transparent rounded-full blur-3xl pointer-events-none"></div>
            <div className="relative z-10 max-w-md mx-auto">
              <div className="w-16 sm:w-20 h-16 sm:h-20 mx-auto mb-4 sm:mb-6 rounded-2xl bg-primary/10 flex items-center justify-center ring-4 ring-primary/5">
                <FileText className="w-8 sm:w-10 h-8 sm:h-10 text-primary" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">Ready to start your visa journey?</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-2 leading-relaxed">
                Create your first visa request to connect with verified providers.
                They'll review your requirements and send personalized proposals.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-xs sm:text-sm text-gray-500 mb-6 sm:mb-8 pt-2">
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  Free to post
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  Multiple quotes
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  Secure payments
                </span>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4">
                <Button
                  type="button"
                  size="lg"
                  onClick={() => router.push('/requests/new')}
                  icon={<PlusCircle className="w-5 h-5" />}
                  iconPosition="left"
                  className="w-full sm:w-auto"
                >
                  Start new request
                </Button>
                <button
                  onClick={() => router.push('/providers')}
                  className="w-full sm:w-auto px-6 py-3 bg-white border border-gray-200 hover:border-primary/30 hover:text-primary text-gray-700 font-semibold rounded-xl text-base transition-all shadow-sm hover:shadow"
                >
                  Browse providers
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Filtered Empty State */}
        {showFilteredEmptyState && (
          <div className="text-center py-12 ios-card">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-50 flex items-center justify-center">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">No {statusFilter.toLowerCase()} requests</h3>
            <p className="text-sm text-gray-500 mb-4">
              Try selecting a different filter to view other requests
            </p>
            <button
              type="button"
              onClick={() => setStatusFilter('ALL')}
              className="text-sm font-medium text-primary hover:text-primary/80 underline"
            >
              View all requests
            </button>
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-800 p-4 rounded-xl border border-red-200 flex items-start gap-3">
            <AlertCircle className="w-5 h-5" aria-hidden="true" />
            <div className="flex-1">
              <p className="text-sm font-semibold">We couldn&apos;t load your requests</p>
              <p className="text-sm">{error}</p>
              <button
                type="button"
                className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-700 underline"
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
                  className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow cursor-pointer"
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
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2 flex-1">
                      <FileText className="w-4 h-4 text-primary flex-shrink-0" />
                      {request.visaType && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium text-primary bg-blue-50 border border-blue-100">
                          {request.visaType}
                        </span>
                      )}
                      <span
                        className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-medium ${
                          request.status === 'DRAFT' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                          request.status === 'OPEN' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                          request.status === 'HIRED' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                          'bg-gray-50 text-gray-600 border border-gray-200'
                        }`}
                      >
                        {statusLabels[request.status]}
                      </span>
                    </div>
                    <button
                      type="button"
                      className="p-1 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        // TODO: Add menu actions
                      }}
                      aria-label="More options"
                    >
                      <MoreVertical className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>

                  {/* Title */}
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    {request.title}
                  </h2>

                  {/* Clean Info Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-3 mb-4 pb-4 border-b border-gray-200">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                        <Globe className="w-3.5 h-3.5" />
                        <span>Nationality</span>
                      </div>
                      <p className="text-sm font-medium text-gray-900">{nationality}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                        <User className="w-3.5 h-3.5" />
                        <span>Age Range</span>
                      </div>
                      <p className="text-sm font-medium text-gray-900">{ageRange}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>Location</span>
                      </div>
                      <p className="text-sm font-medium text-gray-900">{request.location || 'Not specified'}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                        <Briefcase className="w-3.5 h-3.5" />
                        <span>Purpose</span>
                      </div>
                      <p className="text-sm font-medium text-gray-900 capitalize">{purpose}</p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-gray-500">
                      <span className="flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5" />
                        0 proposals
                      </span>
                      {budgetText && (
                        <span className="flex items-center gap-1.5">
                          <Wallet className="w-3.5 h-3.5" />
                          {budgetText}
                        </span>
                      )}
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {dateText}
                      </span>
                    </div>
                    <button
                      type="button"
                      className="text-sm font-medium text-primary hover:text-primary/80 flex items-center gap-1 self-end sm:self-auto"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/requests/${request.id}`);
                      }}
                    >
                      View details
                      <ArrowRight className="w-3.5 h-3.5" />
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
              <h2 className="text-xl font-bold text-gray-900 mb-2">Frequently Asked Questions</h2>
              <p className="text-sm text-gray-500">Find answers to common questions about using VisaOnTrack</p>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-1 mb-8 bg-gray-50/80 p-1 rounded-xl w-fit" role="tablist" aria-label="FAQ categories">
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
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    activeTab === category.id
                      ? 'bg-white text-gray-900 shadow-sm ring-1 ring-black/5'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100/50'
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
                    className="border border-gray-100 rounded-xl overflow-hidden transition-all duration-200 hover:border-gray-200"
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
                      className="w-full px-4 py-3.5 text-left flex items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors duration-150 focus:outline-none"
                      aria-expanded={isExpanded}
                      aria-controls={`faq-answer-${questionId}`}
                    >
                      <span className="font-semibold text-gray-900 text-sm">{item.question}</span>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" aria-hidden="true" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" aria-hidden="true" />
                      )}
                    </button>
                    {isExpanded && (
                      <div
                        id={`faq-answer-${questionId}`}
                        className="px-4 pb-4 pt-0 text-sm text-gray-600 leading-relaxed"
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
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
