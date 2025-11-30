'use client';

import React, { useCallback, useState } from 'react';
import { Upload, X, File, FileText, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { api } from '@visaontrack/client';
import { getErrorDisplayMessage } from '@/lib/error-handling';

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  mimeType: string;
  url: string;
}

interface AttachmentUploaderProps {
  onFilesUploaded: (files: UploadedFile[]) => void;
  maxFiles?: number;
  maxSizeMB?: number;
  acceptedTypes?: string[];
  disabled?: boolean;
}

const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // docx
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // xlsx
];

const MIME_TYPE_LABELS: Record<string, string> = {
  'application/pdf': 'PDF',
  'image/jpeg': 'Image',
  'image/png': 'Image',
  'image/webp': 'Image',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Word',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'Excel',
};

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

export function AttachmentUploader({
  onFilesUploaded,
  maxFiles = 5,
  maxSizeMB = 25,
  acceptedTypes = ALLOWED_MIME_TYPES,
  disabled = false,
}: AttachmentUploaderProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState<string[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): string | null => {
    // Check file type
    if (!acceptedTypes.includes(file.type)) {
      const allowedNames = acceptedTypes.map((t) => MIME_TYPE_LABELS[t] || t).join(', ');
      return `File type not allowed. Accepted: ${allowedNames}`;
    }

    // Check file size
    const maxBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxBytes) {
      return `File size exceeds ${maxSizeMB}MB limit`;
    }

    // Check total count
    if (files.length + uploading.length >= maxFiles) {
      return `Maximum ${maxFiles} files allowed`;
    }

    return null;
  };

  const uploadFile = async (file: File) => {
    const uploadId = `${file.name}-${Date.now()}`;

    try {
      setUploading((prev) => [...prev, uploadId]);
      setError(null);

      const formData = new FormData();
      formData.append('file', file);

      const attachment = await api.messages.uploadAttachment({
        formData: { file },
      });

      const uploadedFile: UploadedFile = {
        id: attachment.id,
        name: attachment.filename,
        size: attachment.size,
        mimeType: attachment.mimeType,
        url: attachment.url,
      };

      setFiles((prev) => {
        const updated = [...prev, uploadedFile];
        onFilesUploaded(updated);
        return updated;
      });
    } catch (err) {
      console.error('[AttachmentUploader] Upload error:', err);
      setError(getErrorDisplayMessage(err, 'upload file'));
    } finally {
      setUploading((prev) => prev.filter((id) => id !== uploadId));
    }
  };

  const handleFiles = useCallback(
    async (fileList: FileList | null) => {
      if (!fileList || disabled) return;

      const filesToUpload: File[] = [];

      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        const validationError = validateFile(file);

        if (validationError) {
          setError(validationError);
          return;
        }

        filesToUpload.push(file);
      }

      // Upload files sequentially
      for (const file of filesToUpload) {
        await uploadFile(file);
      }
    },
    [files, uploading, disabled, maxFiles, maxSizeMB, acceptedTypes]
  );

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (disabled) return;

    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (disabled) return;

    handleFiles(e.dataTransfer.files);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (disabled) return;
    handleFiles(e.target.files);
  };

  const removeFile = (id: string) => {
    setFiles((prev) => {
      const updated = prev.filter((f) => f.id !== id);
      onFilesUploaded(updated);
      return updated;
    });
    setError(null);
  };

  return (
    <div className="space-y-3">
      {/* Drop Zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative rounded-lg border-2 border-dashed transition-colors ${
          dragActive
            ? 'border-primary bg-primary/5'
            : disabled
            ? 'border-gray-200 bg-gray-50'
            : 'border-gray-300 bg-white hover:border-gray-400'
        } ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
      >
        <input
          type="file"
          id="file-upload"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={handleChange}
          disabled={disabled}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        />

        <div className="px-6 py-8 text-center">
          <Upload className={`mx-auto mb-3 h-8 w-8 ${disabled ? 'text-gray-300' : 'text-gray-400'}`} />
          <p className="mb-1 text-sm font-medium text-gray-700">
            {dragActive ? 'Drop files here' : 'Drop files or click to browse'}
          </p>
          <p className="text-xs text-gray-500">
            PDF, JPG, PNG, WebP, DOCX, XLSX up to {maxSizeMB}MB
          </p>
          <p className="mt-1 text-xs text-gray-400">
            Maximum {maxFiles} files
          </p>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {/* Uploaded Files List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-gray-500">
            Attached Files ({files.length}/{maxFiles})
          </p>
          {files.map((file) => {
            const Icon = getFileIcon(file.mimeType);
            return (
              <div
                key={file.id}
                className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 transition-shadow hover:shadow-sm"
              >
                <Icon className="h-5 w-5 flex-shrink-0 text-primary" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900">{file.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(file.id)}
                  disabled={disabled}
                  className="flex-shrink-0 rounded p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label={`Remove ${file.name}`}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Uploading Indicators */}
      {uploading.length > 0 && (
        <div className="space-y-2">
          {uploading.map((id) => (
            <div
              key={id}
              className="flex items-center gap-3 rounded-lg border border-blue-200 bg-blue-50 p-3"
            >
              <div className="h-5 w-5 flex-shrink-0 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <p className="text-sm text-blue-900">Uploading...</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
