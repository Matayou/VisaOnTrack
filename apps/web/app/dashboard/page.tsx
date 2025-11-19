'use client';

import { useEffect, useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Loader,
  MapPin,
  PlusCircle,
  Wallet,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { api, type Request, type RequestStatus } from '@visaontrack/client';

const statusLabels: Record<RequestStatus, string> = {
  DRAFT: 'Draft',
  OPEN: 'Active',
  CLOSED: 'Closed',
  REMOVED: 'Removed',
  EXPIRED: 'Expired',
  ARCHIVED: 'Archived',
};

const statusStyles: Record<RequestStatus, string> = {
  DRAFT: 'bg-amber-50 text-amber-800 border-amber-200',
  OPEN: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  CLOSED: 'bg-gray-100 text-gray-700 border-gray-200',
  REMOVED: 'bg-rose-50 text-rose-800 border-rose-200',
  EXPIRED: 'bg-orange-50 text-orange-800 border-orange-200',
  ARCHIVED: 'bg-slate-50 text-slate-700 border-slate-200',
};

const statusBorderColors: Record<RequestStatus, string> = {
  DRAFT: 'border-l-amber-400',
  OPEN: 'border-l-emerald-500',
  CLOSED: 'border-l-gray-400',
  REMOVED: 'border-l-rose-500',
  EXPIRED: 'border-l-orange-500',
  ARCHIVED: 'border-l-slate-400',
};

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

export default function DashboardPage() {
  const router = useRouter();
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isLoadingRequests, setIsLoadingRequests] = useState(false);
  const [requests, setRequests] = useState<Request[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('basics');
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());

  useEffect(() => {
    const run = async () => {
      try {
        const user = await api.users.getCurrentUser();
        if (user.role === 'PROVIDER' || user.role === 'ADMIN') {
          router.replace('/requests');
          return;
        }
        setIsLoadingUser(false);
        setIsLoadingRequests(true);

        const response = await api.requests.listRequests({ page: 1, limit: 5, seekerId: user.id });
        setRequests(response.data ?? []);
      } catch (err: unknown) {
        const errorObj = err as { status?: number };
        if (errorObj?.status === 401) {
          router.replace('/auth/login');
          return;
        }
        setError('Unable to load your account or requests right now.');
        console.error('[SeekerDashboard] load error', err);
      } finally {
        setIsLoadingRequests(false);
      }
    };

    run();
  }, [router]);

  const showEmptyState = !requests.length && !isLoadingRequests && !error;

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

  return (
    <div className="min-h-screen bg-bg-secondary">
      <SeekerHeader />
      <div className="max-w-6xl mx-auto space-y-6 p-6 lg:p-10">
        <header className="bg-bg-primary border border-border-light rounded-base px-6 py-8 shadow-sm">
          <p className="text-xs uppercase tracking-[0.3em] text-text-tertiary font-semibold">Your requests</p>
          <h1 className="text-3xl font-semibold tracking-tight text-text-primary">Manage your visa request</h1>
          <p className="text-text-secondary">
            You can keep one request active or in draft. Publish to connect with providers or close it when you are done.
          </p>
          <div className="mt-4 flex gap-3">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-base bg-gradient-to-b from-primary to-primary-hover px-5 py-3 text-sm font-semibold text-white shadow-xs transition-all duration-200 hover:shadow-md hover:shadow-primary/15 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              onClick={() => router.push('/requests/new')}
            >
              <PlusCircle className="w-4 h-4" aria-hidden="true" />
              Start new request
            </button>
            {requests[0] && (
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-base border border-border-light px-5 py-3 text-sm font-medium text-text-secondary hover:text-text-primary hover:border-border transition"
                onClick={() => router.push(`/requests/${requests[0].id}`)}
              >
                View latest
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            )}
          </div>
        </header>

        {isLoadingUser || isLoadingRequests ? (
          <div className="bg-bg-primary border border-border-light rounded-base p-6 flex items-center gap-3 text-text-secondary">
            <Loader className="w-5 h-5 animate-spin" aria-hidden="true" />
            <span>Loading your requests...</span>
          </div>
        ) : null}

        {showEmptyState && (
          <div className="bg-bg-primary border border-border-light rounded-base p-6 text-text-secondary">
            <p className="text-lg font-semibold text-text-primary mb-2">No requests yet</p>
            <p className="text-sm">Create a request to start working with providers.</p>
          </div>
        )}

        {error && (
          <div className="bg-bg-primary border border-error/30 text-error rounded-base p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5" aria-hidden="true" />
            <div className="flex-1">
              <p className="text-sm font-semibold">We couldn&apos;t load your request</p>
              <p className="text-sm">{error}</p>
              <button
                type="button"
                className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-error underline"
                onClick={() => router.refresh()}
              >
                Try again
              </button>
            </div>
          </div>
        )}

        {!showEmptyState && requests.length > 0 && (
          <div className="space-y-4">
            {requests.map((request) => {
              const budgetText = formatBudget(request.budgetMin, request.budgetMax);
              const dateText = formatRelativeDate(request.createdAt);
              const hasMetadata = request.visaType || budgetText || request.location;

              return (
                <article
                  key={request.id}
                  className={`bg-bg-primary border border-border-light rounded-base shadow-sm transition-all duration-200 hover:shadow-md hover:border-border-medium ${statusBorderColors[request.status]} border-l-4`}
                >
                  <div className="p-6 md:p-8">
                    {/* Header: Title and Status */}
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex-1 min-w-0">
                        <h2 className="text-xl md:text-2xl font-semibold text-text-primary tracking-tight mb-2 leading-tight">
                          {request.title}
                        </h2>
                        <p className="text-sm text-text-secondary line-clamp-2 leading-relaxed">{request.description}</p>
                      </div>
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold border flex-shrink-0 ${statusStyles[request.status]}`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                        {statusLabels[request.status]}
                      </span>
                    </div>

                    {/* Metadata Section */}
                    {hasMetadata && (
                      <div className="flex flex-wrap items-center gap-3 mb-5 pt-4 border-t border-border-light">
                        {request.visaType && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-bg-secondary border border-border-light rounded-base text-xs font-medium text-text-secondary">
                            <span className="text-text-tertiary">{request.visaType}</span>
                          </span>
                        )}
                        {budgetText && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-bg-secondary border border-border-light rounded-base text-xs font-medium text-text-secondary">
                            <Wallet className="w-3.5 h-3.5 text-text-tertiary" aria-hidden="true" />
                            <span>{budgetText}</span>
                          </span>
                        )}
                        {request.location && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-bg-secondary border border-border-light rounded-base text-xs font-medium text-text-secondary">
                            <MapPin className="w-3.5 h-3.5 text-text-tertiary" aria-hidden="true" />
                            <span>{request.location}</span>
                          </span>
                        )}
                        {dateText && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-bg-secondary border border-border-light rounded-base text-xs font-medium text-text-secondary">
                            <Calendar className="w-3.5 h-3.5 text-text-tertiary" aria-hidden="true" />
                            <span>{dateText}</span>
                          </span>
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-border-light">
                      <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-base border border-border-light px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary hover:border-border transition-colors duration-150"
                        onClick={() => router.push(`/requests/${request.id}`)}
                      >
                        View
                      </button>
                      {(request.status === 'DRAFT' || request.status === 'OPEN') && (
                        <button
                          type="button"
                          className="inline-flex items-center gap-2 rounded-base bg-gradient-to-b from-primary to-primary-hover px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition-all duration-200 hover:shadow-md hover:shadow-primary/15 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                          onClick={() => router.push(`/requests/${request.id}`)}
                        >
                          {request.status === 'DRAFT' ? 'Continue' : 'View details'}
                          <ArrowRight className="w-4 h-4" aria-hidden="true" />
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* FAQ Section */}
        <section className="bg-bg-primary border border-border-light rounded-base shadow-sm" aria-label="Frequently asked questions">
          <div className="p-6 md:p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-text-primary mb-2">Frequently Asked Questions</h2>
              <p className="text-sm text-text-secondary">Find answers to common questions about using VisaOnTrack</p>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-2 mb-6 border-b border-border-light" role="tablist" aria-label="FAQ categories">
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
                  className={`px-4 py-2 text-sm font-medium transition-colors duration-150 border-b-2 -mb-px ${
                    activeTab === category.id
                      ? 'text-primary border-primary'
                      : 'text-text-secondary border-transparent hover:text-text-primary hover:border-border-medium'
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
                    className="border border-border-light rounded-base overflow-hidden transition-all duration-150"
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
                      className="w-full px-4 py-3 text-left flex items-center justify-between gap-4 hover:bg-bg-secondary transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
                      aria-expanded={isExpanded}
                      aria-controls={`faq-answer-${questionId}`}
                    >
                      <span className="font-semibold text-text-primary text-sm md:text-base pr-4">{item.question}</span>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-text-tertiary flex-shrink-0" aria-hidden="true" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-text-tertiary flex-shrink-0" aria-hidden="true" />
                      )}
                    </button>
                    {isExpanded && (
                      <div
                        id={`faq-answer-${questionId}`}
                        className="px-4 pb-4 pt-0 text-sm text-text-secondary leading-relaxed"
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
    </div>
  );
}
import { SeekerHeader } from '@/components/SeekerHeader';
