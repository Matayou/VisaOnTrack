import { IsString, IsNotEmpty, MaxLength, IsOptional, IsArray, IsUUID } from 'class-validator';

/**
 * DTO for creating a message
 * POST /requests/{id}/messages
 */
export class CreateMessageDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(10000)
  body: string;

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  attachmentIds?: string[];
}

