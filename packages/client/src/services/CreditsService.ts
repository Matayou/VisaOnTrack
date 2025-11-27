/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class CreditsService {

    /**
     * Get credit balance
     * Get current provider credit balance
     * @returns any Credit balance
     * @throws ApiError
     */
    public static getBalance(): CancelablePromise<{ credits: number }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/credits/balance',
            errors: {
                401: `Authentication required or invalid token`,
            },
        });
    }

    /**
     * Get credit history
     * Get credit transaction history
     * @returns any Credit history
     * @throws ApiError
     */
    public static getHistory(): CancelablePromise<any[]> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/credits/history',
            errors: {
                401: `Authentication required or invalid token`,
            },
        });
    }

    /**
     * Purchase credits
     * Simulate credit purchase (Dev only)
     * @returns any Purchase result
     * @throws ApiError
     */
    public static purchaseCredits({
packId,
}: {
packId: string,
}): CancelablePromise<{ success: boolean; newBalance: number }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/credits/purchase',
            body: { packId },
            mediaType: 'application/json',
            errors: {
                401: `Authentication required or invalid token`,
            },
        });
    }

}

