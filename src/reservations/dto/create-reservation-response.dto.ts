import { Expose, Type } from 'class-transformer';
import { IsDate, IsString } from 'class-validator';
import { EventDateDto } from 'src/events/dto/event-date-dto';
import { SeatDto } from 'src/events/dto/seat.dto';
import { UserDto } from 'src/users/dto/user.dto';

export class CreateReservationResponseDto {
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
