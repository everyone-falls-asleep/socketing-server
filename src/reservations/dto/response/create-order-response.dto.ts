import { Expose, Type } from 'class-transformer';
import { IsArray, IsInt, ValidateNested } from 'class-validator';
import { ReservationDto } from '../base/reservation.dto';
import { OrderWithDetailsDto } from '../order-with-details.dto';
import { EventDto } from 'src/events/dto/basic/event.dto';
import { OrderDto } from '../base/order.dto';
import { UserWithPoint } from 'src/users/dto/user-with-point.dto';
import { ReservationWithSeatDetailsDto } from 'src/events/dto/reservation-with-seat-details.dto';

export class CreateOrderResponseDto {
  @Expose()
  id: string;

  @Expose()
  createdAt: Date;

  @Expose()
  @IsInt()
  totalAmount: number;

  @Expose()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UserWithPoint)
  user: UserWithPoint;

  @Expose()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EventDto)
  event: EventDto;

  @Expose()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReservationWithSeatDetailsDto)
  reservations: ReservationWithSeatDetailsDto[];
}
