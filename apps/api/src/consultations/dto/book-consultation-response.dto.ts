import { ConsultationResponseDto } from './consultation-response.dto';

export class BookConsultationResponseDto {
  consultation: ConsultationResponseDto;

  // Only present for paid consultations
  paymentIntent?: {
    clientSecret: string;
    amount: number;
  };
}
