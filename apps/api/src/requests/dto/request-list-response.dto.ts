import { RequestResponseDto } from './request-response.dto';

export class PaginationMetaDto {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export class RequestListResponseDto {
  data: RequestResponseDto[];
  meta: PaginationMetaDto;
}

