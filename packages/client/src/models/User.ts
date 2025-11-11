/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { UserRole } from './UserRole';

/**
 * User schema per Section 3 data model (RFC-003: includes email verification status, RFC-004: includes onboarding completion status)
 */
export type User = {
    id: string;
    email: string;
    role: UserRole;
    name?: string | null;
    phone?: string | null;
    locale?: string;
    /**
     * RFC-003: Whether user has verified their email address
     */
    emailVerified: boolean;
    /**
     * RFC-004: Whether user has completed onboarding
     */
    onboardingCompleted: boolean;
    /**
     * RFC-004: Timestamp when onboarding was completed
     */
    onboardingCompletedAt?: string | null;
    /**
     * RFC-004: Whether user has completed seeker onboarding
     */
    seekerOnboardingCompleted: boolean;
    /**
     * RFC-004: Whether user has completed provider onboarding
     */
    providerOnboardingCompleted: boolean;
    /**
     * Step 1: Business details completed (provider onboarding)
     */
    providerBusinessStepCompleted?: boolean;
    /**
     * Step 2: Services & pricing completed (provider onboarding)
     */
    providerServicesStepCompleted?: boolean;
    /**
     * Step 3: Credentials upload completed (provider onboarding)
     */
    providerCredentialsStepCompleted?: boolean;
    createdAt: string;
};
