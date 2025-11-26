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

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      // Re-calculate derived fields
      const budget = estimateBudgetFromSavings(formData.savings);
      const locationLabel = formData.location;
      
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

      // Update the request - omit title/description from update as they are hidden from user
      await api.requests.updateRequest({
        id: request.id,
        requestBody: {
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

  const SectionHeader = ({ icon: Icon, title }: { icon: React.ElementType, title: string }) => (
    <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
      <Icon className="w-3.5 h-3.5" />
      {title}
      <div className="h-px flex-1 bg-gray-200"></div>
    </h3>
  );

  const Label = ({ htmlFor, children }: { htmlFor: string, children: React.ReactNode }) => (
    <label htmlFor={htmlFor} className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 ml-0.5">
      {children}
    </label>
  );

  const inputClasses = "w-full rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white text-gray-900 shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-2.5 px-3.5 transition-all";

  return (
    <form onSubmit={handleSubmit}>
      {/* Applicant Profile Section */}
      <div className="p-6 sm:p-8 border-b border-gray-100 bg-gray-50/30">
        <SectionHeader icon={User} title="Applicant Profile" />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <Globe className="w-3.5 h-3.5 text-gray-400" />
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
            <div className="flex items-center gap-1.5 mb-1.5">
              <User className="w-3.5 h-3.5 text-gray-400" />
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
            <div className="flex items-center gap-1.5 mb-1.5">
              <MapPin className="w-3.5 h-3.5 text-gray-400" />
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
            <div className="flex items-center gap-1.5 mb-1.5">
              <Target className="w-3.5 h-3.5 text-gray-400" />
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
      <div className="p-6 sm:p-8 bg-gray-50/30">
        <SectionHeader icon={Clock} title="Visa Requirements" />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <Clock className="w-3.5 h-3.5 text-gray-400" />
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
            <div className="flex items-center gap-1.5 mb-1.5">
              <Wallet className="w-3.5 h-3.5 text-gray-400" />
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
            <div className="flex items-center gap-1.5 mb-1.5">
              <PiggyBank className="w-3.5 h-3.5 text-gray-400" />
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
      <div className="p-6 sm:p-8 bg-white border-t border-gray-100 flex items-center justify-end gap-3 rounded-b-2xl">
        {error && (
          <span className="text-sm text-red-600 mr-auto font-medium bg-red-50 px-3 py-1.5 rounded-lg border border-red-100">{error}</span>
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
          disabled={isSaving}
        >
          Save Changes
        </Button>
      </div>
    </form>
  );
};

