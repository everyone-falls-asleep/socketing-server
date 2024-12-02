import { Expose, Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { OrderDto } from 'src/reservations/dto/base/order.dto';
import { PaymentDto } from 'src/reservations/dto/base/payment.dto';
import { ReservationDto } from 'src/reservations/dto/base/reservation.dto';
import { UserDto } from 'src/users/dto/base/user.dto';
import { EventDateDto } from '../basic/event-date-dto';
import { SeatDto } from '../basic/seat.dto';
import { EventDto } from '../basic/event.dto';
import { AreaDto } from '../basic/area.dto';

export class CreatePaymentResponseDto {
  @Expose()
  @ValidateNested()
  @Type(() => UserDto)
  user: UserDto;

  @Expose()
  @ValidateNested()
  @Type(() => OrderDto)
  order: OrderDto;

  @Expose()
  @ValidateNested()
  @Type(() => PaymentDto)
  payment: PaymentDto;
}
