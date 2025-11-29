/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ConsultationType } from './ConsultationType';

/**
 * Request to offer consultation to seeker (RFC-005)
 */
export type OfferConsultationRequest = {
    type: ConsultationType;
    /**
     * Required for PAID consultations (฿500-฿10,000 range)
     */
    priceTHB?: number;
    /**
     * Call duration in minutes
     */
    durationMinutes: OfferConsultationRequest.durationMinutes;
    /**
     * What will be discussed in the call
     */
    description?: string;
    /**
     * Zoom/Google Meet link (optional, can add later)
     */
    meetingLink?: string;
};

export namespace OfferConsultationRequest {

    /**
     * Call duration in minutes
     */
    export enum durationMinutes {
        '_15' = 15,
        '_30' = 30,
        '_45' = 45,
        '_60' = 60,
    }


}
