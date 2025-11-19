'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Plus, Trash2, Loader } from 'lucide-react';
import { api } from '@visaontrack/client';

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
      <div className="max-w-6xl mx-auto bg-bg-primary border border-border-light rounded-md shadow-md animate-[slideUp_300ms_cubic-bezier(0.16,1,0.3,1)]">
        {/* Header */}
        <div className="p-8 border-b border-border-light">
          <div className="flex gap-2 mb-6">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`flex-1 h-1 rounded-sm transition-all duration-150 ${
                  step <= 3 ? 'bg-primary' : 'bg-border-light'
                }`}
              />
            ))}
          </div>
          <h1 className="text-2xl font-bold tracking-tight mb-2">Services & Pricing</h1>
          <p className="text-sm text-text-secondary">List the visa services you offer and set your pricing</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8">
          {/* Error Message */}
          {error && (
            <div role="alert" className="mb-6 text-sm text-error flex items-center gap-2">
              {error}
            </div>
          )}

          {/* Services List */}
          <div className="space-y-4 mb-6">
            {services.map((service, index) => (
              <div
                key={service.id}
                className="p-6 bg-bg-secondary border border-border-light rounded-base transition-colors duration-150 animate-[fadeInUp_400ms_cubic-bezier(0.16,1,0.3,1)_both] hover:border-border-medium"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="inline-flex items-center justify-center w-8 h-8 bg-primary text-white rounded-md text-sm font-semibold">
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
                      className="p-2 text-error bg-transparent border border-error/20 rounded-md cursor-pointer transition-all duration-150 hover:bg-error/10 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-error focus:ring-offset-2"
                    >
                      <Trash2 className="w-4 h-4" aria-hidden="true" />
                    </button>
                  )}
                </div>

                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <label htmlFor={`service-name-${service.id}`} className="text-sm font-medium flex items-center gap-1">
                      Service Name <span className="text-error">*</span>
                    </label>
                    <input
                      type="text"
                      id={`service-name-${service.id}`}
                      value={service.name}
                      onChange={(e) => updateService(service.id, 'name', e.target.value)}
                      className="w-full h-11 px-4 text-base font-sans text-text-primary bg-bg-primary border border-border-light rounded-base transition-all duration-150 outline-none hover:border-border-medium focus:border-primary focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)] focus:scale-[1.005]"
                      placeholder="e.g., Marriage Visa Application"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-6">
                    <div className="flex flex-col gap-2">
                      <label htmlFor={`service-price-${service.id}`} className="text-sm font-medium flex items-center gap-1">
                        Base Price <span className="text-error">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-base font-medium text-text-tertiary pointer-events-none">
                          ฿
                        </span>
                        <input
                          type="number"
                          id={`service-price-${service.id}`}
                          value={service.price}
                          onChange={(e) => updateService(service.id, 'price', e.target.value)}
                          className="w-full h-11 pl-10 pr-4 text-base font-sans text-text-primary bg-bg-primary border border-border-light rounded-base transition-all duration-150 outline-none hover:border-border-medium focus:border-primary focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)] focus:scale-[1.005]"
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
                        className="w-full h-11 px-4 text-base font-sans text-text-primary bg-bg-primary border border-border-light rounded-base transition-all duration-150 outline-none hover:border-border-medium focus:border-primary focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)] focus:scale-[1.005]"
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
                      className="w-full min-h-[4rem] px-4 py-3 text-base font-sans text-text-primary bg-bg-primary border border-border-light rounded-base transition-all duration-150 outline-none hover:border-border-medium focus:border-primary focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)] focus:scale-[1.005] resize-y"
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
            className="w-full h-11 px-6 text-base font-medium text-primary bg-primary/5 border border-dashed border-primary rounded-base cursor-pointer transition-all duration-150 inline-flex items-center justify-center gap-2 hover:bg-primary/10 hover:scale-[1.02] animate-[fadeInUp_400ms_cubic-bezier(0.16,1,0.3,1)_200ms_both] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            <Plus className="w-4.5 h-4.5" aria-hidden="true" />
            Add another service
          </button>

          {/* Actions */}
          <div className="pt-6 mt-8 border-t border-border-light flex justify-between gap-4">
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
              className="h-11 px-6 text-base font-medium text-text-primary bg-bg-secondary border border-border-light rounded-base cursor-pointer transition-all duration-150 inline-flex items-center gap-2 hover:bg-bg-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              <ArrowLeft className="w-4.5 h-4.5" aria-hidden="true" />
              Back
            </button>
            <button
              type="submit"
              disabled={isLoading}
              aria-label={isLoading ? 'Saving services' : 'Continue to next step'}
              aria-disabled={isLoading}
              className={`h-11 px-6 text-base font-medium text-white rounded-base cursor-pointer transition-all duration-200 shadow-xs inline-flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                isLoading
                  ? 'opacity-60 cursor-not-allowed'
                  : 'bg-gradient-to-b from-primary to-primary-hover hover:shadow-md hover:shadow-primary/15'
              }`}
            >
              {isLoading ? (
                <>
                  <Loader className="w-4.5 h-4.5 animate-spin" aria-hidden="true" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <span>Continue</span>
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
    </div>
  );
}

