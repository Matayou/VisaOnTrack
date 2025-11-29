/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Request to book a consultation slot (RFC-005)
 */
export type BookConsultationRequest = {
    /**
     * When seeker wants to have the call (must be future date)
     */
    scheduledAt: string;
    /**
     * Seeker's notes/questions for the call
     */
    notes?: string;
};
