'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Plus, Trash2, Loader } from 'lucide-react';
import { api } from '@visaontrack/client';
import { ProviderHeader } from '@/components/ProviderHeader';
import { LOADING_SAVING } from '@/lib/loading-messages';
import { Footer } from '@/components/ui';
import { getErrorDisplayMessage } from '@/lib/error-handling';

interface Service {
  id: string;
  name: string;
  price: string;
  duration: string;
  description: string;
}

export default function ServicesPricingPage() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([
    {
      id: '1',
      name: 'Marriage Visa Application',
      price: '25000',
      duration: '4-6 weeks',
      description: 'Complete application process including document preparation, form filing, and immigration office representation',
    },
    {
      id: '2',
      name: 'Retirement Visa Extension',
      price: '15000',
      duration: '2-3 weeks',
      description: 'Annual retirement visa extension with full document preparation and immigration assistance',
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addService = () => {
    const newService: Service = {
      id: Date.now().toString(),
      name: '',
      price: '',
      duration: '',
      description: '',
    };
    setServices([...services, newService]);
  };

  const removeService = (id: string) => {
    if (services.length > 1) {
      setServices(services.filter((service) => service.id !== id));
    }
  };

  const updateService = (id: string, field: keyof Service, value: string) => {
    setServices(services.map((service) => (service.id === id ? { ...service, [field]: value } : service)));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Validate services
    const invalidServices = services.filter((s) => !s.name || !s.price);
    if (invalidServices.length > 0) {
      setError('Please fill in all required fields for all services.');
      setIsLoading(false);
      return;
    }

    try {
      // TODO: Call API to save services when backend is ready
      // For now, just simulate success
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mark step 2 (Services) as complete
      try {
        await api.users.markProviderStepComplete({ requestBody: { step: 2 } });
      } catch (stepError) {
        console.error('[ServicesPage] Error marking step 2 complete:', stepError);
        // Continue even if step marking fails
      }

      router.push('/onboarding/provider/credentials');
    } catch (error: unknown) {
      setError(getErrorDisplayMessage(error, 'save services'));
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-secondary">
      <ProviderHeader />
      <div className="p-6">
        <div className="mx-auto max-w-6xl animate-slide-up rounded-md border border-border-light bg-bg-primary shadow-md">
        {/* Header */}
        <div className="border-b border-border-light p-8">
          <div className="mb-6 flex gap-2">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`h-1 flex-1 rounded-sm transition-all duration-150 ${
                  step <= 3 ? 'bg-primary' : 'bg-border-light'
                }`}
              />
            ))}
          </div>
          <h1 className="mb-2 text-2xl font-bold tracking-tight">Services & Pricing</h1>
          <p className="text-sm text-text-secondary">List the visa services you offer and set your pricing</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8">
          {/* Error Message */}
          {error && (
            <div role="alert" className="mb-6 flex items-center gap-2 text-sm text-error">
              {error}
            </div>
          )}

          {/* Services List */}
          <div className="mb-6 space-y-4">
            {services.map((service, index) => (
              <div
                key={service.id}
                className="animate-[fadeInUp_400ms_cubic-bezier(0.16,1,0.3,1)_both] rounded-base border border-border-light bg-bg-secondary p-6 transition-colors duration-150 hover:border-border-medium"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="mb-6 flex items-start justify-between">
                  <div className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-primary text-sm font-semibold text-white">
                    {index + 1}
                  </div>
                  {services.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeService(service.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          removeService(service.id);
                        }
                      }}
                      aria-label={`Remove service ${index + 1}: ${service.name || 'Unnamed service'}`}
                      className="cursor-pointer rounded-md border border-error/20 bg-transparent p-2 text-error transition-all duration-150 hover:bg-error/10 focus:outline-none focus:ring-2 focus:ring-error focus:ring-offset-2"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </button>
                  )}
                </div>

                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <label htmlFor={`service-name-${service.id}`} className="flex items-center gap-1 text-sm font-medium">
                      Service Name <span className="text-error">*</span>
                    </label>
                    <input
                      type="text"
                      id={`service-name-${service.id}`}
                      value={service.name}
                      onChange={(e) => updateService(service.id, 'name', e.target.value)}
                      className="h-12 w-full rounded-base border border-border-light bg-bg-primary px-4 font-sans text-base text-text-primary outline-none transition-all duration-150 hover:border-border-medium focus:border-primary focus:shadow-focus-primary"
                      placeholder="e.g., Marriage Visa Application"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-[2fr_1fr]">
                    <div className="flex flex-col gap-2">
                      <label htmlFor={`service-price-${service.id}`} className="flex items-center gap-1 text-sm font-medium">
                        Base Price <span className="text-error">*</span>
                      </label>
                      <div className="relative">
                        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-base font-medium text-text-tertiary">
                          ฿
                        </span>
                        <input
                          type="number"
                          id={`service-price-${service.id}`}
                          value={service.price}
                          onChange={(e) => updateService(service.id, 'price', e.target.value)}
                          className="h-12 w-full rounded-base border border-border-light bg-bg-primary pl-10 pr-4 font-sans text-base text-text-primary outline-none transition-all duration-150 hover:border-border-medium focus:border-primary focus:shadow-focus-primary"
                          placeholder="25,000"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label htmlFor={`service-duration-${service.id}`} className="text-sm font-medium">
                        Typical Duration
                      </label>
                      <input
                        type="text"
                        id={`service-duration-${service.id}`}
                        value={service.duration}
                        onChange={(e) => updateService(service.id, 'duration', e.target.value)}
                        className="h-12 w-full rounded-base border border-border-light bg-bg-primary px-4 font-sans text-base text-text-primary outline-none transition-all duration-150 hover:border-border-medium focus:border-primary focus:shadow-focus-primary"
                        placeholder="4-6 weeks"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor={`service-description-${service.id}`} className="text-sm font-medium">
                      Description
                    </label>
                    <textarea
                      id={`service-description-${service.id}`}
                      value={service.description}
                      onChange={(e) => updateService(service.id, 'description', e.target.value)}
                      className="min-h-[4rem] w-full resize-y rounded-base border border-border-light bg-bg-primary px-4 py-3 font-sans text-base text-text-primary outline-none transition-all duration-150 hover:border-border-medium focus:border-primary focus:shadow-focus-primary"
                      placeholder="Describe what's included in this service..."
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Service Button */}
          <button
            type="button"
            onClick={addService}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                addService();
              }
            }}
            aria-label="Add another service"
            className="bg-primary/5 hover:bg-primary/10 inline-flex h-11 w-full animate-[fadeInUp_400ms_cubic-bezier(0.16,1,0.3,1)_200ms_both] cursor-pointer items-center justify-center gap-2 rounded-base border border-dashed border-primary px-6 text-base font-medium text-primary transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            <Plus className="h-4.5 w-4.5" aria-hidden="true" />
            Add another service
          </button>

          {/* Actions */}
          <div className="mt-8 flex justify-between gap-4 border-t border-border-light pt-6">
            <button
              type="button"
              onClick={() => router.push('/onboarding/provider/business')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  router.push('/onboarding/provider/business');
                }
              }}
              aria-label="Go back to business details step"
              className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-base border border-border-light bg-bg-secondary px-6 text-base font-medium text-text-primary transition-all duration-150 hover:bg-bg-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              <ArrowLeft className="h-4.5 w-4.5" aria-hidden="true" />
              Back
            </button>
            <button
              type="submit"
              disabled={isLoading}
              aria-label={isLoading ? 'Saving services' : 'Continue to next step'}
              aria-disabled={isLoading}
              className={`inline-flex h-11 cursor-pointer items-center gap-2 rounded-base px-6 text-base font-medium text-white shadow-xs transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                isLoading
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
                  <span>Continue</span>
                  <ArrowRight className="h-4.5 w-4.5" aria-hidden="true" />
                </>
              )}
            </button>
          </div>
        </form>
        </div>
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

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
      <Footer />
    </div>
  );
}

