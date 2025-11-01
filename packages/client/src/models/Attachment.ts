/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Attachment schema per Section 3 data model
 */
export type Attachment = {
    id: string;
    /**
     * Foreign key to User (owner)
     */
    ownerUserId: string;
    /**
     * Foreign key to Request (if attached to request)
     */
    requestId?: string | null;
    /**
     * Foreign key to Order (if attached to order)
     */
    orderId?: string | null;
    /**
     * Storage key (S3/R2 object key)
     */
    key: string;
    /**
     * MIME type
     */
    mime: string;
    /**
     * File size in bytes
     */
    size: number;
};
