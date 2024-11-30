import { Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsInt,
  IsString,
  ValidateNested,
} from 'class-validator';
import { UserDto } from 'src/users/dto/user.dto';
import { ReservationDto } from './reservation.dto';

export class CreateOrderResponseDto {
  @Expose({ groups: ['basic', 'detailed'] })
  @IsString()
  orderId: string;

  @Expose({ groups: ['basic', 'detailed'] })
  @IsString()
  orderStatus: string;

  @Expose({ groups: ['basic', 'detailed'] })
  @IsDate()
  createdAt: Date;

  @Expose({ groups: ['basic', 'detailed'] })
  @IsDate()
  updatedAt: Date;

  @Expose({ groups: ['basic', 'detailed'] })
  @IsInt()
  totalAmount: number;

  @Expose({ groups: ['basic', 'detailed'] })
  @ValidateNested()
  @Type(() => UserDto)
  user: UserDto;

  @Expose({ groups: ['basic', 'detailed'] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReservationDto)
  reservations: ReservationDto[];
}
