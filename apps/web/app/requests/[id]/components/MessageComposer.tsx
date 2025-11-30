'use client';

import React, { useState, useRef, KeyboardEvent } from 'react';
import { Send, Paperclip } from 'lucide-react';
import { AttachmentUploader, type UploadedFile } from '@/components/AttachmentUploader';

interface MessageComposerProps {
  onSend: (content: string, attachmentIds: string[]) => Promise<void>;
  placeholder?: string;
  disabled?: boolean;
  maxLength?: number;
}

export function MessageComposer({
  onSend,
  placeholder = 'Type your message...',
  disabled = false,
  maxLength = 2000,
}: MessageComposerProps) {
  const [content, setContent] = useState('');
  const [attachments, setAttachments] = useState<UploadedFile[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    if (newContent.length <= maxLength) {
      setContent(newContent);
      autoResize();
    }
  };

  const autoResize = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleSend = async () => {
    const trimmedContent = content.trim();

    if (!trimmedContent && attachments.length === 0) return;
    if (isSending || disabled) return;

    setIsSending(true);
    try {
      const attachmentIds = attachments.map((a) => a.id);
      await onSend(trimmedContent, attachmentIds);

      // Clear form on success
      setContent('');
      setAttachments([]);
      setShowAttachments(false);

      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    } catch (error) {
      console.error('[MessageComposer] Send error:', error);
      // Error handling is done in parent
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Send on Enter (without Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const canSend = !isSending && !disabled && (content.trim().length > 0 || attachments.length > 0);
  const remainingChars = maxLength - content.length;
  const showCharCount = content.length > maxLength * 0.8;

  return (
    <div className="border-t border-gray-200 bg-white px-4 py-4">
      {/* Attachment Panel */}
      {showAttachments && (
        <div className="mb-3">
          <AttachmentUploader
            onFilesUploaded={setAttachments}
            maxFiles={5}
            maxSizeMB={25}
            disabled={disabled || isSending}
          />
        </div>
      )}

      {/* Composer */}
      <div className="flex items-end gap-2">
        {/* Attachment Toggle Button */}
        <button
          type="button"
          onClick={() => setShowAttachments(!showAttachments)}
          disabled={disabled || isSending}
          className={`flex-shrink-0 rounded-lg p-2.5 transition-colors ${
            showAttachments
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          } disabled:cursor-not-allowed disabled:opacity-50`}
          aria-label="Attach files"
        >
          <Paperclip className="h-5 w-5" />
        </button>

        {/* Text Input */}
        <div className="relative min-w-0 flex-1">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleContentChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled || isSending}
            rows={1}
            className="w-full resize-none rounded-lg border border-gray-300 px-4 py-2.5 pr-16 text-sm leading-relaxed text-gray-900 placeholder-gray-400 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:opacity-60"
            style={{ maxHeight: '200px', minHeight: '44px' }}
          />

          {/* Character Count */}
          {showCharCount && (
            <div className="absolute bottom-2 right-2 text-xs text-gray-400">
              {remainingChars}
            </div>
          )}
        </div>

        {/* Send Button */}
        <button
          type="button"
          onClick={handleSend}
          disabled={!canSend}
          className="flex-shrink-0 rounded-lg bg-primary px-4 py-2.5 text-white transition-all hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Send message"
        >
          {isSending ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <Send className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Hints */}
      <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
        <p>
          Press <kbd className="rounded border border-gray-300 bg-gray-50 px-1.5 py-0.5 font-mono">Enter</kbd> to send,{' '}
          <kbd className="rounded border border-gray-300 bg-gray-50 px-1.5 py-0.5 font-mono">Shift+Enter</kbd> for new line
        </p>
        {attachments.length > 0 && (
          <p className="font-medium text-primary">
            {attachments.length} file{attachments.length > 1 ? 's' : ''} attached
          </p>
        )}
      </div>
    </div>
  );
}
