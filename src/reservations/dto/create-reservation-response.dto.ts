import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { PaymentDto } from './payment.dto';
import { ReservationDto } from './reservation.dto';

export class CreateReservationResponseDto {
  @ValidateNested()
  @IsNotEmpty()
  @Type(() => PaymentDto)
  payment: PaymentDto;

  @ValidateNested()
  @IsNotEmpty()
  @Type(() => PaymentDto)
  reservations: ReservationDto[];
}
