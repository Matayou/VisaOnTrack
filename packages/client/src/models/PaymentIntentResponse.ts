/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * PaymentIntent creation response
 */
export type PaymentIntentResponse = {
    /**
     * Stripe PaymentIntent client_secret for frontend confirmation
     */
    clientSecret: string;
    /**
     * Created order ID (escrowStatus=REQUIRES_PAYMENT)
     */
    orderId: string;
};
