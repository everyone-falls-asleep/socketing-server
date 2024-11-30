import { Expose, Type } from 'class-transformer';
import { EventDateDto } from 'src/events/dto/event-date-dto';
import { SeatDto } from 'src/events/dto/seat.dto';
import { UserDto } from 'src/users/dto/user.dto';
import { OrderDto } from './order.dto';

export class ReservationDto {
  @Expose({ groups: ['basic', 'detailed', 'order'] })
  id: string;

  @Expose({ groups: ['basic', 'detailed'] })
  @Type(() => UserDto)
  user: UserDto;

  @Expose({ groups: ['basic', 'detailed', 'order'] })
  @Type(() => EventDateDto)
  eventDate: EventDateDto;

  @Expose({ groups: ['basic', 'detailed', 'order'] })
  @Type(() => SeatDto)
  seat: SeatDto;

  @Expose({ groups: ['basic', 'detailed', 'order'] })
  @Type(() => OrderDto)
  order: OrderDto;

  @Expose({ groups: ['detailed'] })
  createdAt: Date;

  @Expose({ groups: ['detailed'] })
  updatedAt: Date;
}
