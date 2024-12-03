import { Expose, Type } from 'class-transformer';
import { SeatDto } from 'src/events/dto/basic/seat.dto';

export class ReservationWithSeatDetailsDto {
  @Expose()
  id: string;

  @Expose()
  @Type(() => SeatDto)
  seat: SeatDto;
}
