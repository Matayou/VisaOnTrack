'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, MessageSquare, AlertCircle } from 'lucide-react';
import { api, type Message, type Request } from '@visaontrack/client';
import { MessageThread } from '../components/MessageThread';
import { MessageComposer } from '../components/MessageComposer';
import { SeekerHeader } from '@/components/SeekerHeader';
import { getErrorDisplayMessage } from '@/lib/error-handling';
import { FeatureGate } from '@/components/FeatureGate';

const POLL_INTERVAL = 5000; // 5 seconds
const MESSAGES_PER_PAGE = 20;

export default function RequestThreadPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const requestId = Array.isArray(params?.id) ? params?.id[0] : params?.id;

  const [request, setRequest] = useState<Request | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoadingRequest, setIsLoadingRequest] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  // Fetch current user
  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await api.users.getCurrentUser();
        setCurrentUserId(user.id);
        setUserRole(user.role);
      } catch (err: unknown) {
        const errorObj = err as { status?: number };
        if (errorObj?.status === 401) {
          router.replace('/auth/login');
        }
      }
    };
    loadUser();
  }, [router]);

  // Fetch request details
  useEffect(() => {
    if (!requestId) return;

    const loadRequest = async () => {
      try {
        setIsLoadingRequest(true);
        const data = await api.requests.getRequest({ id: requestId });
        setRequest(data);
      } catch (err) {
        console.error('[RequestThreadPage] Load request error:', err);
        setError(getErrorDisplayMessage(err, 'load request'));
      } finally {
        setIsLoadingRequest(false);
      }
    };

    loadRequest();
  }, [requestId]);

  // Fetch messages
  const loadMessages = useCallback(
    async (pageNum: number = 1, append: boolean = false) => {
      if (!requestId) return;

      try {
        setIsLoadingMessages(true);
        const response = await api.messages.listMessages({
          id: requestId,
          page: pageNum,
          limit: MESSAGES_PER_PAGE,
        });

        const newMessages = response.data || [];
        setMessages((prev) => (append ? [...prev, ...newMessages] : newMessages));
        setHasMore(newMessages.length === MESSAGES_PER_PAGE);
        setPage(pageNum);
      } catch (err) {
        console.error('[RequestThreadPage] Load messages error:', err);
        setError(getErrorDisplayMessage(err, 'load messages'));
      } finally {
        setIsLoadingMessages(false);
      }
    },
    [requestId]
  );

  // Initial load
  useEffect(() => {
    if (requestId && currentUserId) {
      loadMessages(1, false);
    }
  }, [requestId, currentUserId]);

  // Polling for new messages
  useEffect(() => {
    if (!requestId || !currentUserId) return;

    const interval = setInterval(() => {
      loadMessages(1, false);
    }, POLL_INTERVAL);

    return () => clearInterval(interval);
  }, [requestId, currentUserId, loadMessages]);

  // Send message handler
  const handleSendMessage = async (content: string, attachmentIds: string[]) => {
    if (!requestId) return;

    try {
      const newMessage = await api.messages.sendMessage({
        id: requestId,
        requestBody: {
          body: content,
          attachmentIds,
        },
      });

      // Optimistically add message to list
      setMessages((prev) => [...prev, newMessage]);

      // Refresh to ensure consistency
      setTimeout(() => {
        loadMessages(1, false);
      }, 500);
    } catch (err) {
      console.error('[RequestThreadPage] Send message error:', err);
      const errorMessage = getErrorDisplayMessage(err, 'send message');
      alert(errorMessage);
      throw err; // Re-throw so MessageComposer can handle
    }
  };

  // Load more messages
  const handleLoadMore = () => {
    if (hasMore && !isLoadingMessages) {
      loadMessages(page + 1, true);
    }
  };

  const isLoading = isLoadingRequest || (isLoadingMessages && messages.length === 0);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="space-y-3 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm text-gray-600">Loading conversation...</p>
        </div>
      </div>
    );
  }

  if (error && !request) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md rounded-xl border border-red-100 bg-white p-6 text-center">
          <AlertCircle className="mx-auto mb-4 h-10 w-10 text-red-500" />
          <h2 className="mb-2 text-lg font-bold text-gray-900">Unable to load conversation</h2>
          <p className="mb-6 text-gray-600">{error}</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const isSeeker = userRole === 'SEEKER';

  const threadContent = (
    <div className="flex h-screen flex-col bg-gray-50">
      <SeekerHeader />

      {/* Thread Header */}
      <header className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center gap-4">
          <button
            onClick={() => router.push(`/requests/${requestId}`)}
            className="-ml-2 rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
            aria-label="Back to request"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 flex-shrink-0 text-primary" />
              <h1 className="truncate text-lg font-semibold text-gray-900">
                {request?.title || 'Request Conversation'}
              </h1>
            </div>
            {request?.visaType && (
              <p className="mt-0.5 text-sm text-gray-500">{request.visaType}</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              {messages.length} message{messages.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </header>

      {/* Messages Container */}
      <main className="mx-auto flex h-0 min-h-0 w-full max-w-7xl flex-1 flex-col overflow-hidden">
        <div className="flex-1 overflow-hidden bg-white">
          <MessageThread
            messages={messages}
            currentUserId={currentUserId}
            isLoading={isLoadingMessages && messages.length === 0}
            onLoadMore={handleLoadMore}
            hasMore={hasMore}
          />
        </div>

        {/* Composer */}
        <MessageComposer
          onSend={handleSendMessage}
          disabled={!currentUserId}
        />
      </main>
    </div>
  );

  if (isSeeker || userRole === null) {
    return threadContent;
  }

  return (
    <FeatureGate
      feature="messaging.enabled"
      fallback={
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6">
          <div className="max-w-md text-center">
            <MessageSquare className="mx-auto mb-4 h-16 w-16 text-gray-300" />
            <h1 className="mb-2 text-2xl font-bold text-gray-900">
              Messaging is a PRO Feature
            </h1>
            <p className="mb-6 text-gray-600">
              Upgrade to PRO or AGENCY plan to communicate directly with clients
              and close more deals.
            </p>
            <button
              onClick={() => router.push('/pricing')}
              className="rounded-lg bg-primary px-6 py-3 font-medium text-white transition-colors hover:bg-primary-hover"
            >
              View Plans & Pricing
            </button>
          </div>
        </div>
      }
    >
      {threadContent}
    </FeatureGate>
  );
}
