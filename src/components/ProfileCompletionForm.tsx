'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

type Step = 'dob' | 'nationality' | 'visaType' | 'visaExpiry';

export function ProfileCompletionForm() {
  const [step, setStep] = useState<Step>('dob');
  const [formData, setFormData] = useState({
    dateOfBirth: '',
    nationality: '',
    thaiVisaType: '',
    visaExpiryDate: '',
  });
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { data: session, update } = useSession();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    switch (step) {
      case 'dob':
        setStep('nationality');
        break;
      case 'nationality':
        setStep('visaType');
        break;
      case 'visaType':
        setStep('visaExpiry');
        break;
      case 'visaExpiry':
        handleSubmit();
        break;
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/user/complete-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        await update({ ...session, user: { ...session?.user, profileCompleted: true } });
        router.push('/dashboard');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('An unexpected error occurred');
    }
  };

  const renderStep = () => {
    switch (step) {
      case 'dob':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        );
      case 'nationality':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nationality</label>
            <input
              type="text"
              name="nationality"
              value={formData.nationality}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        );
      case 'visaType':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Thai Visa Type</label>
            <input
              type="text"
              name="thaiVisaType"
              value={formData.thaiVisaType}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        );
      case 'visaExpiry':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Visa Expiry Date</label>
            <input
              type="date"
              name="visaExpiryDate"
              value={formData.visaExpiryDate}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Step {['dob', 'nationality', 'visaType', 'visaExpiry'].indexOf(step) + 1} of 4</h3>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {renderStep()}
      <button
        onClick={handleNext}
        className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        {step === 'visaExpiry' ? 'Submit' : 'Next'}
      </button>
    </div>
  );
}
