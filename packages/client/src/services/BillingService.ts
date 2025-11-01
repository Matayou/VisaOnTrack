/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CheckoutSessionResponse } from '../models/CheckoutSessionResponse';
import type { CreateCheckoutSessionRequest } from '../models/CreateCheckoutSessionRequest';
import type { CustomerPortalResponse } from '../models/CustomerPortalResponse';
import type { EntitlementsResponse } from '../models/EntitlementsResponse';
import type { Subscription } from '../models/Subscription';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class BillingService {

    /**
     * Create checkout session
     * Create Stripe Checkout session for plan upgrade (PROVIDER role)
     * @returns CheckoutSessionResponse Checkout session created
     * @throws ApiError
     */
    public static createCheckoutSession({
requestBody,
}: {
requestBody: CreateCheckoutSessionRequest,
}): CancelablePromise<CheckoutSessionResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/billing/checkout-session',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Authentication required or invalid token`,
            },
        });
    }

    /**
     * Get customer portal URL
     * Get Stripe Customer Portal session URL (PROVIDER role)
     * @returns CustomerPortalResponse Portal URL
     * @throws ApiError
     */
    public static getCustomerPortal(): CancelablePromise<CustomerPortalResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/billing/portal',
            errors: {
                401: `Authentication required or invalid token`,
            },
        });
    }

    /**
     * Get subscription
     * Get current subscription details (PROVIDER role)
     * @returns Subscription Subscription details
     * @throws ApiError
     */
    public static getSubscription(): CancelablePromise<Subscription> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/billing/subscription',
            errors: {
                401: `Authentication required or invalid token`,
                404: `No active subscription`,
            },
        });
    }

    /**
     * Get entitlements
     * Get full entitlements + usage counters (PROVIDER role)
     * @returns EntitlementsResponse Entitlements and usage
     * @throws ApiError
     */
    public static getEntitlements(): CancelablePromise<EntitlementsResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/billing/entitlements/me',
            errors: {
                401: `Authentication required or invalid token`,
            },
        });
    }

    /**
     * Stripe webhook handler
     * Stripe Billing webhook endpoint (no auth, signature verification required)
     * @returns any Webhook processed (idempotent)
     * @throws ApiError
     */
    public static handleBillingWebhook({
requestBody,
}: {
requestBody: Record<string, any>,
}): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/billing/webhook',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid webhook signature or payload`,
            },
        });
    }

}
