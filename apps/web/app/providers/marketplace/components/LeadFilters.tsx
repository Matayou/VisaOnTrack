import React from 'react';

interface LeadFiltersProps {
  filters: {
    visaTypes: string[];
    budgetMin: string;
    location: string;
    urgentOnly: boolean;
    newOnly: boolean;
  };
  onFiltersChange: (filters: any) => void;
}

export const LeadFilters: React.FC<LeadFiltersProps> = ({ filters, onFiltersChange }) => {
  const handleVisaTypeToggle = (visaType: string) => {
    const newVisaTypes = filters.visaTypes.includes(visaType)
      ? filters.visaTypes.filter(v => v !== visaType)
      : [...filters.visaTypes, visaType];
    onFiltersChange({ ...filters, visaTypes: newVisaTypes });
  };

  const handleClearAll = () => {
    onFiltersChange({
      visaTypes: [],
      budgetMin: '',
      location: '',
      urgentOnly: false,
      newOnly: false,
    });
  };

  return (
    <div className="ios-card sticky top-6 p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-bold text-gray-900">Filters</h3>
        <button 
          onClick={handleClearAll}
          className="text-xs font-medium text-primary hover:text-indigo-600"
        >
          Clear all
        </button>
      </div>

      <div className="space-y-5">
        {/* Visa Type */}
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">
            Visa Type
          </label>
          <div className="space-y-2">
            {['DTV', 'NON-IMM-ED', 'NON-IMM-O', 'Elite', 'Business'].map((type) => (
              <label key={type} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={filters.visaTypes.includes(type)}
                  onChange={() => handleVisaTypeToggle(type)}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-gray-700">{type}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Budget Range */}
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">
            Minimum Budget
          </label>
          <div className="space-y-2">
            {['', '50000', '100000', '200000'].map((value) => (
              <label key={value} className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="budget"
                  checked={filters.budgetMin === value}
                  onChange={() => onFiltersChange({ ...filters, budgetMin: value })}
                  className="text-primary focus:ring-primary"
                />
                <span className="text-gray-700">
                  {value === '' ? 'Any budget' : `฿${parseInt(value).toLocaleString()}+`}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">
            Location
          </label>
          <select
            value={filters.location}
            onChange={(e) => onFiltersChange({ ...filters, location: e.target.value })}
            className="w-full rounded-xl border-gray-200 bg-gray-50/50 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-primary focus:bg-white focus:ring-primary"
          >
            <option value="">All locations</option>
            <option value="Inside Thailand">Inside Thailand</option>
            <option value="Outside Thailand">Outside Thailand</option>
          </select>
        </div>

        {/* Urgency */}
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">
            Urgency
          </label>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={filters.urgentOnly}
                onChange={(e) => onFiltersChange({ ...filters, urgentOnly: e.target.checked })}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-gray-700">Urgent (24h response)</span>
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={filters.newOnly}
                onChange={(e) => onFiltersChange({ ...filters, newOnly: e.target.checked })}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-gray-700">New (posted today)</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

