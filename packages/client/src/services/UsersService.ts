/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CompleteOnboardingRequest } from '../models/CompleteOnboardingRequest';
import type { MarkStepCompleteRequest } from '../models/MarkStepCompleteRequest';
import type { MarkStepCompleteResponse } from '../models/MarkStepCompleteResponse';
import type { UpdateUserRequest } from '../models/UpdateUserRequest';
import type { User } from '../models/User';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class UsersService {

    /**
     * Get current user
     * Returns authenticated user profile
     * @returns User User profile
     * @throws ApiError
     */
    public static getCurrentUser(): CancelablePromise<User> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/users/me',
            errors: {
                401: `Authentication required or invalid token`,
            },
        });
    }

    /**
     * Update current user
     * Update authenticated user's profile (including role selection for account type)
     * @returns User User updated successfully
     * @throws ApiError
     */
    public static updateCurrentUser({
requestBody,
}: {
requestBody: UpdateUserRequest,
}): CancelablePromise<User> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/users/me',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request parameters or body`,
                401: `Authentication required or invalid token`,
                404: `Resource not found`,
            },
        });
    }

    /**
     * Mark provider onboarding step as complete
     * Mark a specific provider onboarding step as complete (step 1: business, 2: services, 3: credentials).
 * Used for step-by-step progress tracking.
 * 
     * @returns MarkStepCompleteResponse Step marked as complete
     * @throws ApiError
     */
    public static markProviderStepComplete({
requestBody,
}: {
requestBody: MarkStepCompleteRequest,
}): CancelablePromise<MarkStepCompleteResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/users/me/mark-provider-step-complete',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request parameters or body`,
                401: `Authentication required or invalid token`,
            },
        });
    }

    /**
     * Complete onboarding
     * Mark onboarding as complete for current user (RFC-004).
 * Sets onboarding completion flags based on user's role.
 * Role must match user's actual role (SEEKER or PROVIDER).
 * 
     * @returns User Onboarding completed successfully
     * @throws ApiError
     */
    public static completeOnboarding({
requestBody,
}: {
requestBody: CompleteOnboardingRequest,
}): CancelablePromise<User> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/users/me/complete-onboarding',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request parameters or body`,
                401: `Authentication required or invalid token`,
                404: `Resource not found`,
            },
        });
    }

}
