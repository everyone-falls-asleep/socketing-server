import { Expose, Type } from 'class-transformer';
import { SeatStatus } from 'src/common/enum/seat-status';
import { EventDateDto } from 'src/events/dto/event-date-dto';
import { SeatDto } from 'src/events/dto/seat.dto';
import { UserDto } from 'src/users/dto/user.dto';

// 결합도를 낮추기 위해 ReservationDto는 PaymentDto를 참조하지 않음
export class ReservationDto {
  @Expose({ groups: ['basic', 'detailed'] })
  id: string;

  @Expose({ groups: ['basic', 'detailed'] })
  @Type(() => EventDateDto)
  eventDate: EventDateDto;

  @Expose({ groups: ['basic', 'detailed'] })
  @Type(() => SeatDto)
  seat: SeatDto;

  @Expose({ groups: ['basic', 'detailed'] })
  seatStatus: SeatStatus;

  @Expose({ groups: ['detailed'] })
  createdAt: Date;

  @Expose({ groups: ['detailed'] })
  updatedAt: Date;
}
