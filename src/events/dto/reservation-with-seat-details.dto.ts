import { Expose, Type } from 'class-transformer';
import { SeatDto } from 'src/events/dto/basic/seat.dto';
import { BaseDto } from 'src/common/dto/base.dto';
import { EventDto } from './basic/event.dto';

export class ReservationWithSeatDetailsDto extends BaseDto {
  @Expose({ groups: ['basic', 'detailed'] })
  @Type(() => SeatDto)
  seat: SeatDto;
}
