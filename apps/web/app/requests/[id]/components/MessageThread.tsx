'use client';

import React, { useEffect, useRef } from 'react';
import { File, FileText, Image as ImageIcon, Download, User } from 'lucide-react';
import type { Message } from '@visaontrack/client';

interface MessageThreadProps {
  messages: Message[];
  currentUserId: string;
  isLoading?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

interface AttachmentDisplay {
  id: string;
  filename: string;
  mimeType: string;
  size: number;
  url: string;
}

function getFileIcon(mimeType: string) {
  if (mimeType.startsWith('image/')) return ImageIcon;
  if (mimeType === 'application/pdf') return FileText;
  return File;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
}

function formatMessageTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    ...(date.getFullYear() !== now.getFullYear() && { year: 'numeric' }),
  });
}

export function MessageThread({
  messages,
  currentUserId,
  isLoading = false,
  onLoadMore,
  hasMore = false,
}: MessageThreadProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on initial load and new messages
  useEffect(() => {
    if (messages.length > 0 && !isLoading) {
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [messages.length]);

  if (isLoading && messages.length === 0) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <div className="space-y-3 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm text-gray-500">Loading messages...</p>
        </div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <div className="max-w-sm text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <User className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-gray-900">No messages yet</h3>
          <p className="text-sm text-gray-500">
            Start the conversation by sending a message below.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="flex h-full flex-col overflow-y-auto px-4 py-6">
      {/* Load More Button */}
      {hasMore && (
        <div className="mb-4 text-center">
          <button
            onClick={onLoadMore}
            disabled={isLoading}
            className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? 'Loading...' : 'Load older messages'}
          </button>
        </div>
      )}

      {/* Messages */}
      <div className="space-y-4">
        {messages.map((message, index) => {
          const isOwnMessage = message.senderId === currentUserId;
          const showSender = index === 0 || messages[index - 1].senderId !== message.senderId;

          return (
            <div
              key={message.id}
              className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] space-y-1 ${isOwnMessage ? 'items-end' : 'items-start'}`}>
                {/* Sender Name (only show when sender changes) */}
                {showSender && !isOwnMessage && (
                  <p className="px-3 text-xs font-medium text-gray-500">
                    {(message as any).senderName || 'Provider'}
                  </p>
                )}

                {/* Message Bubble */}
                <div
                  className={`rounded-2xl px-4 py-2.5 ${isOwnMessage
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-900'
                    }`}
                >
                  <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
                    {message.body}
                  </p>

                  {/* Attachments */}
                  {message.attachments && message.attachments.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {message.attachments.map((attachment) => {
                        // Map SDK Attachment to display format (backend may return different shape)
                        const displayAttachment: AttachmentDisplay = {
                          id: attachment.id,
                          filename: (attachment as any).filename || (attachment as any).name || `file-${attachment.id}`,
                          mimeType: attachment.mime,
                          size: attachment.size,
                          url: (attachment as any).url || (attachment as any).signedUrl || `/api/attachments/${attachment.id}`,
                        };

                        const Icon = getFileIcon(displayAttachment.mimeType);
                        const isImage = displayAttachment.mimeType.startsWith('image/');

                        return (
                          <div
                            key={displayAttachment.id}
                            className={`overflow-hidden rounded-lg ${isOwnMessage
                                ? 'bg-white/10 hover:bg-white/20'
                                : 'bg-white hover:bg-gray-50'
                              } transition-colors`}
                          >
                            {isImage ? (
                              // Image Preview
                              <a
                                href={displayAttachment.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block"
                              >
                                <img
                                  src={displayAttachment.url}
                                  alt={displayAttachment.filename}
                                  className="h-auto w-full max-w-sm rounded-lg"
                                  loading="lazy"
                                />
                                <div className="flex items-center justify-between gap-2 p-2">
                                  <p className={`truncate text-xs ${isOwnMessage ? 'text-white/80' : 'text-gray-600'}`}>
                                    {displayAttachment.filename}
                                  </p>
                                  <Download className={`h-3.5 w-3.5 flex-shrink-0 ${isOwnMessage ? 'text-white/80' : 'text-gray-400'}`} />
                                </div>
                              </a>
                            ) : (
                              // File Download Link
                              <a
                                href={displayAttachment.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 p-3"
                              >
                                <Icon className={`h-5 w-5 flex-shrink-0 ${isOwnMessage ? 'text-white/90' : 'text-primary'}`} />
                                <div className="min-w-0 flex-1">
                                  <p className={`truncate text-sm font-medium ${isOwnMessage ? 'text-white' : 'text-gray-900'}`}>
                                    {displayAttachment.filename}
                                  </p>
                                  <p className={`text-xs ${isOwnMessage ? 'text-white/70' : 'text-gray-500'}`}>
                                    {formatFileSize(displayAttachment.size)}
                                  </p>
                                </div>
                                <Download className={`h-4 w-4 flex-shrink-0 ${isOwnMessage ? 'text-white/80' : 'text-gray-400'}`} />
                              </a>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Timestamp */}
                <p className={`px-3 text-xs text-gray-400 ${isOwnMessage ? 'text-right' : 'text-left'}`}>
                  {formatMessageTime(message.createdAt)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Scroll Anchor */}
      <div ref={bottomRef} />
    </div>
  );
}
