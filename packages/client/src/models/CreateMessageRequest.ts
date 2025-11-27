/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Send message in request thread (participants only, attachment limits enforced)
 */
export type CreateMessageRequest = {
    body: string;
    /**
     * Attachment IDs from POST /messages/attachments (entitlement check: attachments.maxSizeMB)
     */
    attachmentIds?: Array<string>;
};
