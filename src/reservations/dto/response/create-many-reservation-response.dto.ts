import { Expose, Type } from 'class-transformer';
import { IsDate, IsString } from 'class-validator';
import { EventDateDto } from 'src/events/dto/basic/event-date-dto';
import { SeatDto } from 'src/events/dto/basic/seat.dto';
import { UserDto } from 'src/users/dto/base/user.dto';

export class CreateManyReservationResponseDto {
  @Expose({ groups: ['basic', 'detailed'] })
  @IsString()
  id: string;

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
  createdAt: Date;

  @Expose({ groups: ['detailed'] })
  @IsDate()
  updatedAt: Date;
}