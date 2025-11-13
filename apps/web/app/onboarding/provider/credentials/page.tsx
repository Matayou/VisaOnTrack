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
      if (error instanceof Error) {
        setError(error.message || 'An error occurred. Please try again.');
      } else {
        setError('An error occurred. Please try again.');
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-secondary p-6">
      <div className="max-w-[48rem] mx-auto bg-bg-primary border border-border-light rounded-md shadow-md animate-[slideUp_300ms_cubic-bezier(0.16,1,0.3,1)]">
        {/* Header */}
        <div className="p-8 border-b border-border-light">
          <div className="flex gap-2 mb-6">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`flex-1 h-1 rounded-sm transition-all duration-150 ${
                  step <= 4 ? 'bg-primary' : 'bg-border-light'
                }`}
              />
            ))}
          </div>
          <h1 className="text-2xl font-bold tracking-tight mb-2">Professional Credentials</h1>
          <p className="text-sm text-text-secondary">Upload your licenses and certifications for verification</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8">
          {/* Error Message */}
          {error && (
            <div role="alert" className="mb-6 text-sm text-error flex items-center gap-2">
              {error}
            </div>
          )}

          {/* Info Banner */}
          <div className="flex gap-4 p-4 bg-primary/5 border border-primary/10 rounded-base mb-8">
            <ShieldCheck className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" aria-hidden="true" />
            <div className="flex-1">
              <strong className="text-sm font-semibold text-text-primary block mb-1">
                Why we need this
              </strong>
              <p className="text-sm text-text-secondary">
                All providers are verified to ensure quality. Your credentials will be reviewed within 2-3 business days.
              </p>
            </div>
          </div>

          {/* Professional License Upload */}
          <div className="mb-8">
            <label className="text-sm font-medium mb-3 block flex items-center gap-1">
              Professional License <span className="text-error">*</span>
            </label>

            <div
              role="button"
              tabIndex={0}
              aria-label="Upload professional license. Click or press Enter to select file. Drag and drop also supported."
              className={`border-2 border-dashed rounded-base p-8 text-center cursor-pointer transition-all duration-150 mb-4 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                isDragging
                  ? 'border-primary bg-primary/8 border-solid scale-[1.02]'
                  : 'border-border-light hover:border-primary hover:bg-primary/2'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, setLicenseFiles)}
              onClick={() => licenseInputRef.current?.click()}
              onKeyDown={(e) => handleKeyDown(e, setLicenseFiles, licenseInputRef)}
            >
              <div className="w-12 h-12 bg-primary/10 rounded-base flex items-center justify-center mb-4 mx-auto transition-transform duration-150">
                <Upload className="w-6 h-6 text-primary" aria-hidden="true" />
              </div>
              <div className="text-base text-text-primary mb-1">
                <span className="text-primary font-medium">Click to upload</span> or drag and drop
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
                    className="flex items-center gap-4 p-4 bg-bg-secondary border border-border-light rounded-base animate-[fileSlideIn_300ms_cubic-bezier(0.16,1,0.3,1)]"
                  >
                    <div className="w-10 h-10 bg-bg-primary border border-border-light rounded-md flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-text-tertiary" aria-hidden="true" />
                    </div>
                    <div className="flex-1 min-w-0">
                      {fileUpload.status === 'uploading' ? (
                        <>
                          <div className="text-sm font-medium mb-2 truncate">{fileUpload.name}</div>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-border-light rounded-sm overflow-hidden">
                              <div
                                className="h-full bg-primary rounded-sm transition-all duration-200"
                                style={{ width: `${fileUpload.progress}%` }}
                              />
                            </div>
                            <span className="text-xs text-text-tertiary font-medium min-w-[2.5rem] text-right">
                              {Math.round(fileUpload.progress)}%
                            </span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="text-sm font-medium mb-1 truncate">{fileUpload.name}</div>
                          <div className="text-xs text-text-tertiary">{fileUpload.size} • Uploaded just now</div>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {fileUpload.status === 'complete' ? (
                        <div className="flex items-center gap-2 text-xs font-medium text-success">
                          <CheckCircle className="w-4 h-4" aria-hidden="true" />
                          <span>Uploaded</span>
                        </div>
                      ) : fileUpload.status === 'uploading' ? (
                        <div className="flex items-center gap-2 text-xs font-medium text-primary">
                          <Loader className="w-4 h-4 animate-spin" aria-hidden="true" />
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
                        className="p-2 text-error bg-transparent border-none rounded-md cursor-pointer transition-all duration-150 hover:bg-error/10 focus:outline-none focus:ring-2 focus:ring-error focus:ring-offset-2"
                      >
                        <X className="w-4.5 h-4.5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Additional Certifications Upload */}
          <div className="mb-8">
            <label className="text-sm font-medium mb-3 block">
              Additional Certifications (Optional)
            </label>

            <div
              role="button"
              tabIndex={0}
              aria-label="Upload additional certifications. Click or press Enter to select files. Drag and drop also supported."
              className={`border-2 border-dashed rounded-base p-8 text-center cursor-pointer transition-all duration-150 mb-4 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                isDragging
                  ? 'border-primary bg-primary/8 border-solid scale-[1.02]'
                  : 'border-border-light hover:border-primary hover:bg-primary/2'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, setCertFiles)}
              onClick={() => certInputRef.current?.click()}
              onKeyDown={(e) => handleKeyDown(e, setCertFiles, certInputRef)}
            >
              <div className="w-12 h-12 bg-primary/10 rounded-base flex items-center justify-center mb-4 mx-auto transition-transform duration-150">
                <Upload className="w-6 h-6 text-primary" aria-hidden="true" />
              </div>
              <div className="text-base text-text-primary mb-1">
                <span className="text-primary font-medium">Click to upload</span> or drag and drop
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
                    className="flex items-center gap-4 p-4 bg-bg-secondary border border-border-light rounded-base animate-[fileSlideIn_300ms_cubic-bezier(0.16,1,0.3,1)]"
                  >
                    <div className="w-10 h-10 bg-bg-primary border border-border-light rounded-md flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-text-tertiary" aria-hidden="true" />
                    </div>
                    <div className="flex-1 min-w-0">
                      {fileUpload.status === 'uploading' ? (
                        <>
                          <div className="text-sm font-medium mb-2 truncate">{fileUpload.name}</div>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-border-light rounded-sm overflow-hidden">
                              <div
                                className="h-full bg-primary rounded-sm transition-all duration-200"
                                style={{ width: `${fileUpload.progress}%` }}
                              />
                            </div>
                            <span className="text-xs text-text-tertiary font-medium min-w-[2.5rem] text-right">
                              {Math.round(fileUpload.progress)}%
                            </span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="text-sm font-medium mb-1 truncate">{fileUpload.name}</div>
                          <div className="text-xs text-text-tertiary">{fileUpload.size} • Uploaded just now</div>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {fileUpload.status === 'complete' ? (
                        <div className="flex items-center gap-2 text-xs font-medium text-success">
                          <CheckCircle className="w-4 h-4" aria-hidden="true" />
                          <span>Uploaded</span>
                        </div>
                      ) : fileUpload.status === 'uploading' ? (
                        <div className="flex items-center gap-2 text-xs font-medium text-primary">
                          <Loader className="w-4 h-4 animate-spin" aria-hidden="true" />
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
                        className="p-2 text-error bg-transparent border-none rounded-md cursor-pointer transition-all duration-150 hover:bg-error/10 focus:outline-none focus:ring-2 focus:ring-error focus:ring-offset-2"
                      >
                        <X className="w-4.5 h-4.5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="pt-6 border-t border-border-light flex justify-between gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  router.back();
                }
              }}
              aria-label="Go back to previous step"
              className="h-11 px-6 text-base font-medium text-text-primary bg-bg-secondary border border-border-light rounded-base cursor-pointer transition-all duration-150 inline-flex items-center gap-2 hover:bg-bg-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              <ArrowLeft className="w-4.5 h-4.5" aria-hidden="true" />
              Back
            </button>
            <button
              type="submit"
              disabled={isLoading || licenseFiles.length === 0 || licenseFiles.some((f) => f.status !== 'complete')}
              aria-label={isLoading ? 'Submitting credentials' : 'Submit credentials for review'}
              aria-disabled={isLoading || licenseFiles.length === 0 || licenseFiles.some((f) => f.status !== 'complete')}
              className={`h-11 px-6 text-base font-medium text-white rounded-base cursor-pointer transition-all duration-150 shadow-xs inline-flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                isLoading || licenseFiles.length === 0 || licenseFiles.some((f) => f.status !== 'complete')
                  ? 'opacity-60 cursor-not-allowed'
                  : 'bg-gradient-to-b from-primary to-primary-hover hover:-translate-y-px hover:shadow-[0_4px_12px_rgba(37,99,235,0.2)] active:translate-y-0'
              }`}
            >
              {isLoading ? (
                <>
                  <Loader className="w-4.5 h-4.5 animate-spin" aria-hidden="true" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <span>Submit for Review</span>
                  <ArrowRight className="w-4.5 h-4.5" aria-hidden="true" />
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
    </div>
  );
}

