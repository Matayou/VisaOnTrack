import React from 'react';

interface ProviderFiltersProps {
  filters: {
    verifiedOnly: boolean;
    specialties: string[];
    minRating: string;
    location: string;
    languages: string[];
    minExperience: string;
  };
  onFiltersChange: (filters: any) => void;
}

export const ProviderFilters: React.FC<ProviderFiltersProps> = ({ filters, onFiltersChange }) => {
  const handleSpecialtyToggle = (specialty: string) => {
    const newSpecialties = filters.specialties.includes(specialty)
      ? filters.specialties.filter(s => s !== specialty)
      : [...filters.specialties, specialty];
    onFiltersChange({ ...filters, specialties: newSpecialties });
  };

  const handleLanguageToggle = (language: string) => {
    const newLanguages = filters.languages.includes(language)
      ? filters.languages.filter(l => l !== language)
      : [...filters.languages, language];
    onFiltersChange({ ...filters, languages: newLanguages });
  };

  const handleClearAll = () => {
    onFiltersChange({
      verifiedOnly: false,
      specialties: [],
      minRating: '',
      location: '',
      languages: [],
      minExperience: '',
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
        {/* Verified Only */}
        <div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={filters.verifiedOnly}
              onChange={(e) => onFiltersChange({ ...filters, verifiedOnly: e.target.checked })}
              className="rounded border-gray-300 text-primary focus:ring-primary"
            />
            <span className="text-gray-700 font-medium">Verified providers only</span>
          </label>
        </div>

        {/* Specialization */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Specialization
          </label>
          <div className="space-y-2">
            {['DTV', 'Retirement', 'Elite', 'Education', 'Business'].map((specialty) => (
              <label key={specialty} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={filters.specialties.includes(specialty)}
                  onChange={() => handleSpecialtyToggle(specialty)}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-gray-700">{specialty}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Rating */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Minimum Rating
          </label>
          <div className="space-y-2">
            {['', '4', '4.5'].map((value) => (
              <label key={value} className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="rating"
                  checked={filters.minRating === value}
                  onChange={() => onFiltersChange({ ...filters, minRating: value })}
                  className="text-primary focus:ring-primary"
                />
                <span className="text-gray-700">
                  {value === '' ? 'Any rating' : `${value}+ stars`}
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
            <option value="Bangkok">Bangkok</option>
            <option value="Chiang Mai">Chiang Mai</option>
            <option value="Phuket">Phuket</option>
            <option value="Pattaya">Pattaya</option>
          </select>
        </div>

        {/* Languages */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Languages
          </label>
          <div className="space-y-2">
            {['English', 'Thai', 'Mandarin', 'Japanese'].map((language) => (
              <label key={language} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={filters.languages.includes(language)}
                  onChange={() => handleLanguageToggle(language)}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-gray-700">{language}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Experience */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Experience
          </label>
          <select
            value={filters.minExperience}
            onChange={(e) => onFiltersChange({ ...filters, minExperience: e.target.value })}
            className="w-full rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white text-gray-900 shadow-sm focus:border-primary focus:ring-primary text-sm py-2 px-3"
          >
            <option value="">Any experience</option>
            <option value="5">5+ years</option>
            <option value="10">10+ years</option>
            <option value="15">15+ years</option>
          </select>
        </div>
      </div>
    </div>
  );
};

