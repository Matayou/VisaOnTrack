'use client';

import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Upload,
  FileText,
  X,
  CheckCircle,
  Loader,
  ShieldCheck,
  AlertCircle,
  Image as ImageIcon,
  File,
} from 'lucide-react';
import { api } from '@visaontrack/client';
import { OnboardingLayout } from '@/components/onboarding';
import { Button, Card, Toast } from '@/components/ui';
import { LOADING_SAVING } from '@/lib/loading-messages';
import { getErrorDisplayMessage } from '@/lib/error-handling';

interface FileUpload {
  id: string;
  file: File;
  name: string;
  size: string;
  progress: number;
  status: 'uploading' | 'complete' | 'error';
  type: 'pdf' | 'image';
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export default function CredentialsPage() {
  const router = useRouter();
  const licenseInputRef = useRef<HTMLInputElement>(null);
  const certInputRef = useRef<HTMLInputElement>(null);
  const [licenseFiles, setLicenseFiles] = useState<FileUpload[]>([]);
  const [certFiles, setCertFiles] = useState<FileUpload[]>([]);
  const [isDraggingLicense, setIsDraggingLicense] = useState(false);
  const [isDraggingCert, setIsDraggingCert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getFileType = (file: File): 'pdf' | 'image' => {
    if (file.type === 'application/pdf') return 'pdf';
    return 'image';
  };

  const handleFileUpload = useCallback(async (
    files: FileList | null,
    setFiles: React.Dispatch<React.SetStateAction<FileUpload[]>>,
  ) => {
    if (!files || files.length === 0) return;

    const validFiles: File[] = [];
    for (const file of Array.from(files)) {
      if (file.size > MAX_FILE_SIZE) {
        setError(`File "${file.name}" exceeds the 10MB limit.`);
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    const newFiles: FileUpload[] = validFiles.map((file) => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      file,
      name: file.name,
      size: formatFileSize(file.size),
      progress: 0,
      status: 'uploading' as const,
      type: getFileType(file),
    }));

    setFiles((prev) => [...prev, ...newFiles]);

    // Simulate upload progress for each file
    for (const fileUpload of newFiles) {
      simulateUpload(fileUpload, setFiles);
    }
  }, []);

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
        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileUpload.id ? { ...f, progress: 100, status: 'complete' as const } : f
          )
        );
      } else {
        setFiles((prev) =>
          prev.map((f) => (f.id === fileUpload.id ? { ...f, progress } : f))
        );
      }
    }, 200);
  };

  const removeFile = (id: string, setFiles: React.Dispatch<React.SetStateAction<FileUpload[]>>) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
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
      await new Promise((resolve) => setTimeout(resolve, 1000));

      try {
        await api.users.markProviderStepComplete({ requestBody: { step: 3 } });
      } catch (stepError) {
        console.error('[CredentialsPage] Error marking step 3 complete:', stepError);
      }

      router.push('/onboarding/provider/credentials/complete');
    } catch (error: unknown) {
      setError(getErrorDisplayMessage(error, 'submit credentials'));
      setIsLoading(false);
    }
  };

  const FileUploadZone = ({
    label,
    required,
    hint,
    files,
    setFiles,
    inputRef,
    isDragging,
    setIsDragging,
    multiple = false,
  }: {
    label: string;
    required?: boolean;
    hint: string;
    files: FileUpload[];
    setFiles: React.Dispatch<React.SetStateAction<FileUpload[]>>;
    inputRef: React.RefObject<HTMLInputElement>;
    isDragging: boolean;
    setIsDragging: (dragging: boolean) => void;
    multiple?: boolean;
  }) => (
    <div className="space-y-3">
      <label className="flex items-center gap-1 text-sm font-semibold text-text-primary">
        {label}
        {required && <span className="text-error">*</span>}
      </label>

      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFileUpload(e.dataTransfer.files, setFiles);
        }}
        className={`group cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
          isDragging
            ? 'bg-primary/10 border-primary'
            : 'hover:border-primary/50 hover:bg-primary/5 border-border-light'
        }`}
      >
        <div className="bg-primary/10 mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full transition-transform group-hover:scale-105">
          <Upload className="h-6 w-6 text-primary" aria-hidden="true" />
        </div>
        <div className="mb-1 text-sm">
          <span className="font-medium text-primary">Click to upload</span>
          <span className="text-text-secondary"> or drag and drop</span>
        </div>
        <div className="text-xs text-text-tertiary">{hint}</div>
        <input
          ref={inputRef as React.RefObject<HTMLInputElement>}
          type="file"
          accept=".pdf,.png,.jpg,.jpeg"
          multiple={multiple}
          className="hidden"
          onChange={(e) => handleFileUpload(e.target.files, setFiles)}
        />
      </div>

      {/* Files List */}
      {files.length > 0 && (
        <div className="space-y-2" aria-live="polite">
          {files.map((fileUpload) => (
            <div
              key={fileUpload.id}
              className="flex animate-fade-in-up items-center gap-3 rounded-lg border border-border-light bg-bg-secondary p-3"
            >
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md border border-border-light bg-bg-primary">
                {fileUpload.type === 'pdf' ? (
                  <FileText className="h-5 w-5 text-error" aria-hidden="true" />
                ) : (
                  <ImageIcon className="h-5 w-5 text-primary" aria-hidden="true" />
                )}
              </div>
              
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium text-text-primary">{fileUpload.name}</div>
                {fileUpload.status === 'uploading' ? (
                  <div className="mt-1.5 flex items-center gap-2">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-border-light">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-200"
                        style={{ width: `${fileUpload.progress}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-text-tertiary">
                      {Math.round(fileUpload.progress)}%
                    </span>
                  </div>
                ) : (
                  <div className="text-xs text-text-tertiary">{fileUpload.size}</div>
                )}
              </div>

              <div className="flex items-center gap-2">
                {fileUpload.status === 'complete' && (
                  <div className="flex items-center gap-1 text-xs font-medium text-success">
                    <CheckCircle className="h-4 w-4" aria-hidden="true" />
                  </div>
                )}
                {fileUpload.status === 'uploading' && (
                  <Loader className="h-4 w-4 animate-spin text-primary" aria-hidden="true" />
                )}
                <button
                  type="button"
                  onClick={() => removeFile(fileUpload.id, setFiles)}
                  className="rounded-md p-1.5 text-text-tertiary transition-colors hover:bg-error/10 hover:text-error"
                  aria-label={`Remove ${fileUpload.name}`}
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const licenseComplete = licenseFiles.length > 0 && licenseFiles.every(f => f.status === 'complete');

  return (
    <OnboardingLayout
      currentStep={3}
      title="Professional Credentials"
      subtitle="Upload your licenses and certifications for verification"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Error Message */}
        {error && (
          <Toast variant="error" title="Upload Error" description={error} />
        )}

        {/* Info Banner */}
        <Card padding="md" className="border-primary/20 from-primary/5 bg-gradient-to-r to-transparent">
          <div className="flex gap-4">
            <div className="bg-primary/10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full">
              <ShieldCheck className="h-5 w-5 text-primary" aria-hidden="true" />
            </div>
            <div className="flex-1">
              <h3 className="mb-1 text-sm font-semibold text-text-primary">
                Why we verify credentials
              </h3>
              <p className="text-sm text-text-secondary">
                All providers are verified to ensure quality and trust. Your credentials will be reviewed within 1-2 business days. We&apos;ll email you once approved.
              </p>
            </div>
          </div>
        </Card>

        {/* Professional License */}
        <Card padding="md" elevated>
          <div className="mb-4 flex items-center gap-2">
            <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full">
              <File className="h-4 w-4 text-primary" aria-hidden="true" />
            </div>
            <span className="text-base font-semibold text-text-primary">Professional License</span>
            {licenseComplete && (
              <span className="bg-success/10 ml-auto flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium text-success">
                <CheckCircle className="h-3 w-3" /> Uploaded
              </span>
            )}
          </div>
          <FileUploadZone
            label="Upload your professional license"
            required
            hint="PDF, PNG, or JPEG (max 10MB)"
            files={licenseFiles}
            setFiles={setLicenseFiles}
            inputRef={licenseInputRef}
            isDragging={isDraggingLicense}
            setIsDragging={setIsDraggingLicense}
          />
        </Card>

        {/* Additional Certifications */}
        <Card padding="md" elevated>
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-bg-tertiary">
              <ShieldCheck className="h-4 w-4 text-text-tertiary" aria-hidden="true" />
            </div>
            <span className="text-base font-semibold text-text-primary">Additional Certifications</span>
            <span className="ml-2 text-xs text-text-tertiary">(Optional)</span>
          </div>
          <FileUploadZone
            label="Upload additional certifications"
            hint="Multiple files allowed • PDF, PNG, or JPEG (max 10MB each)"
            files={certFiles}
            setFiles={setCertFiles}
            inputRef={certInputRef}
            isDragging={isDraggingCert}
            setIsDragging={setIsDraggingCert}
            multiple
          />
        </Card>

        {/* Actions */}
        <Card padding="md" elevated className="bg-bg-primary/95 sticky bottom-4 z-10 backdrop-blur">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-sm">
              {licenseComplete ? (
                <span className="flex items-center gap-1 font-medium text-success">
                  <CheckCircle className="h-4 w-4" /> Ready to submit
                </span>
              ) : (
                <span className="flex items-center gap-1 text-text-tertiary">
                  <AlertCircle className="h-4 w-4" /> Upload professional license to continue
                </span>
              )}
            </div>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/onboarding/provider/services')}
              >
                Back
              </Button>
              <Button
                type="submit"
                disabled={isLoading || !licenseComplete}
                loading={isLoading}
              >
                {isLoading ? LOADING_SAVING : 'Submit for Review'}
              </Button>
            </div>
          </div>
        </Card>
      </form>
    </OnboardingLayout>
  );
}
