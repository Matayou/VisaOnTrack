/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreatePaymentIntentRequest } from '../models/CreatePaymentIntentRequest';
import type { PaymentIntentResponse } from '../models/PaymentIntentResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class CheckoutService {

    /**
     * Create PaymentIntent
     * Create Stripe Connect PaymentIntent for quote acceptance
     * @returns PaymentIntentResponse PaymentIntent created
     * @throws ApiError
     */
    public static createPaymentIntent({
requestBody,
}: {
requestBody: CreatePaymentIntentRequest,
}): CancelablePromise<PaymentIntentResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/checkout/intent',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Authentication required or invalid token`,
            },
        });
    }

}
