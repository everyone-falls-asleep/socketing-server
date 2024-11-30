import { Expose, Type } from 'class-transformer';
import { IsArray, IsInt, ValidateNested } from 'class-validator';
import { ReservationDto } from '../base/reservation.dto';
import { OrderDto } from '../base/order.dto';

export class CreateOrderResponseDto extends OrderDto {
  @Expose({ groups: ['basic', 'detailed'] })
  @IsInt()
  totalAmount: number;

  @Expose({ groups: ['basic', 'detailed'] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReservationDto)
  reservations: ReservationDto[];
}
