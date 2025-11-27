/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { UserRole } from './UserRole';

/**
 * RFC-004: Request to mark onboarding as complete
 */
export type CompleteOnboardingRequest = {
    /**
     * Role to complete onboarding for (must match user's actual role, SEEKER or PROVIDER only)
     */
    role: UserRole;
};
