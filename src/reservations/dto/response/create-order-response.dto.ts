import { Expose, Type } from 'class-transformer';
import { IsArray, IsInt, ValidateNested } from 'class-validator';
import { ReservationDto } from '../base/reservation.dto';
import { EventDto } from 'src/events/dto/basic/event.dto';
import { OrderDto } from '../base/order.dto';
import { UserWithPoint } from 'src/users/dto/user-with-point.dto';
import { ReservationWithSeatDetailsDto } from 'src/events/dto/detailed/reservation-with-seat-details.dto';
import { BasicSeatWithAreaDto } from 'src/events/dto/detailed/basic-seat-with-area.dto';

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
  @Type(() => BasicSeatWithAreaDto)
  reservations: BasicSeatWithAreaDto[];
}
