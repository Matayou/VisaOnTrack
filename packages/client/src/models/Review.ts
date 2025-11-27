/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Review schema per Section 3 data model
 */
export type Review = {
    id: string;
    /**
     * Foreign key to Order
     */
    orderId: string;
    /**
     * Rating 1-5 stars
     */
    rating: number;
    /**
     * Review tags (e.g., 'professional', 'timely', 'helpful')
     */
    tags: Array<string>;
    /**
     * Review text content
     */
    text?: string | null;
    createdAt: string;
};
