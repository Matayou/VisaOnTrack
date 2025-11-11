/**
 * DTO for attachment response
 * POST /messages/attachments
 */
export class AttachmentResponseDto {
  id: string;
  ownerUserId: string;
  requestId?: string;
  orderId?: string;
  key: string;
  mime: string;
  size: number;
}

