/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Consultation } from './Consultation';

/**
 * Response after booking consultation (RFC-005)
 */
export type BookConsultationResponse = {
    consultation: Consultation;
    /**
     * Only present for paid consultations requiring payment
     */
    paymentIntent?: {
/**
 * Stripe PaymentIntent client secret for frontend
 */
clientSecret?: string;
/**
 * Amount in THB
 */
amount?: number;
} | null;
};
