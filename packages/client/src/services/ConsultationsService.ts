/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BookConsultationRequest } from '../models/BookConsultationRequest';
import type { BookConsultationResponse } from '../models/BookConsultationResponse';
import type { Consultation } from '../models/Consultation';
import type { OfferConsultationRequest } from '../models/OfferConsultationRequest';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ConsultationsService {

    /**
     * Offer consultation
     * Provider offers consultation (free or paid) to seeker for a request
     * @returns Consultation Consultation offered successfully
     * @throws ApiError
     */
    public static offerConsultation({
id,
requestBody,
}: {
/**
 * Request ID
 */
id: string,
requestBody: OfferConsultationRequest,
}): CancelablePromise<Consultation> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/requests/{id}/consultations',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request parameters or body`,
                401: `Authentication required or invalid token`,
                403: `Insufficient permissions`,
                404: `Resource not found`,
            },
        });
    }

    /**
     * List consultations
     * Get all consultation offers for a request (seeker or providers who unlocked)
     * @returns Consultation Consultation list
     * @throws ApiError
     */
    public static listConsultations({
id,
}: {
/**
 * Request ID
 */
id: string,
}): CancelablePromise<Array<Consultation>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/requests/{id}/consultations',
            path: {
                'id': id,
            },
            errors: {
                401: `Authentication required or invalid token`,
                403: `Insufficient permissions`,
                404: `Resource not found`,
            },
        });
    }

    /**
     * Book consultation
     * Seeker books a consultation slot (payment required for paid consultations)
     * @returns BookConsultationResponse Consultation booked successfully
     * @throws ApiError
     */
    public static bookConsultation({
id,
requestBody,
}: {
/**
 * Consultation ID
 */
id: string,
requestBody: BookConsultationRequest,
}): CancelablePromise<BookConsultationResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/consultations/{id}/book',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request parameters or body`,
                401: `Authentication required or invalid token`,
                402: `Payment required for paid consultation`,
                403: `Insufficient permissions`,
                404: `Resource not found`,
            },
        });
    }

    /**
     * Complete consultation
     * Provider marks consultation as completed after call happens
     * @returns Consultation Consultation marked as completed
     * @throws ApiError
     */
    public static completeConsultation({
id,
}: {
/**
 * Consultation ID
 */
id: string,
}): CancelablePromise<Consultation> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/consultations/{id}/complete',
            path: {
                'id': id,
            },
            errors: {
                400: `Invalid request parameters or body`,
                401: `Authentication required or invalid token`,
                403: `Insufficient permissions`,
                404: `Resource not found`,
            },
        });
    }

    /**
     * Cancel consultation
     * Seeker or provider cancels a consultation (refund issued for paid consultations)
     * @returns Consultation Consultation cancelled successfully
     * @throws ApiError
     */
    public static cancelConsultation({
id,
}: {
/**
 * Consultation ID
 */
id: string,
}): CancelablePromise<Consultation> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/consultations/{id}/cancel',
            path: {
                'id': id,
            },
            errors: {
                400: `Invalid request parameters or body`,
                401: `Authentication required or invalid token`,
                403: `Insufficient permissions`,
                404: `Resource not found`,
            },
        });
    }

}
