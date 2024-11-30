import { Expose, Type } from 'class-transformer';
import { IsDate, IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { PaymentMethod } from 'src/common/enum/payment-method';
import { PaymentStatus } from 'src/common/enum/payment-status';
import { EventDateDto } from 'src/events/dto/event-date-dto';
import { SeatDto } from 'src/events/dto/seat.dto';
import { EventDate } from 'src/events/entities/event-date.entity';
import { Seat } from 'src/events/entities/seat.entity';
import { UserDto } from 'src/users/dto/user.dto';
import { User } from 'src/users/entities/user.entity';

export class FindAllReservationResponseDto {
  @Expose({ groups: ['basic', 'detailed'] })
  @IsOptional()
  @IsString()
  paymentId?: string | null;

  @Expose({ groups: ['basic', 'detailed'] })
  @IsOptional()
  @IsInt()
  paymentAmount?: number | null;

  @Expose({ groups: ['basic', 'detailed'] })
  @IsOptional()
  @IsEnum(PaymentMethod)
  paymentMethod?: PaymentMethod | null;

  @Expose({ groups: ['basic', 'detailed'] })
  @IsOptional()
  @IsEnum(PaymentStatus)
  paymentStatus?: PaymentStatus | null;

  @Expose({ groups: ['basic', 'detailed'] })
  @IsOptional()
  @IsDate()
  paidAt?: Date | null;

  @Expose({ groups: ['basic', 'detailed'] })
  @IsOptional()
  @IsDate()
  paymentCreatedAt?: Date | null;

  @Expose({ groups: ['basic', 'detailed'] })
  @Type(() => User)
  user: UserDto;

  @Expose({ groups: ['basic', 'detailed'] })
  @IsString()
  reservationId: string;

  @Expose({ groups: ['basic', 'detailed'] })
  @Type(() => EventDate)
  eventDate: EventDateDto;

  @Expose({ groups: ['basic', 'detailed'] })
  @Type(() => Seat)
  seat: SeatDto;

  @Expose({ groups: ['detailed'] })
  @IsDate()
  reservatioinCreatedAt: Date;

  @Expose({ groups: ['detailed'] })
  @IsDate()
  updatedAt: Date;
}
