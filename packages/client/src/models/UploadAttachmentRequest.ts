/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * File upload request (multipart/form-data). Enforces size limits per plan and MIME allowlist per Section 9.
 */
export type UploadAttachmentRequest = {
    /**
     * File to upload. Allowed MIME types: pdf, jpg, png, webp, docx, xlsx. Size limit enforced per plan (attachments.maxSizeMB).
     */
    file: Blob;
    /**
     * Optional request ID to associate attachment with request
     */
    requestId?: string | null;
    /**
     * Optional order ID to associate attachment with order
     */
    orderId?: string | null;
};
