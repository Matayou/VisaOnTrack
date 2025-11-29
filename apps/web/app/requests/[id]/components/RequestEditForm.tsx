import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, type Request } from '@visaontrack/client';
import { Button } from '@/components/ui';
import { nationalityOptions } from '@/config/requestForm';
import { 
  estimateBudgetFromSavings, 
} from '@/lib/eligibilityMapping';
import { Globe, User, MapPin, Target, Clock, Wallet, PiggyBank, FileText } from 'lucide-react';

interface RequestEditFormProps {
  request: Request;
}

export const RequestEditForm: React.FC<RequestEditFormProps> = ({ request }) => {
  const router = useRouter();
  const intakeData = (request as any).intakeData || {};
  
  const getCleanDescription = (desc: string) => {
    if (!desc) return '';
    if (desc.includes("Age Range:") && desc.includes("Nationality:")) {
      // It's the auto-generated dump.
      // Try to extract "Additional Needs" if not "None"
      const needsMatch = desc.match(/Additional Needs: (.*)/);
      if (needsMatch && needsMatch[1] && needsMatch[1].trim() !== 'None') {
        return needsMatch[1].trim();
      }
      return "";
    }
    return desc === 'None' ? '' : desc;
  };

  // Initial state from request data
  const [formData, setFormData] = useState({
    title: request.title,
    description: getCleanDescription(request.description),
    nationality: intakeData.nationality || '',
    age: intakeData.age || '',
    purpose: intakeData.purpose || '',
    location: intakeData.location || (request.location === 'Inside Thailand' ? 'Inside Thailand' : 'Outside Thailand'),
    duration: intakeData.duration || '',
    incomeType: intakeData.incomeType || '',
    savings: intakeData.savings || '',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isFormValid = !!(
    formData.title &&
    formData.nationality &&
    formData.age &&
    formData.purpose &&
    formData.location &&
    formData.duration &&
    formData.incomeType &&
    formData.savings
  );

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    if (!isFormValid) {
      setError('Please complete all required fields before saving.');
      setIsSaving(false);
      return;
    }

    try {
      // Re-calculate derived fields
      const budget = estimateBudgetFromSavings(formData.savings);
      const locationLabel = formData.location;
      const descriptionPayload =
        formData.description.trim().length > 0 ? formData.description : request.description;
      
      const updatedIntakeData = {
        ...intakeData,
        nationality: formData.nationality,
        age: formData.age,
        purpose: formData.purpose,
        location: formData.location,
        duration: formData.duration,
        incomeType: formData.incomeType,
        savings: formData.savings,
      };

      await api.requests.updateRequest({
        id: request.id,
        requestBody: {
          title: formData.title,
          description: descriptionPayload || undefined,
          location: locationLabel,
          budgetMin: budget.min,
          budgetMax: budget.max,
          intakeData: updatedIntakeData,
        }
      });

      router.push(`/requests/${request.id}`);
      router.refresh();
    } catch (err: any) {
      console.error('Failed to update request', err);
      setError('Failed to save changes. Please try again.');
      setIsSaving(false);
    }
  };

  const SectionHeader = ({ icon: Icon, title }: { icon: React.ElementType; title: string }) => (
    <h3 className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-text-secondary">
      <Icon className="h-3.5 w-3.5 text-text-tertiary" />
      {title}
      <div className="h-px flex-1 bg-gray-200"></div>
    </h3>
  );

  const Label = ({ htmlFor, children }: { htmlFor: string, children: React.ReactNode }) => (
    <label htmlFor={htmlFor} className="mb-1.5 ml-0.5 block text-xs font-semibold uppercase tracking-wide text-text-secondary">
      {children}
    </label>
  );

  const inputClasses = "w-full rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white text-gray-900 shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-2.5 px-3.5 transition-all";

  return (
    <form onSubmit={handleSubmit}>
      {/* Request Details */}
      <div className="border-b border-gray-100 bg-white p-6 sm:p-8">
        <h3 className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-text-secondary">
          <FileText className="h-3.5 w-3.5 text-text-tertiary" />
          Request Details
          <div className="h-px flex-1 bg-gray-200"></div>
        </h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className={inputClasses}
              placeholder="Visa application title"
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className={`${inputClasses} min-h-[120px]`}
              placeholder="Add any extra context for providers (optional)"
            />
          </div>
        </div>
      </div>

      {/* Applicant Profile Section */}
      <div className="border-b border-gray-100 bg-gray-50/30 p-6 sm:p-8">
        <SectionHeader icon={User} title="Applicant Profile" />
        
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <div className="mb-1.5 flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5 text-text-tertiary" />
              <Label htmlFor="nationality">Nationality</Label>
            </div>
            <select
              id="nationality"
              value={formData.nationality}
              onChange={(e) => handleChange('nationality', e.target.value)}
              className={inputClasses}
            >
              <option value="">Select Nationality</option>
              {nationalityOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div>
            <div className="mb-1.5 flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-text-tertiary" />
              <Label htmlFor="age">Age Range</Label>
            </div>
            <select
              id="age"
              value={formData.age}
              onChange={(e) => handleChange('age', e.target.value)}
              className={inputClasses}
            >
              <option value="">Select Age Range</option>
              <option value="Under 50">Under 50</option>
              <option value="50+">50+</option>
            </select>
          </div>

          <div>
            <div className="mb-1.5 flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-text-tertiary" />
              <Label htmlFor="location">Current Location</Label>
            </div>
            <select
              id="location"
              value={formData.location}
              onChange={(e) => handleChange('location', e.target.value)}
              className={inputClasses}
            >
              <option value="">Select Location</option>
              <option value="Inside Thailand">Inside Thailand</option>
              <option value="Outside Thailand">Outside Thailand</option>
            </select>
          </div>

          <div>
            <div className="mb-1.5 flex items-center gap-1.5">
              <Target className="h-3.5 w-3.5 text-text-tertiary" />
              <Label htmlFor="purpose">Primary Purpose</Label>
            </div>
            <select
              id="purpose"
              value={formData.purpose}
              onChange={(e) => handleChange('purpose', e.target.value)}
              className={inputClasses}
            >
              <option value="">Select Purpose</option>
              <option value="remote">Remote Work / Freelance</option>
              <option value="retirement">Retirement</option>
              <option value="longstay">Long Stay</option>
              <option value="study">Study / Education</option>
              <option value="family">Family / Marriage</option>
              <option value="premium">Premium / Convenience</option>
            </select>
          </div>
        </div>
      </div>

      {/* Visa Requirements Section */}
      <div className="bg-gray-50/30 p-6 sm:p-8">
        <SectionHeader icon={Clock} title="Visa Requirements" />
        
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <div className="mb-1.5 flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-text-tertiary" />
              <Label htmlFor="duration">Desired Duration</Label>
            </div>
            <select
              id="duration"
              value={formData.duration}
              onChange={(e) => handleChange('duration', e.target.value)}
              className={inputClasses}
            >
              <option value="">Select Duration</option>
              <option value="90_180">3-6 months</option>
              <option value="365">Around 1 year</option>
              <option value="365_5y">1-5 years</option>
              <option value="1825_plus">5+ years</option>
            </select>
          </div>

          <div>
            <div className="mb-1.5 flex items-center gap-1.5">
              <Wallet className="h-3.5 w-3.5 text-text-tertiary" />
              <Label htmlFor="incomeType">Income Source</Label>
            </div>
            <select
              id="incomeType"
              value={formData.incomeType}
              onChange={(e) => handleChange('incomeType', e.target.value)}
              className={inputClasses}
            >
              <option value="">Select Income Source</option>
              <option value="Remote/freelance">Remote/freelance work</option>
              <option value="Foreign salary">Foreign salary</option>
              <option value="Pension">Pension</option>
              <option value="Investments">Investments</option>
              <option value="Varies">Varies</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <div className="mb-1.5 flex items-center gap-1.5">
              <PiggyBank className="h-3.5 w-3.5 text-text-tertiary" />
              <Label htmlFor="savings">Available Savings</Label>
            </div>
            <select
              id="savings"
              value={formData.savings}
              onChange={(e) => handleChange('savings', e.target.value)}
              className={inputClasses}
            >
              <option value="">Select Savings Range</option>
              <option value="0_500k">&lt;500k THB</option>
              <option value="500k_800k">500k-800k THB</option>
              <option value="800k_3M">800k-3M THB</option>
              <option value="3M_10M">3M-10M THB</option>
              <option value="10M_plus">&gt;10M THB</option>
            </select>
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-end gap-3 rounded-b-2xl border-t border-gray-100 bg-white p-6 sm:p-8">
        {error && (
          <span className="mr-auto rounded-lg border border-red-100 bg-red-50 px-3 py-1.5 text-sm font-medium text-red-600">{error}</span>
        )}
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSaving}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          loading={isSaving}
          disabled={isSaving || !isFormValid}
        >
          Save Changes
        </Button>
      </div>
    </form>
  );
};

