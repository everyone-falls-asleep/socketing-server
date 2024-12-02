import { EventDto } from './event.dto';
import { Expose, Type } from 'class-transformer';
import { BaseDto } from 'src/common/dto/base.dto';

export class EventDateDto extends BaseDto {
  @Expose()
  date: Date;

  // @Expose()
  // @Type(() => EventDto)
  // event: EventDto;

  // @Expose({ groups: ['basic', 'detailed'] })
  // @Type(() => ReservationDto)
  // reservations: ReservationDto[];
}
