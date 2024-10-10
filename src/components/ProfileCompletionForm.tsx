'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';

type Step = 'dob' | 'nationality' | 'visaType' | 'visaExpiry';

const nationalities = [
  "Afghan", "Albanian", "Algerian", "American", "Andorran", "Angolan", "Antiguan", "Argentine", "Armenian", "Australian",
  // ... (rest of the nationalities)
];

const visaTypes = ['Tourist Visa', 'Non-Immigrant Visa B', 'Non-Immigrant Visa O', 'Non-Immigrant Visa ED', 'Retirement Visa', 'Marriage Visa'];

export function ProfileCompletionForm() {
  const [step, setStep] = useState<Step>('dob');
  const [formData, setFormData] = useState({
    dateOfBirth: '',
    nationality: '',
    thaiVisaType: '',
    visaExpiryDate: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { data: session, update } = useSession();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError(null);
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
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
    }
  };

  const handleBack = () => {
    setError(null);
    switch (step) {
      case 'nationality':
        setStep('dob');
        break;
      case 'visaType':
        setStep('nationality');
        break;
      case 'visaExpiry':
        setStep('visaType');
        break;
    }
  };

  const validateCurrentStep = (): boolean => {
    switch (step) {
      case 'dob':
        if (!formData.dateOfBirth) {
          setError('Please enter your date of birth');
          return false;
        }
        const birthDate = new Date(formData.dateOfBirth);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        if (age < 18) {
          setError('You must be at least 18 years old to use this platform');
          return false;
        }
        break;
      case 'nationality':
        if (!formData.nationality) {
          setError('Please select your nationality');
          return false;
        }
        break;
      case 'visaType':
        if (!formData.thaiVisaType) {
          setError('Please select your current Thai visa type');
          return false;
        }
        break;
      case 'visaExpiry':
        if (!formData.visaExpiryDate) {
          setError('Please enter your visa expiry date');
          return false;
        }
        break;
    }
    return true;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/user/complete-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        await update({ ...session, user: { ...session?.user, profileCompleted: true } });
        toast.success('Profile completed successfully!');
        router.push('/dashboard');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to update profile');
        toast.error('Failed to complete profile. Please try again.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('An unexpected error occurred');
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 'dob':
        return (
          <div>
            <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">
              Date of Birth
            </label>
            <input
              type="date"
              name="dateOfBirth"
              id="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
        );
      case 'nationality':
        return (
          <div>
            <label htmlFor="nationality" className="block text-sm font-medium text-gray-700">
              Nationality
            </label>
            <select
              name="nationality"
              id="nationality"
              value={formData.nationality}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            >
              <option value="">Select nationality</option>
              {nationalities.map((nat) => (
                <option key={nat} value={nat}>{nat}</option>
              ))}
            </select>
          </div>
        );
      case 'visaType':
        return (
          <div>
            <fieldset>
              <legend className="block text-sm font-medium text-gray-700 mb-2">Current Thai Visa Type</legend>
              {visaTypes.map((type) => (
                <div key={type} className="flex items-center mb-2">
                  <input
                    type="radio"
                    id={type}
                    name="thaiVisaType"
                    value={type}
                    checked={formData.thaiVisaType === type}
                    onChange={handleInputChange}
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                  />
                  <label htmlFor={type} className="ml-3 block text-sm font-medium text-gray-700">
                    {type}
                  </label>
                </div>
              ))}
            </fieldset>
          </div>
        );
      case 'visaExpiry':
        return (
          <div>
            <label htmlFor="visaExpiryDate" className="block text-sm font-medium text-gray-700">
              Visa Expiry Date
            </label>
            <input
              type="date"
              name="visaExpiryDate"
              id="visaExpiryDate"
              value={formData.visaExpiryDate}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
        );
    }
  };

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center">
          {['dob', 'nationality', 'visaType', 'visaExpiry'].map((s, index) => (
            <React.Fragment key={s}>
              <div className={`flex-1 h-1 ${index <= ['dob', 'nationality', 'visaType', 'visaExpiry'].indexOf(step) ? 'bg-indigo-600' : 'bg-gray-200'}`} />
              {index < 3 && (
                <div className={`w-6 h-6 rounded-full ${index < ['dob', 'nationality', 'visaType', 'visaExpiry'].indexOf(step) ? 'bg-indigo-600' : 'bg-gray-200'} flex items-center justify-center text-xs text-white font-semibold`}>
                  {index + 1}
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">Step {['dob', 'nationality', 'visaType', 'visaExpiry'].indexOf(step) + 1} of 4</p>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {renderStep()}
      <div className="mt-6 flex justify-between">
        {step !== 'dob' && (
          <button
            onClick={handleBack}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l"
            disabled={isSubmitting}
          >
            Back
          </button>
        )}
        <button
          onClick={handleNext}
          className={`${step === 'dob' ? 'w-full' : ''} bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-r`}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : (step === 'visaExpiry' ? 'Submit' : 'Next')}
        </button>
      </div>
    </div>
  );
}
