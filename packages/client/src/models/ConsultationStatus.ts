/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Consultation lifecycle status:
 * - OFFERED: Provider offered, seeker hasn't booked yet
 * - BOOKED: Seeker booked, awaiting scheduled call
 * - COMPLETED: Call happened
 * - CANCELLED: Either party cancelled
 * - EXPIRED: Offer expired (7 days after creation)
 * 
 */
export enum ConsultationStatus {
    OFFERED = 'OFFERED',
    BOOKED = 'BOOKED',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
    EXPIRED = 'EXPIRED',
}
