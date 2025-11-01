/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Quote line item
 */
export type QuoteItem = {
    /**
     * Item description
     */
    title: string;
    quantity: number;
    /**
     * Unit price in Thai Baht
     */
    priceTHB: number;
    /**
     * Calculated subtotal (quantity * priceTHB)
     */
    readonly subtotalTHB?: number;
};
