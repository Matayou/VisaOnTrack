/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ConsultationStatus } from './ConsultationStatus';
import type { ConsultationType } from './ConsultationType';

/**
 * Consultation offer from provider to seeker (RFC-005)
 */
export type Consultation = {
    id: string;
    /**
     * Foreign key to Request
     */
    requestId: string;
    /**
     * Foreign key to ProviderProfile
     */
    providerId: string;
    type: ConsultationType;
    /**
     * Price in Thai Baht (null for FREE consultations, ฿500-฿10,000 for PAID)
     */
    priceTHB?: number | null;
    /**
     * Call duration (15, 30, 45, or 60 minutes typical)
     */
    durationMinutes: number;
    /**
     * What will be discussed in the call
     */
    description?: string | null;
    /**
     * Zoom/Google Meet link (can be added later)
     */
    meetingLink?: string | null;
    /**
     * When the call is scheduled (set when seeker books)
     */
    scheduledAt?: string | null;
    status: ConsultationStatus;
    createdAt: string;
    updatedAt: string;
    /**
     * Provider information (included in list/get responses)
     */
    provider?: {
id?: string;
businessName?: string;
businessType?: string | null;
yearsExperience?: number | null;
verifiedAt?: string | null;
} | null;
};
