import { Expose, Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { EventDateDto } from 'src/events/dto/event-date-dto';
import { SeatDto } from 'src/events/dto/seat.dto';
import { UserDto } from 'src/users/dto/user.dto';
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
  reservations: ReservationDto[]
}
