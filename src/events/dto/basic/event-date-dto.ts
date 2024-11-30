import { ReservationDto } from 'src/reservations/dto/base/reservation.dto';
import { EventDto } from './event.dto';
import { Expose, Type } from 'class-transformer';
import { BaseDto } from 'src/common/dto/base.dto';

export class EventDateDto extends BaseDto {
  @Expose({ groups: ['basic', 'detailed', 'order'] })
  date: Date;

  @Expose({ groups: ['basic', 'detailed', 'order'] })
  @Type(() => EventDto)
  event: EventDto;

  @Expose({ groups: ['basic', 'detailed'] })
  @Type(() => ReservationDto)
  reservations: ReservationDto[];
}
