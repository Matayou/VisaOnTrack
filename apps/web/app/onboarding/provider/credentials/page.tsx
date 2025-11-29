'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  Upload,
  FileText,
  X,
  CheckCircle,
  Loader,
  ShieldCheck,
} from 'lucide-react';
import { api } from '@visaontrack/client';
import { LOADING_SAVING } from '@/lib/loading-messages';
import { Footer } from '@/components/ui';
import { getErrorDisplayMessage } from '@/lib/error-handling';

interface FileUpload {
  id: string;
  file: File;
  name: string;
  size: string;
  progress: number;
  status: 'uploading' | 'complete' | 'error';
}

export default function CredentialsPage() {
  const router = useRouter();
  const licenseInputRef = useRef<HTMLInputElement>(null);
  const certInputRef = useRef<HTMLInputElement>(null);
  const [licenseFiles, setLicenseFiles] = useState<FileUpload[]>([]);
  const [certFiles, setCertFiles] = useState<FileUpload[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // File size limits per plan (bytes)
  // Free: 2MB, Pro: 25MB, Pro+: 100MB, Enterprise: 250MB
  // For MVP, using 10MB as default (matches UI hint)
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const validateFileSize = (file: File): { valid: boolean; error?: string } => {
    if (file.size > MAX_FILE_SIZE) {
      return {
        valid: false,
        error: `File size exceeds limit. Maximum size is ${formatFileSize(MAX_FILE_SIZE)}.`,
      };
    }
    return { valid: true };
  };

  const handleFileUpload = async (
    files: FileList | null,
    setFiles: React.Dispatch<React.SetStateAction<FileUpload[]>>,
  ) => {
    if (!files || files.length === 0) return;

    // Validate all files before adding
    const validFiles: File[] = [];
    for (const file of Array.from(files)) {
      const validation = validateFileSize(file);
      if (validation.valid) {
        validFiles.push(file);
      } else {
        setError(validation.error || 'File size exceeds limit.');
      }
    }

    if (validFiles.length === 0) return;

    const newFiles: FileUpload[] = validFiles.map((file) => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      file,
      name: file.name,
      size: formatFileSize(file.size),
      progress: 0,
      status: 'uploading' as const,
    }));

    setFiles((prev) => [...prev, ...newFiles]);

    // Simulate upload progress
    for (const fileUpload of newFiles) {
      simulateUpload(fileUpload, setFiles);
    }
  };

  const simulateUpload = (
    fileUpload: FileUpload,
    setFiles: React.Dispatch<React.SetStateAction<FileUpload[]>>,
  ) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        completeUpload(fileUpload, setFiles);
      }

      setFiles((prev) =>
        prev.map((f) => (f.id === fileUpload.id ? { ...f, progress } : f))
      );
    }, 300);
  };

  const completeUpload = (
    fileUpload: FileUpload,
    setFiles: React.Dispatch<React.SetStateAction<FileUpload[]>>,
  ) => {
    setFiles((prev) =>
      prev.map((f) =>
        f.id === fileUpload.id ? { ...f, progress: 100, status: 'complete' as const } : f
      )
    );
  };

  const removeFile = (id: string, setFiles: React.Dispatch<React.SetStateAction<FileUpload[]>>) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (
    e: React.DragEvent,
    setFiles: React.Dispatch<React.SetStateAction<FileUpload[]>>,
  ) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files, setFiles);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent,
    setFiles: React.Dispatch<React.SetStateAction<FileUpload[]>>,
    inputRef: React.RefObject<HTMLInputElement>
  ) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      inputRef.current?.click();
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (licenseFiles.length === 0) {
      setError('Please upload at least one professional license.');
      return;
    }

    const incompleteUploads = [...licenseFiles, ...certFiles].filter((f) => f.status !== 'complete');
    if (incompleteUploads.length > 0) {
      setError('Please wait for all files to finish uploading.');
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Call API to submit credentials when backend is ready
      // For now, just simulate success
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mark step 3 (Credentials) as complete
      try {
        await api.users.markProviderStepComplete({ requestBody: { step: 3 } });
      } catch (stepError) {
        console.error('[CredentialsPage] Error marking step 3 complete:', stepError);
        // Continue even if step marking fails
      }

      router.push('/onboarding/provider/credentials/complete');
    } catch (error: unknown) {
      setError(getErrorDisplayMessage(error, 'submit credentials'));
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-secondary p-6">
      <div className="mx-auto max-w-6xl animate-slide-up rounded-md border border-border-light bg-bg-primary shadow-md">
        {/* Header */}
        <div className="border-b border-border-light p-8">
          <div className="mb-6 flex gap-2">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`h-1 flex-1 rounded-sm transition-all duration-150 ${
                  step <= 4 ? 'bg-primary' : 'bg-border-light'
                }`}
              />
            ))}
          </div>
          <h1 className="mb-2 text-2xl font-bold tracking-tight">Professional Credentials</h1>
          <p className="text-sm text-text-secondary">Upload your licenses and certifications for verification</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8">
          {/* Error Message */}
          {error && (
            <div role="alert" className="mb-6 flex items-center gap-2 text-sm text-error">
              {error}
            </div>
          )}

          {/* Info Banner */}
          <div className="bg-primary/5 border-primary/10 mb-8 flex gap-4 rounded-base border p-4">
            <ShieldCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" aria-hidden="true" />
            <div className="flex-1">
              <strong className="mb-1 block text-sm font-semibold text-text-primary">
                Why we need this
              </strong>
              <p className="text-sm text-text-secondary">
                All providers are verified to ensure quality. Your credentials will be reviewed within 2-3 business days.
              </p>
            </div>
          </div>

          {/* Professional License Upload */}
          <div className="mb-8">
            <label className="mb-3 block flex items-center gap-1 text-sm font-medium">
              Professional License <span className="text-error">*</span>
            </label>

            <div
              role="button"
              tabIndex={0}
              aria-label="Upload professional license. Click or press Enter to select file. Drag and drop also supported."
              className={`mb-4 cursor-pointer rounded-base border-2 border-dashed p-8 text-center transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                isDragging
                  ? 'bg-primary/8 border-solid border-primary'
                  : 'hover:bg-primary/2 border-border-light hover:border-primary'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, setLicenseFiles)}
              onClick={() => licenseInputRef.current?.click()}
              onKeyDown={(e) => handleKeyDown(e, setLicenseFiles, licenseInputRef)}
            >
              <div className="bg-primary/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-base transition-transform duration-150">
                <Upload className="h-6 w-6 text-primary" aria-hidden="true" />
              </div>
              <div className="mb-1 text-base text-text-primary">
                <span className="font-medium text-primary">Click to upload</span> or drag and drop
              </div>
              <div className="text-xs text-text-tertiary">PDF, PNG, or JPEG (max 10MB)</div>
              <input
                ref={licenseInputRef}
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                className="hidden"
                onChange={(e) => handleFileUpload(e.target.files, setLicenseFiles)}
              />
            </div>

            {/* License Files List */}
            {licenseFiles.length > 0 && (
              <div className="flex flex-col gap-3" aria-live="polite" aria-atomic="false">
                {licenseFiles.map((fileUpload) => (
                  <div
                    key={fileUpload.id}
                    className="flex animate-[fileSlideIn_300ms_cubic-bezier(0.16,1,0.3,1)] items-center gap-4 rounded-base border border-border-light bg-bg-secondary p-4"
                  >
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md border border-border-light bg-bg-primary">
                      <FileText className="h-5 w-5 text-text-tertiary" aria-hidden="true" />
                    </div>
                    <div className="min-w-0 flex-1">
                      {fileUpload.status === 'uploading' ? (
                        <>
                          <div className="mb-2 truncate text-sm font-medium">{fileUpload.name}</div>
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 flex-1 overflow-hidden rounded-sm bg-border-light">
                              <div
                                className="h-full rounded-sm bg-primary transition-all duration-200"
                                style={{ width: `${fileUpload.progress}%` }}
                              />
                            </div>
                            <span className="min-w-[2.5rem] text-right text-xs font-medium text-text-tertiary">
                              {Math.round(fileUpload.progress)}%
                            </span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="mb-1 truncate text-sm font-medium">{fileUpload.name}</div>
                          <div className="text-xs text-text-tertiary">{fileUpload.size} • Uploaded just now</div>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {fileUpload.status === 'complete' ? (
                        <div className="flex items-center gap-2 text-xs font-medium text-success">
                          <CheckCircle className="h-4 w-4" aria-hidden="true" />
                          <span>Uploaded</span>
                        </div>
                      ) : fileUpload.status === 'uploading' ? (
                        <div className="flex items-center gap-2 text-xs font-medium text-primary">
                          <Loader className="h-4 w-4 animate-spin" aria-hidden="true" />
                          <span>Uploading</span>
                        </div>
                      ) : null}
                      <button
                        type="button"
                        onClick={() => removeFile(fileUpload.id, setLicenseFiles)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            removeFile(fileUpload.id, setLicenseFiles);
                          }
                        }}
                        aria-label={`Remove ${fileUpload.name}`}
                        className="cursor-pointer rounded-md border-none bg-transparent p-2 text-error transition-all duration-150 hover:bg-error/10 focus:outline-none focus:ring-2 focus:ring-error focus:ring-offset-2"
                      >
                        <X className="h-4.5 w-4.5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Additional Certifications Upload */}
          <div className="mb-8">
            <label className="mb-3 block text-sm font-medium">
              Additional Certifications (Optional)
            </label>

            <div
              role="button"
              tabIndex={0}
              aria-label="Upload additional certifications. Click or press Enter to select files. Drag and drop also supported."
              className={`mb-4 cursor-pointer rounded-base border-2 border-dashed p-8 text-center transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                isDragging
                  ? 'bg-primary/8 border-solid border-primary'
                  : 'hover:bg-primary/2 border-border-light hover:border-primary'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, setCertFiles)}
              onClick={() => certInputRef.current?.click()}
              onKeyDown={(e) => handleKeyDown(e, setCertFiles, certInputRef)}
            >
              <div className="bg-primary/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-base transition-transform duration-150">
                <Upload className="h-6 w-6 text-primary" aria-hidden="true" />
              </div>
              <div className="mb-1 text-base text-text-primary">
                <span className="font-medium text-primary">Click to upload</span> or drag and drop
              </div>
              <div className="text-xs text-text-tertiary">Multiple files allowed • PDF, PNG, or JPEG (max 10MB each)</div>
              <input
                ref={certInputRef}
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                multiple
                className="hidden"
                onChange={(e) => handleFileUpload(e.target.files, setCertFiles)}
              />
            </div>

            {/* Cert Files List */}
            {certFiles.length > 0 && (
              <div className="flex flex-col gap-3" aria-live="polite" aria-atomic="false">
                {certFiles.map((fileUpload) => (
                  <div
                    key={fileUpload.id}
                    className="flex animate-[fileSlideIn_300ms_cubic-bezier(0.16,1,0.3,1)] items-center gap-4 rounded-base border border-border-light bg-bg-secondary p-4"
                  >
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md border border-border-light bg-bg-primary">
                      <FileText className="h-5 w-5 text-text-tertiary" aria-hidden="true" />
                    </div>
                    <div className="min-w-0 flex-1">
                      {fileUpload.status === 'uploading' ? (
                        <>
                          <div className="mb-2 truncate text-sm font-medium">{fileUpload.name}</div>
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 flex-1 overflow-hidden rounded-sm bg-border-light">
                              <div
                                className="h-full rounded-sm bg-primary transition-all duration-200"
                                style={{ width: `${fileUpload.progress}%` }}
                              />
                            </div>
                            <span className="min-w-[2.5rem] text-right text-xs font-medium text-text-tertiary">
                              {Math.round(fileUpload.progress)}%
                            </span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="mb-1 truncate text-sm font-medium">{fileUpload.name}</div>
                          <div className="text-xs text-text-tertiary">{fileUpload.size} • Uploaded just now</div>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {fileUpload.status === 'complete' ? (
                        <div className="flex items-center gap-2 text-xs font-medium text-success">
                          <CheckCircle className="h-4 w-4" aria-hidden="true" />
                          <span>Uploaded</span>
                        </div>
                      ) : fileUpload.status === 'uploading' ? (
                        <div className="flex items-center gap-2 text-xs font-medium text-primary">
                          <Loader className="h-4 w-4 animate-spin" aria-hidden="true" />
                          <span>Uploading</span>
                        </div>
                      ) : null}
                      <button
                        type="button"
                        onClick={() => removeFile(fileUpload.id, setCertFiles)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            removeFile(fileUpload.id, setCertFiles);
                          }
                        }}
                        aria-label={`Remove ${fileUpload.name}`}
                        className="cursor-pointer rounded-md border-none bg-transparent p-2 text-error transition-all duration-150 hover:bg-error/10 focus:outline-none focus:ring-2 focus:ring-error focus:ring-offset-2"
                      >
                        <X className="h-4.5 w-4.5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-between gap-4 border-t border-border-light pt-6">
            <button
              type="button"
              onClick={() => router.push('/onboarding/provider/services')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  router.push('/onboarding/provider/services');
                }
              }}
              aria-label="Go back to previous step"
              className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-base border border-border-light bg-bg-secondary px-6 text-base font-medium text-text-primary transition-all duration-150 hover:bg-bg-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              <ArrowLeft className="h-4.5 w-4.5" aria-hidden="true" />
              Back
            </button>
            <button
              type="submit"
              disabled={isLoading || licenseFiles.length === 0 || licenseFiles.some((f) => f.status !== 'complete')}
              aria-label={isLoading ? 'Submitting credentials' : 'Submit credentials for review'}
              aria-disabled={isLoading || licenseFiles.length === 0 || licenseFiles.some((f) => f.status !== 'complete')}
              className={`inline-flex h-11 cursor-pointer items-center gap-2 rounded-base px-6 text-base font-medium text-white shadow-xs transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                isLoading || licenseFiles.length === 0 || licenseFiles.some((f) => f.status !== 'complete')
                  ? 'cursor-not-allowed opacity-60'
                  : 'bg-gradient-to-b from-primary to-primary-hover'
              }`}
            >
              {isLoading ? (
                <>
                  <Loader className="h-4.5 w-4.5 animate-spin" aria-hidden="true" />
                  <span>{LOADING_SAVING}</span>
                </>
              ) : (
                <>
                  <span>Submit for Review</span>
                  <ArrowRight className="h-4.5 w-4.5" aria-hidden="true" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fileSlideIn {
          from {
            opacity: 0;
            transform: translateX(-12px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
      <Footer />
    </div>
  );
}

