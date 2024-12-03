import { Expose, Type } from 'class-transformer';
import { IsInt } from 'class-validator';
import { OrderDto } from '../base/order.dto';

export class OrderWithAmount extends OrderDto {
  @Expose()
  @IsInt()
  totalAmount: number;
}
