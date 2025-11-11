/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Request to mark a provider onboarding step as complete
 */
export type MarkStepCompleteRequest = {
    /**
     * Step number (1: business details, 2: services & pricing, 3: credentials upload)
     */
    step: number;
};
