import { AttachmentResponseDto } from './attachment-response.dto';

/**
 * DTO for a single message response
 */
export class MessageResponseDto {
  id: string;
  requestId: string;
  senderId: string;
  body: string;
  createdAt: Date;
  attachments?: AttachmentResponseDto[];
  
  // Sender info (optional, for UI)
  sender?: {
    id: string;
    name: string | null;
    email: string;
    role: string;
  };
}

/**
 * Pagination metadata
 */
export class PaginationMetaDto {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * DTO for message list response
 * GET /requests/{id}/messages
 */
export class MessageListResponseDto {
  data: MessageResponseDto[];
  meta: PaginationMetaDto;
}

