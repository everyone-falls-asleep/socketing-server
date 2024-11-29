import { Expose, Type } from 'class-transformer';
import { IsEnum } from 'class-validator';
import { SeatStatus } from 'src/common/enum/seat-status';
import { EventDateDto } from 'src/events/dto/event-date-dto';
import { SeatDto } from 'src/events/dto/seat.dto';
import { PaymentDto } from './payment.dto';

export class ReservationDto {
  @Expose({ groups: ['basic', 'detailed'] })
  id: string;

  @Expose({ groups: ['basic', 'detailed'] })
  @Type(() => PaymentDto)
  payment: PaymentDto;

  @Expose({ groups: ['basic', 'detailed'] })
  @Type(() => EventDateDto)
  eventDate: EventDateDto;

  @Expose({ groups: ['basic', 'detailed'] })
  @Type(() => SeatDto)
  seat: SeatDto;

  @Expose({ groups: ['basic', 'detailed'] })
  @IsEnum(SeatStatus, { message: 'Invalid seat status' })
  seatStatus: SeatStatus;

  @Expose({ groups: ['basic', 'detailed'] })

  @Expose({ groups: ['detailed'] })
  createdAt: Date;

  @Expose({ groups: ['detailed'] })
  updatedAt: Date;
}
