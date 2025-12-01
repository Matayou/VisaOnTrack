'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@visaontrack/client';
import { getErrorDisplayMessage } from '@/lib/error-handling';
import { Loader, AlertCircle, ArrowLeft, Star, ShieldCheck, Globe, Clock, MessageCircle } from 'lucide-react';

interface ProviderProfile {
  id: string;
  businessName: string;
  description?: string;
  location?: string;
  languages: string[];
  website?: string;
  contactPhone?: string;
  yearsExperience?: number;
  verifiedAt?: string;
}

// Mock service packages and reviews until backend is ready
interface ServicePackage {
  id: string;
  title: string;
  description: string;
  priceTHB: number;
  deliverables: string[];
  etaDays: number;
}

interface Review {
  id: string;
  authorName: string;
  rating: number;
  text: string;
  createdAt: string;
}

export default function ProviderPublicProfilePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const providerId = Array.isArray(params?.id) ? params?.id[0] : params?.id;

  const [provider, setProvider] = useState<ProviderProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock data for now
  const [servicePackages] = useState<ServicePackage[]>([
    {
      id: '1',
      title: 'Digital Nomad Visa (DTV) - Full Service',
      description: 'Complete DTV application support including document preparation, embassy liaison, and follow-up. Perfect for remote workers and freelancers.',
      priceTHB: 45000,
      deliverables: [
        'Document review & preparation',
        'Embassy appointment booking',
        'Application submission & tracking',
        'Post-approval support & guidance'
      ],
      etaDays: 10
    },
    {
      id: '2',
      title: 'Retirement Visa (Non-O) - Premium',
      description: 'Comprehensive retirement visa service including bank account setup, insurance coordination, and annual extension planning.',
      priceTHB: 65000,
      deliverables: [
        'Bank account opening assistance',
        'Health insurance coordination',
        'Full visa application & submission',
        '1-year extension planning'
      ],
      etaDays: 18
    },
    {
      id: '3',
      title: 'Visa Consultation - 1 Hour',
      description: 'Expert consultation to assess your situation and recommend the best visa pathway. Includes personalized action plan.',
      priceTHB: 3500,
      deliverables: [
        '1-hour video consultation',
        'Personalized visa recommendation',
        'Written action plan & timeline'
      ],
      etaDays: 1
    }
  ]);

  const [reviews] = useState<Review[]>([
    {
      id: '1',
      authorName: 'John Doe',
      rating: 5,
      text: 'Excellent service! The team was professional, responsive, and made the entire DTV application process smooth and stress-free. Got my visa approved in just 8 days. Highly recommend!',
      createdAt: '2 weeks ago'
    },
    {
      id: '2',
      authorName: 'Sarah Miller',
      rating: 5,
      text: 'Very knowledgeable team. They helped me with my retirement visa and explained every step clearly. The bank account setup assistance was particularly helpful. Worth every baht!',
      createdAt: '1 month ago'
    },
    {
      id: '3',
      authorName: 'Michael Chen',
      rating: 4,
      text: 'Good service overall. The process took a bit longer than expected (about 12 days instead of 7-10), but they kept me updated throughout. Would use again.',
      createdAt: '2 months ago'
    }
  ]);

  const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  useEffect(() => {
    if (!providerId) return;

    const loadProvider = async () => {
      try {
        setIsLoading(true);

        // Mock data for demo providers (matching the directory)
        const mockProviders: Record<string, ProviderProfile> = {
          '1': {
            id: '1',
            businessName: 'Visa Thailand Experts Co.',
            description: 'Professional visa agency with 15+ years of experience helping expats navigate Thai immigration. We specialize in Digital Nomad, Retirement, and Elite visas with a 98% success rate.',
            location: 'Bangkok, Thailand',
            languages: ['English', 'Thai', 'Mandarin'],
            website: 'https://visathailand.com',
            contactPhone: '+66 2 123 4567',
            yearsExperience: 15,
            verifiedAt: new Date().toISOString(),
          },
          '2': {
            id: '2',
            businessName: 'Thai Smile Visa Services',
            description: 'Boutique visa agency specializing in Digital Nomad and Education visas. Fast processing with personalized service.',
            location: 'Chiang Mai, Thailand',
            languages: ['English', 'Thai'],
            website: 'https://thaismile.com',
            yearsExperience: 8,
            verifiedAt: new Date().toISOString(),
          },
          '3': {
            id: '3',
            businessName: 'Bangkok Legal Partners',
            description: 'Full-service law firm specializing in business visas, work permits, and corporate immigration solutions.',
            location: 'Bangkok, Thailand',
            languages: ['English', 'Thai', 'Japanese'],
            website: 'https://bangkoklegal.com',
            yearsExperience: 20,
            verifiedAt: new Date().toISOString(),
          },
        };

        // Check if it's a mock provider
        if (mockProviders[providerId]) {
          setProvider(mockProviders[providerId]);
        } else {
          // Try to fetch from API for real providers
          const data = await api.providers.getProvider({ id: providerId });
          setProvider(data as unknown as ProviderProfile);
        }
      } catch (err: any) {
        console.error('[ProviderProfile] load error', err);
        setError(getErrorDisplayMessage(err, 'load provider profile'));
      } finally {
        setIsLoading(false);
      }
    };

    loadProvider();
  }, [providerId]);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`h-4 w-4 ${i <= rating ? 'fill-current text-amber-400' : 'fill-current text-gray-300'}`}
        />
      );
    }
    return stars;
  };

  const currencyFormatter = new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    maximumFractionDigits: 0,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="flex items-center gap-3 text-gray-500">
          <Loader className="h-5 w-5 animate-spin" />
          <span>Loading provider profile...</span>
        </div>
      </div>
    );
  }

  if (error || !provider) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md rounded-xl border border-red-100 bg-white p-6 text-center">
          <AlertCircle className="mx-auto mb-4 h-10 w-10 text-red-500" />
          <h2 className="mb-2 text-lg font-bold text-gray-900">Unable to load provider</h2>
          <p className="mb-6 text-gray-600">{error || 'Provider not found'}</p>
          <button
            onClick={() => router.push('/providers')}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Directory
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-32 lg:pb-12">
      {/* Simple Header */}
      <header className="border-b border-gray-100 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary">
              <span className="text-sm font-bold text-white">SP</span>
            </div>
            <span className="font-bold text-gray-900">SawadeePass</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="text-sm font-medium text-gray-500 hover:text-gray-900">
              Sign in
            </button>
            <button className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-indigo-200 transition-all hover:bg-indigo-600">
              Get started
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-4 sm:px-8 lg:py-6">
        <div className="mb-4 lg:mb-6">
          <button
            onClick={() => router.push('/providers')}
            className="-ml-2 inline-flex items-center gap-2 rounded-lg px-2 py-1 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-100/50 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Directory
          </button>
        </div>

        <div className="lg:grid lg:grid-cols-3 lg:gap-6">
          {/* Main Column */}
          <div className="mb-4 space-y-4 lg:col-span-2 lg:mb-0">

            {/* Provider Header Card */}
            <div className="ios-card relative overflow-hidden p-5 lg:p-6">
              <div className="pointer-events-none absolute right-0 top-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-gradient-to-br from-indigo-50/40 to-transparent"></div>

              <div className="relative flex flex-col items-start gap-4 sm:flex-row sm:gap-5">
                <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-indigo-600 text-2xl font-bold text-white shadow-lg shadow-indigo-200 ring-4 ring-white">
                  {getInitials(provider.businessName)}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex items-start justify-between gap-3">
                    <div>
                      <h1 className="text-xl font-bold leading-tight text-gray-900 lg:text-2xl">
                        {provider.businessName}
                      </h1>
                      <p className="mt-1 text-sm text-gray-500">{provider.location}</p>
                    </div>
                    {provider.verifiedAt && (
                      <span className="flex flex-shrink-0 items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700 ring-1 ring-inset ring-green-600/10">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        Verified
                      </span>
                    )}
                  </div>

                  <p className="mb-4 text-sm leading-relaxed text-gray-600">
                    {provider.description || 'No description provided'}
                  </p>

                  {/* Quick Stats */}
                  <div className="mb-4 flex flex-wrap gap-4 text-sm">
                    {provider.yearsExperience && (
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">
                          <span className="font-semibold text-gray-900">{provider.yearsExperience}</span> years experience
                        </span>
                      </div>
                    )}
                    {provider.languages && provider.languages.length > 0 && (
                      <div className="flex items-center gap-1.5">
                        <Globe className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">{provider.languages.join(', ')}</span>
                      </div>
                    )}
                  </div>

                  {/* Rating */}
                  <div className="mb-4 flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {renderStars(Math.round(averageRating))}
                    </div>
                    <span className="font-semibold text-gray-900">{averageRating.toFixed(1)}</span>
                    <span className="text-gray-500">({reviews.length} reviews)</span>
                  </div>

                  {/* Portfolio Photos - Mock for now */}
                  <div className="grid grid-cols-4 gap-2">
                    <div className="aspect-square overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
                      <img src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=200&h=200&fit=crop" alt="Office" className="h-full w-full object-cover" />
                    </div>
                    <div className="aspect-square overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
                      <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=200&h=200&fit=crop" alt="Team" className="h-full w-full object-cover" />
                    </div>
                    <div className="aspect-square overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
                      <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200&h=200&fit=crop" alt="Building" className="h-full w-full object-cover" />
                    </div>
                    <div className="aspect-square overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
                      <img src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=200&h=200&fit=crop" alt="Workspace" className="h-full w-full object-cover" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Service Packages */}
            <div className="ios-card p-5 lg:p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-base font-bold text-gray-900 lg:text-lg">Service Packages</h2>
                <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-400">
                  {servicePackages.length} packages
                </span>
              </div>

              <div className="space-y-4">
                {servicePackages.map((pkg) => (
                  <div key={pkg.id} className="hover:border-primary/30 rounded-xl border border-gray-100 bg-white p-4 transition-colors">
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-base font-semibold text-gray-900">{pkg.title}</h3>
                        {pkg.id === '1' && (
                          <p className="mt-1 text-xs font-semibold uppercase text-gray-400">Most Popular</p>
                        )}
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <p className="text-lg font-bold text-gray-900">{currencyFormatter.format(pkg.priceTHB)}</p>
                        <p className="text-xs text-gray-500">~{pkg.etaDays} days</p>
                      </div>
                    </div>

                    <p className="mb-4 text-sm leading-relaxed text-gray-600">
                      {pkg.description}
                    </p>

                    {/* Deliverables */}
                    <div className="mb-4 space-y-2">
                      {pkg.deliverables.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-sm">
                          <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-700">{item}</span>
                        </div>
                      ))}
                    </div>

                    <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-200 transition-all hover:bg-indigo-600">
                      <span>Request this service</span>
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews Section */}
            <div className="ios-card p-5 lg:p-6">
              <h2 className="mb-6 text-base font-bold text-gray-900 lg:text-lg">Reviews</h2>

              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="rounded-xl border border-gray-100 bg-white p-4">
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-sm font-semibold text-gray-600">
                          {getInitials(review.authorName)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{review.authorName}</p>
                          <div className="mt-0.5 flex items-center gap-1">
                            {renderStars(review.rating)}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">{review.createdAt}</span>
                    </div>
                    <p className="text-sm leading-relaxed text-gray-700">
                      {review.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Sidebar */}
          <aside className="hidden space-y-6 lg:block">

            {/* Contact Card */}
            <div className="ios-card p-5">
              <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-gray-400">Contact Provider</h3>
              <div className="space-y-3">
                <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-200 transition-all hover:bg-indigo-600">
                  <MessageCircle className="h-4 w-4" />
                  <span>Send message</span>
                </button>
                <div className="text-center text-sm text-gray-500">
                  Typical response time: <span className="font-semibold text-gray-900">2-4 hours</span>
                </div>
              </div>
            </div>

            {/* Business Info */}
            <div className="ios-card p-5">
              <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-gray-400">Business Information</h3>
              <div className="space-y-3 text-sm">
                {provider.location && (
                  <div>
                    <p className="mb-1 text-xs uppercase tracking-wide text-gray-400">Location</p>
                    <p className="font-medium text-gray-900">{provider.location}</p>
                  </div>
                )}
                {provider.languages && provider.languages.length > 0 && (
                  <div>
                    <p className="mb-1 text-xs uppercase tracking-wide text-gray-400">Languages</p>
                    <div className="flex flex-wrap gap-1.5">
                      {provider.languages.map((lang) => (
                        <span key={lang} className="rounded-lg bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {provider.website && (
                  <div>
                    <p className="mb-1 text-xs uppercase tracking-wide text-gray-400">Website</p>
                    <a href={provider.website} target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline">
                      {provider.website.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Trust Signals */}
            <div className="ios-card p-5">
              <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-gray-400">Trust & Safety</h3>
              <div className="space-y-2">
                <div className="-mx-3 flex items-start gap-3.5 rounded-xl border border-green-100/50 bg-green-50/50 p-3">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-green-100 ring-4 ring-white">
                    <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-green-900">Identity verified</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-green-700/80">Business license confirmed</p>
                  </div>
                </div>

                <div className="-mx-3 flex items-start gap-3.5 rounded-xl border border-blue-100/50 bg-blue-50/50 p-3">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 ring-4 ring-white">
                    <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-blue-900">Payment protected</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-blue-700/80">Secure escrow system</p>
                  </div>
                </div>

                <div className="-mx-3 flex cursor-default items-start gap-3.5 rounded-xl p-3 transition-colors hover:bg-gray-50">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-purple-50 ring-4 ring-white">
                    <svg className="h-4 w-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Data privacy</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-gray-500">Your info stays confidential</p>
                  </div>
                </div>
              </div>
            </div>

          </aside>
        </div>
      </main>

      {/* Mobile Sticky Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-100 bg-white p-4 shadow-lg lg:hidden">
        <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-indigo-200 transition-all hover:bg-indigo-600">
          <MessageCircle className="h-4 w-4" />
          <span>Contact provider</span>
        </button>
      </div>
    </div>
  );
}

