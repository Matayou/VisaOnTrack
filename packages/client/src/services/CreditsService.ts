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
     * Get current credit balance for authenticated provider
     * @returns any Credit balance
     * @throws ApiError
     */
    public static getBalance(): CancelablePromise<{
/**
 * Current credit balance
 */
credits: number;
}> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/credits/balance',
            errors: {
                401: `Authentication required or invalid token`,
            },
        });
    }

    /**
     * Get credit transaction history
     * Get credit transaction history for authenticated provider
     * @returns any Credit transaction history
     * @throws ApiError
     */
    public static getHistory(): CancelablePromise<{
transactions: Array<{
id: string;
/**
 * Positive (purchase/grant) or negative (spend/refund)
 */
amount: number;
type: 'PURCHASE' | 'SPEND' | 'REFUND' | 'GRANT';
reason?: string;
createdAt: string;
}>;
}> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/credits/history',
            errors: {
                401: `Authentication required or invalid token`,
            },
        });
    }

    /**
     * Purchase credits (simulated)
     * Simulate credit pack purchase and return new balance (PROVIDER role)
     * @returns any Purchase processed
     * @throws ApiError
     */
    public static purchaseCredits({
requestBody,
}: {
requestBody: {
/**
 * Credit pack identifier (e.g., pack_small, pack_medium, pack_large)
 */
packId: string;
},
}): CancelablePromise<{
success: boolean;
/**
 * Updated credit balance after purchase
 */
newBalance: number;
}> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/credits/purchase',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Authentication required or invalid token`,
                403: `Insufficient permissions`,
            },
        });
    }

}
