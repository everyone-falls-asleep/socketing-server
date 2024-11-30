import { Expose, Type } from 'class-transformer';
import { IsDate, IsString } from 'class-validator';
import { EventDateDto } from 'src/events/dto/basic/event-date-dto';
import { SeatDto } from 'src/events/dto/basic/seat.dto';
import { UserDto } from 'src/users/dto/base/user.dto';

export class CreateManyReservationResponseDto {
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
  @Type(() => UserDto)
  user: UserDto;

  @Expose({ groups: ['basic', 'detailed'] })
  @Type(() => EventDateDto)
  eventDate: EventDateDto;

  @Expose({ groups: ['basic', 'detailed'] })
  @Type(() => SeatDto)
  seat: SeatDto;

  @Expose({ groups: ['detailed'] })
  @IsDate()
  reservatioinCreatedAt: Date;

  @Expose({ groups: ['detailed'] })
  @IsDate()
  updatedAt: Date;
}
