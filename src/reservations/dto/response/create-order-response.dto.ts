import { Expose, Type } from 'class-transformer';
import { IsArray, IsInt, ValidateNested } from 'class-validator';
import { ReservationDto } from '../base/reservation.dto';
import { OrderWithDetailsDto } from '../order-with-details.dto';

export class CreateOrderResponseDto {
  @Expose({ groups: ['basic', 'detailed'] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderWithDetailsDto)
  order: OrderWithDetailsDto[];

  @Expose({ groups: ['basic', 'detailed'] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReservationDto)
  reservations: ReservationDto[];
}
