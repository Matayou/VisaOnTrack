'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, Package, DollarSign, Clock, FileText, Sparkles } from 'lucide-react';
import { api } from '@visaontrack/client';
import { OnboardingLayout } from '@/components/onboarding';
import { Button, Card, Toast } from '@/components/ui';
import { LOADING_SAVING } from '@/lib/loading-messages';
import { getErrorDisplayMessage } from '@/lib/error-handling';

interface Service {
  id: string;
  name: string;
  price: string;
  duration: string;
  description: string;
}

const SUGGESTED_SERVICES = [
  {
    name: 'Marriage Visa Application',
    price: '25000',
    duration: '4-6 weeks',
    description: 'Complete application process including document preparation, form filing, and immigration office representation',
  },
  {
    name: 'Retirement Visa Extension',
    price: '15000',
    duration: '2-3 weeks',
    description: 'Annual retirement visa extension with full document preparation and immigration assistance',
  },
  {
    name: 'Business Visa (Non-B)',
    price: '35000',
    duration: '6-8 weeks',
    description: 'Full business visa application including work permit coordination and company documentation',
  },
];

export default function ServicesPricingPage() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([
    {
      id: '1',
      name: '',
      price: '',
      duration: '',
      description: '',
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

  const applySuggestion = (suggestion: typeof SUGGESTED_SERVICES[0]) => {
    const emptyService = services.find(s => !s.name && !s.price);
    if (emptyService) {
      setServices(services.map(s => 
        s.id === emptyService.id 
          ? { ...s, ...suggestion }
          : s
      ));
    } else {
      const newService: Service = {
        id: Date.now().toString(),
        ...suggestion,
      };
      setServices([...services, newService]);
    }
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
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mark step 2 (Services) as complete
      try {
        await api.users.markProviderStepComplete({ requestBody: { step: 2 } });
      } catch (stepError) {
        console.error('[ServicesPage] Error marking step 2 complete:', stepError);
      }

      router.push('/onboarding/provider/credentials');
    } catch (error: unknown) {
      setError(getErrorDisplayMessage(error, 'save services'));
      setIsLoading(false);
    }
  };

  const filledServicesCount = services.filter(s => s.name && s.price).length;

  return (
    <OnboardingLayout
      currentStep={2}
      title="Services & Pricing"
      subtitle="Define what you offer and set competitive prices to attract clients"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Error Message */}
        {error && (
          <Toast variant="error" title="Error" description={error} />
        )}

        {/* Quick Add Suggestions */}
        <Card padding="md" className="border-primary/30 bg-primary/5 border-dashed">
          <div className="mb-3 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" aria-hidden="true" />
            <span className="text-sm font-semibold text-primary">Quick Add Popular Services</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_SERVICES.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                onClick={() => applySuggestion(suggestion)}
                className="border-primary/30 rounded-full border bg-white px-3 py-1.5 text-xs font-medium text-primary transition-all hover:border-primary hover:bg-primary hover:text-white"
              >
                + {suggestion.name}
              </button>
            ))}
          </div>
        </Card>

        {/* Services List */}
        <div className="space-y-4">
          {services.map((service, index) => (
            <Card
              key={service.id}
              padding="md"
              elevated
              className="border-l-primary/60 animate-fade-in-up border-l-4"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Service Header */}
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                    {index + 1}
                  </div>
                  <span className="text-sm font-medium text-text-secondary">
                    {service.name || 'New Service'}
                  </span>
                </div>
                {services.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeService(service.id)}
                    className="text-error hover:bg-error/10"
                    aria-label={`Remove service ${index + 1}`}
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </Button>
                )}
              </div>

              <div className="space-y-5">
                {/* Service Name */}
                <div className="flex flex-col gap-2">
                  <label htmlFor={`service-name-${service.id}`} className="flex items-center gap-2 text-sm font-medium">
                    <Package className="h-4 w-4 text-text-tertiary" aria-hidden="true" />
                    Service Name <span className="text-error">*</span>
                  </label>
                  <input
                    type="text"
                    id={`service-name-${service.id}`}
                    value={service.name}
                    onChange={(e) => updateService(service.id, 'name', e.target.value)}
                    className="h-12 w-full rounded-base border border-border-light bg-bg-primary px-4 text-base text-text-primary outline-none transition-all hover:border-border-medium focus:border-primary focus:shadow-focus-primary"
                    placeholder="e.g., Marriage Visa Application"
                    required
                  />
                </div>

                {/* Price and Duration Row */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <label htmlFor={`service-price-${service.id}`} className="flex items-center gap-2 text-sm font-medium">
                      <DollarSign className="h-4 w-4 text-text-tertiary" aria-hidden="true" />
                      Base Price (THB) <span className="text-error">*</span>
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
                        className="h-12 w-full rounded-base border border-border-light bg-bg-primary pl-10 pr-4 text-base text-text-primary outline-none transition-all hover:border-border-medium focus:border-primary focus:shadow-focus-primary"
                        placeholder="25,000"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor={`service-duration-${service.id}`} className="flex items-center gap-2 text-sm font-medium">
                      <Clock className="h-4 w-4 text-text-tertiary" aria-hidden="true" />
                      Typical Duration
                    </label>
                    <input
                      type="text"
                      id={`service-duration-${service.id}`}
                      value={service.duration}
                      onChange={(e) => updateService(service.id, 'duration', e.target.value)}
                      className="h-12 w-full rounded-base border border-border-light bg-bg-primary px-4 text-base text-text-primary outline-none transition-all hover:border-border-medium focus:border-primary focus:shadow-focus-primary"
                      placeholder="4-6 weeks"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="flex flex-col gap-2">
                  <label htmlFor={`service-description-${service.id}`} className="flex items-center gap-2 text-sm font-medium">
                    <FileText className="h-4 w-4 text-text-tertiary" aria-hidden="true" />
                    Description
                  </label>
                  <textarea
                    id={`service-description-${service.id}`}
                    value={service.description}
                    onChange={(e) => updateService(service.id, 'description', e.target.value)}
                    className="min-h-[80px] w-full resize-y rounded-base border border-border-light bg-bg-primary px-4 py-3 text-base text-text-primary outline-none transition-all hover:border-border-medium focus:border-primary focus:shadow-focus-primary"
                    placeholder="Describe what's included in this service..."
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Add Service Button */}
        <button
          type="button"
          onClick={addService}
          className="border-primary/40 bg-primary/5 hover:bg-primary/10 flex h-14 w-full items-center justify-center gap-2 rounded-base border-2 border-dashed text-base font-medium text-primary transition-all hover:border-primary"
        >
          <Plus className="h-5 w-5" aria-hidden="true" />
          Add Another Service
        </button>

        {/* Summary & Actions */}
        <Card padding="md" elevated className="bg-bg-primary/95 sticky bottom-4 z-10 backdrop-blur">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-text-secondary">
              {filledServicesCount > 0 ? (
                <span className="font-medium text-success">
                  ✓ {filledServicesCount} service{filledServicesCount !== 1 ? 's' : ''} configured
                </span>
              ) : (
                <span>Add at least one service to continue</span>
              )}
            </div>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/onboarding/provider/business')}
              >
                Back
              </Button>
              <Button
                type="submit"
                disabled={isLoading || filledServicesCount === 0}
                loading={isLoading}
              >
                {isLoading ? LOADING_SAVING : 'Continue'}
              </Button>
            </div>
          </div>
        </Card>
      </form>
    </OnboardingLayout>
  );
}
