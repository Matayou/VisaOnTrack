import type { LucideIcon } from 'lucide-react';

export type DocumentStatus = 'ready' | 'in-progress' | 'need-help';

export interface FormState {
  title: string;
  ageRange: string;
  nationality: string;
  currentLocation: string;
  currentVisaExpiry: string;
  currentVisaType: string;
  visaType: string;
  location: string;
  locationDetail: string;
  budgetMin: string;
  budgetMax: string;
  timeline: string;
  additionalNotes: string;
}

export type FormField = keyof FormState;

export interface FormErrors {
  title?: string;
  ageRange?: string;
  nationality?: string;
  currentLocation?: string;
  currentVisaExpiry?: string;
  currentVisaType?: string;
  visaType?: string;
  location?: string;
  locationDetail?: string;
  timeline?: string;
  additionalNotes?: string;
  budget?: string;
}

export interface TimelineShortcut {
  label: string;
  value: string;
  description: string;
}

export interface BudgetPreset {
  label: string;
  min: number;
  max: number;
  description: string;
}

export interface RequestFormStep {
  id: 'personal' | 'mission' | 'budget' | 'support';
  title: string;
  subtitle: string;
}

export interface ResidencyOption {
  value: string;
  label: string;
  description: string;
  icon: LucideIcon;
}

export interface DropdownOption {
  value: string;
  label: string;
  description?: string;
}

export interface MissionVisaOption extends DropdownOption {
  badge?: string;
  details: string[];
}

export interface DocumentChecklistItem {
  key: string;
  label: string;
}
