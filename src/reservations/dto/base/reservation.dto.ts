import { Expose, Type } from 'class-transformer';
import { EventDateDto } from 'src/events/dto/basic/event-date-dto';
import { SeatDto } from 'src/events/dto/basic/seat.dto';
import { BaseDto } from 'src/common/dto/base.dto';

export class ReservationDto extends BaseDto {
  @Expose({ groups: ['basic', 'detailed'] })
  @Type(() => EventDateDto)
  eventDate: EventDateDto;

  @Expose({ groups: ['basic', 'detailed'] })
  @Type(() => SeatDto)
  seat: SeatDto;

  // @Expose({ groups: ['basic', 'detailed'] })
  // @Type(() => OrderDto)
  // order: OrderDto;
}
