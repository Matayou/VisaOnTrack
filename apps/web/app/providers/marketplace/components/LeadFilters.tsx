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
    <div className="ios-card p-5 sticky top-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-gray-900">Filters</h3>
        <button 
          onClick={handleClearAll}
          className="text-xs text-primary hover:text-indigo-600 font-medium"
        >
          Clear all
        </button>
      </div>

      <div className="space-y-5">
        {/* Visa Type */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
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
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
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
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Location
          </label>
          <select
            value={filters.location}
            onChange={(e) => onFiltersChange({ ...filters, location: e.target.value })}
            className="w-full rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white text-gray-900 shadow-sm focus:border-primary focus:ring-primary text-sm py-2 px-3"
          >
            <option value="">All locations</option>
            <option value="Inside Thailand">Inside Thailand</option>
            <option value="Outside Thailand">Outside Thailand</option>
          </select>
        </div>

        {/* Urgency */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
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

