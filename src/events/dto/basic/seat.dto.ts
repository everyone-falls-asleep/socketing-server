import { Expose, Type } from 'class-transformer';
import { EventDto } from './event.dto';
import { ReservationDto } from 'src/reservations/dto/base/reservation.dto';
import { BaseDto } from 'src/common/dto/base.dto';

export class SeatDto extends BaseDto {
  @Expose({ groups: ['basic', 'detailed'] })
  cx: number;

  @Expose({ groups: ['basic', 'detailed'] })
  cy: number;

  @Expose({ groups: ['basic', 'detailed'] })
  area: number;

  @Expose({ groups: ['basic', 'detailed'] })
  row: number;

  @Expose({ groups: ['basic', 'detailed'] })
  number: number;

  @Expose({ groups: ['basic', 'detailed'] })
  @Type(() => EventDto)
  event: EventDto;

  @Expose({ groups: ['basic', 'detailed'] })
  @Type(() => ReservationDto)
  reservations: ReservationDto[];
}
