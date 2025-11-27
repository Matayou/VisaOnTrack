/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Attachment } from '../models/Attachment';
import type { CreateMessageRequest } from '../models/CreateMessageRequest';
import type { Message } from '../models/Message';
import type { MessageListResponse } from '../models/MessageListResponse';
import type { UploadAttachmentRequest } from '../models/UploadAttachmentRequest';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class MessagesService {

    /**
     * List messages
     * Get messages for a request (participants only)
     * @returns MessageListResponse Message list
     * @throws ApiError
     */
    public static listMessages({
id,
page = 1,
limit = 20,
}: {
id: string,
/**
 * Page number (1-based)
 */
page?: number,
/**
 * Items per page
 */
limit?: number,
}): CancelablePromise<MessageListResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/requests/{id}/messages',
            path: {
                'id': id,
            },
            query: {
                'page': page,
                'limit': limit,
            },
            errors: {
                401: `Authentication required or invalid token`,
                403: `Insufficient permissions`,
                404: `Resource not found`,
            },
        });
    }

    /**
     * Send message
     * Send message in request thread (participants only)
     * @returns Message Message sent
     * @throws ApiError
     */
    public static sendMessage({
id,
requestBody,
}: {
id: string,
requestBody: CreateMessageRequest,
}): CancelablePromise<Message> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/requests/{id}/messages',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Authentication required or invalid token`,
                403: `Attachment count limit exceeded`,
                413: `Request payload too large (attachment size limit)`,
            },
        });
    }

    /**
     * Upload attachment
     * Upload attachment file for use in messages. Files are stored in S3/R2 and scanned for viruses.
 *
 * **Requirements:**
 * - File size must not exceed plan limit (entitlement: attachments.maxSizeMB)
 * - MIME type must be in allowlist: pdf, jpg, png, webp, docx, xlsx
 * - Attachment quota per user is enforced
 *
 * **Usage:**
 * 1. Upload file via this endpoint to get attachment ID
 * 2. Use attachment ID in POST /requests/{id}/messages (attachmentIds array)
 *
 * **Storage:**
 * - Files stored in S3/R2 with signed URLs for access
 * - Virus scan performed in background queue
 * 
     * @returns Attachment Attachment uploaded successfully
     * @throws ApiError
     */
    public static uploadAttachment({
formData,
}: {
formData: UploadAttachmentRequest,
}): CancelablePromise<Attachment> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/messages/attachments',
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                400: `Invalid request parameters or body`,
                401: `Authentication required or invalid token`,
                403: `Attachment count limit exceeded`,
                413: `Request payload too large (attachment size limit)`,
            },
        });
    }

}
