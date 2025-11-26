'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProviderHeader } from '@/components/ProviderHeader';
import { api } from '@visaontrack/client';
import { getErrorDisplayMessage } from '@/lib/error-handling';
import { Loader, AlertCircle, ArrowLeft, Eye, FileText, Image as ImageIcon, Star, X, Plus } from 'lucide-react';
import { Button } from '@/components/ui';

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

export default function ProviderProfileManagePage() {
  const router = useRouter();
  const [provider, setProvider] = useState<ProviderProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'basic' | 'media' | 'reviews'>('basic');

  // Form state
  const [formData, setFormData] = useState({
    businessName: '',
    description: '',
    location: '',
    yearsExperience: '',
    website: '',
    contactPhone: '',
  });

  const [languages, setLanguages] = useState<string[]>([]);
  const [newLanguage, setNewLanguage] = useState('');

  useEffect(() => {
    const loadProvider = async () => {
      try {
        setIsLoading(true);
        const data = await api.providers.getCurrentProvider();
        setProvider(data);
        
        // Populate form
        setFormData({
          businessName: data.businessName || '',
          description: data.description || '',
          location: data.location || '',
          yearsExperience: data.yearsExperience?.toString() || '',
          website: data.website || '',
          contactPhone: data.contactPhone || '',
        });
        setLanguages(data.languages || []);
      } catch (err: any) {
        console.error('[ProviderProfileManage] load error', err);
        setError(getErrorDisplayMessage(err, 'load profile'));
      } finally {
        setIsLoading(false);
      }
    };

    loadProvider();
  }, []);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddLanguage = () => {
    if (newLanguage.trim() && !languages.includes(newLanguage.trim())) {
      setLanguages([...languages, newLanguage.trim()]);
      setNewLanguage('');
    }
  };

  const handleRemoveLanguage = (lang: string) => {
    setLanguages(languages.filter(l => l !== lang));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!provider) return;

    setIsSaving(true);
    setError(null);

    try {
      const updateData = {
        businessName: formData.businessName,
        description: formData.description || undefined,
        location: formData.location || undefined,
        languages: languages.length > 0 ? languages : undefined,
        website: formData.website || undefined,
        contactPhone: formData.contactPhone || undefined,
        yearsExperience: formData.yearsExperience ? parseInt(formData.yearsExperience) : undefined,
      };

      await api.providers.updateProvider({
        id: provider.id,
        requestBody: updateData,
      });

      alert('Profile updated successfully!');
      router.refresh();
    } catch (err) {
      console.error('Update failed', err);
      setError(getErrorDisplayMessage(err, 'update profile'));
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-500">
          <Loader className="h-5 w-5 animate-spin" />
          <span>Loading profile...</span>
        </div>
      </div>
    );
  }

  if (error && !provider) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-xl border border-red-100 max-w-md w-full text-center">
          <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-gray-900 mb-2">Unable to load profile</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => router.push('/providers/dashboard')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-gray-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <ProviderHeader />
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-4 lg:py-6">
        <div className="mb-4 lg:mb-6">
          <button 
            onClick={() => router.push('/providers/dashboard')}
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 font-medium transition-colors px-2 py-1 -ml-2 rounded-lg hover:bg-gray-100/50"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
        </div>

        <div className="lg:grid lg:grid-cols-3 lg:gap-6">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-4 mb-4 lg:mb-0">
            
            <div className="ios-card p-5 lg:p-6">
              <div className="flex items-center justify-between mb-6">
                <h1 className="font-bold text-gray-900 text-base lg:text-lg">My Profile</h1>
                <a 
                  href={`/providers/${provider?.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:text-indigo-600 font-medium flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  View public profile
                </a>
              </div>

              {/* Tabs */}
              <div className="flex gap-2 border-b border-gray-100 pb-3 mb-5">
                <button
                  onClick={() => setActiveTab('basic')}
                  className={`border-b-2 px-2 pb-2 text-sm font-semibold ${activeTab === 'basic' ? 'text-primary border-primary' : 'text-gray-400 border-transparent'}`}
                >
                  Basic Info
                </button>
                <button
                  onClick={() => setActiveTab('media')}
                  className={`border-b-2 px-2 pb-2 text-sm font-semibold ${activeTab === 'media' ? 'text-primary border-primary' : 'text-gray-400 border-transparent'}`}
                >
                  Photos & Media
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`border-b-2 px-2 pb-2 text-sm font-semibold ${activeTab === 'reviews' ? 'text-primary border-primary' : 'text-gray-400 border-transparent'}`}
                >
                  Reviews
                </button>
              </div>

              {/* Basic Info Tab */}
              {activeTab === 'basic' && (
                <form onSubmit={handleSubmit}>
                  <div className="space-y-5">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 ml-0.5">
                        Business Name
                      </label>
                      <input
                        type="text"
                        value={formData.businessName}
                        onChange={(e) => handleChange('businessName', e.target.value)}
                        className="w-full rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white text-gray-900 shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-2.5 px-3.5 transition-all"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 ml-0.5">
                        About Your Business
                      </label>
                      <textarea
                        rows={4}
                        value={formData.description}
                        onChange={(e) => handleChange('description', e.target.value)}
                        className="w-full rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white text-gray-900 shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-2.5 px-3.5 transition-all"
                      />
                      <p className="text-xs text-gray-500 mt-1.5">Tell seekers what makes your service unique</p>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 ml-0.5">
                        Location
                      </label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => handleChange('location', e.target.value)}
                        className="w-full rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white text-gray-900 shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-2.5 px-3.5 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 ml-0.5">
                        Years of Experience
                      </label>
                      <input
                        type="number"
                        value={formData.yearsExperience}
                        onChange={(e) => handleChange('yearsExperience', e.target.value)}
                        className="w-full rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white text-gray-900 shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-2.5 px-3.5 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 ml-0.5">
                        Languages
                      </label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {languages.map((lang) => (
                          <span key={lang} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-700 rounded-lg">
                            {lang}
                            <button type="button" onClick={() => handleRemoveLanguage(lang)} className="hover:text-red-600">
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newLanguage}
                          onChange={(e) => setNewLanguage(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddLanguage())}
                          placeholder="Add a language"
                          className="flex-1 rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white text-gray-900 shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-2 px-3 transition-all"
                        />
                        <button
                          type="button"
                          onClick={handleAddLanguage}
                          className="px-4 py-2 text-sm font-medium text-primary border border-primary/30 rounded-xl hover:bg-primary/5 transition-all"
                        >
                          Add
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 ml-0.5">
                        Website
                      </label>
                      <input
                        type="url"
                        value={formData.website}
                        onChange={(e) => handleChange('website', e.target.value)}
                        className="w-full rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white text-gray-900 shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-2.5 px-3.5 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 ml-0.5">
                        Contact Phone
                      </label>
                      <input
                        type="tel"
                        value={formData.contactPhone}
                        onChange={(e) => handleChange('contactPhone', e.target.value)}
                        className="w-full rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white text-gray-900 shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-2.5 px-3.5 transition-all"
                      />
                    </div>

                    {error && (
                      <div className="bg-red-50 text-red-800 p-4 rounded-xl border border-red-200 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5" />
                        {error}
                      </div>
                    )}

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push('/providers/dashboard')}
                        disabled={isSaving}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        loading={isSaving}
                        disabled={isSaving}
                      >
                        Save changes
                      </Button>
                    </div>
                  </div>
                </form>
              )}

              {/* Photos & Media Tab */}
              {activeTab === 'media' && (
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 ml-0.5">
                      Profile Photo
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-200 ring-4 ring-white text-white font-bold text-2xl">
                        {provider?.businessName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)}
                      </div>
                      <div className="flex-1">
                        <button className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 hover:border-primary/30 hover:text-primary rounded-xl transition-all">
                          Upload new photo
                        </button>
                        <p className="text-xs text-gray-500 mt-2">JPG, PNG or GIF. Max 5MB.</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 ml-0.5">
                      Portfolio Photos
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                      {/* Existing photos - mock */}
                      <div className="relative group aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                        <img src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&h=400&fit=crop" alt="Office" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors">
                            <Eye className="w-4 h-4 text-gray-700" />
                          </button>
                          <button className="p-2 bg-white rounded-lg hover:bg-red-50 transition-colors">
                            <X className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </div>

                      <div className="relative group aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                        <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=400&fit=crop" alt="Team" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors">
                            <Eye className="w-4 h-4 text-gray-700" />
                          </button>
                          <button className="p-2 bg-white rounded-lg hover:bg-red-50 transition-colors">
                            <X className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </div>

                      <div className="relative group aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                        <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=400&fit=crop" alt="Building" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors">
                            <Eye className="w-4 h-4 text-gray-700" />
                          </button>
                          <button className="p-2 bg-white rounded-lg hover:bg-red-50 transition-colors">
                            <X className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </div>

                      {/* Upload New */}
                      <button className="aspect-square rounded-xl border-2 border-dashed border-gray-300 hover:border-primary hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-2 text-gray-500 hover:text-primary">
                        <Plus className="w-8 h-8" />
                        <span className="text-xs font-medium">Add photo</span>
                      </button>
                    </div>
                    <p className="text-xs text-gray-500">Show your office, team, or work environment. Max 10 photos.</p>
                  </div>
                </div>
              )}

              {/* Reviews Tab */}
              {activeTab === 'reviews' && (
                <div className="space-y-5">
                  <div className="bg-gray-50/50 rounded-xl p-5 border border-gray-100">
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-gray-900">4.9</div>
                        <div className="flex items-center gap-1 mt-1 justify-center">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <Star key={i} className="w-4 h-4 text-amber-400 fill-current" />
                          ))}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">24 reviews</div>
                      </div>
                      <div className="flex-1 space-y-2">
                        {[
                          { stars: 5, count: 20, percent: 85 },
                          { stars: 4, count: 3, percent: 12 },
                          { stars: 3, count: 1, percent: 4 },
                          { stars: 2, count: 0, percent: 0 },
                          { stars: 1, count: 0, percent: 0 },
                        ].map((row) => (
                          <div key={row.stars} className="flex items-center gap-2">
                            <span className="text-xs text-gray-500 w-8">{row.stars}★</span>
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div className="h-full bg-amber-400" style={{ width: `${row.percent}%` }}></div>
                            </div>
                            <span className="text-xs text-gray-500 w-8">{row.count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 text-center pt-2">
                    Reviews are posted by verified customers after service completion
                  </p>

                  {/* Individual Reviews - Mock */}
                  <div className="space-y-4">
                    <div className="border border-gray-100 rounded-xl p-4 bg-white">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold text-sm">
                            JD
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">John Doe</p>
                            <div className="flex items-center gap-0.5 mt-0.5">
                              {[1, 2, 3, 4, 5].map((i) => (
                                <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-current" />
                              ))}
                            </div>
                          </div>
                        </div>
                        <span className="text-xs text-gray-500">2 weeks ago</span>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        Excellent service! The team was professional, responsive, and made the entire DTV application process smooth and stress-free.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Sidebar */}
          <aside className="hidden lg:block space-y-6">
            
            {/* Profile Completion */}
            <div className="ios-card p-5">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Profile Strength</h3>
              <div className="flex items-center gap-4 mb-4">
                <div className="relative w-20 h-20">
                  <div className="absolute inset-0 rounded-full border-8 border-gray-100"></div>
                  <div
                    className="absolute inset-0 rounded-full border-8 border-transparent"
                    style={{ borderTopColor: '#2563eb', borderRightColor: '#2563eb', borderLeftColor: '#2563eb' }}
                  ></div>
                  <div className="absolute inset-2 rounded-full bg-white flex flex-col items-center justify-center">
                    <p className="text-xl font-semibold text-primary">85%</p>
                    <p className="text-[10px] uppercase text-gray-400 tracking-wide">Complete</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  Complete your profile to increase visibility
                </p>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Business info added</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Profile photo uploaded</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">3 portfolio photos</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-gray-500">Add 2 more photos</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-gray-500">Add video introduction</span>
                </div>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="ios-card p-5">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Profile Tips</h3>
              <div className="space-y-3 text-sm">
                <div className="flex gap-3 items-start">
                  <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3.5 h-3.5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    <span className="font-semibold">Add photos:</span> Profiles with 5+ photos get 3x more inquiries
                  </p>
                </div>
                <div className="flex gap-3 items-start">
                  <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3.5 h-3.5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    <span className="font-semibold">Be specific:</span> Detail your experience with each visa type
                  </p>
                </div>
                <div className="flex gap-3 items-start">
                  <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3.5 h-3.5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    <span className="font-semibold">Update regularly:</span> Keep your info current to stay visible
                  </p>
                </div>
              </div>
            </div>

          </aside>
        </div>
      </main>
    </div>
  );
}

