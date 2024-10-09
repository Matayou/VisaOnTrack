'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const areaOfExpertiseOptions = [
  'Visa Application',
  'Legal Consultation',
  'Document Translation',
  'Immigration Law',
  'Work Permits',
] as const;

const locationOptions = ['BANGKOK', 'CHIANG_MAI', 'PATTAYA', 'PHUKET', 'HUA_HIN'] as const;

type AreaOfExpertise = typeof areaOfExpertiseOptions[number];
type Location = typeof locationOptions[number];

interface ServiceProviderProfileData {
  about: string;
  areaOfExpertise: AreaOfExpertise[];
  location: Location;
}

interface ServiceProviderProfileFormProps {
  initialData?: Partial<ServiceProviderProfileData>;
}

export function ServiceProviderProfileForm({ initialData }: ServiceProviderProfileFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<ServiceProviderProfileData>({
    about: initialData?.about || '',
    areaOfExpertise: initialData?.areaOfExpertise || [],
    location: initialData?.location || '' as Location,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: keyof ServiceProviderProfileData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAreaOfExpertiseChange = (value: AreaOfExpertise) => {
    setFormData((prev) => {
      const newAreas = prev.areaOfExpertise.includes(value)
        ? prev.areaOfExpertise.filter((area) => area !== value)
        : [...prev.areaOfExpertise, value];
      return { ...prev, areaOfExpertise: newAreas };
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/user/update-profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/profile');
        router.refresh();
      } else {
        console.error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="about" className="block text-sm font-medium text-gray-700">
          About
        </label>
        <Textarea
          id="about"
          name="about"
          value={formData.about}
          onChange={handleInputChange}
          className="mt-1"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Area of Expertise</label>
        <div className="mt-1 space-y-2">
          {areaOfExpertiseOptions.map((option) => (
            <label key={option} className="inline-flex items-center mr-4">
              <input
                type="checkbox"
                checked={formData.areaOfExpertise.includes(option)}
                onChange={() => handleAreaOfExpertiseChange(option)}
                className="form-checkbox"
              />
              <span className="ml-2">{option}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700">
          Location
        </label>
        <Select
          value={formData.location}
          onValueChange={(value) => handleSelectChange('location', value as Location)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select location" />
          </SelectTrigger>
          <SelectContent>
            {locationOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option.replace('_', ' ')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white">
        Save Changes
      </Button>
    </form>
  );
}