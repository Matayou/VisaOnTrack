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

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold mb-4">Complete Your Profile</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {step === 'dob' && (
        <div>
          <label className="block mb-2">Date of Birth</label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
      )}
      {step === 'nationality' && (
        <div>
          <label className="block mb-2">Nationality</label>
          <input
            type="text"
            name="nationality"
            value={formData.nationality}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
      )}
      {step === 'visaType' && (
        <div>
          <label className="block mb-2">Current Thai Visa Type</label>
          <input
            type="text"
            name="thaiVisaType"
            value={formData.thaiVisaType}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
      )}
      {step === 'visaExpiry' && (
        <div>
          <label className="block mb-2">Visa Expiry Date</label>
          <input
            type="date"
            name="visaExpiryDate"
            value={formData.visaExpiryDate}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
      )}
      <button
        onClick={handleNext}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        {step === 'visaExpiry' ? 'Submit' : 'Next'}
      </button>
    </div>
  );
}
