/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Attachment } from './Attachment';

/**
 * Message schema per Section 3 data model
 */
export type Message = {
    id: string;
    /**
     * Foreign key to Request
     */
    requestId: string;
    /**
     * Foreign key to User (sender)
     */
    senderId: string;
    /**
     * Message content
     */
    body: string;
    createdAt: string;
    /**
     * Attachments linked to this message
     */
    attachments?: Array<Attachment> | null;
};
