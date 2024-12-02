import { Expose, Type } from 'class-transformer';
import { OrderDto } from './base/order.dto';
import { IsInt } from 'class-validator';
import { UserDto } from 'src/users/dto/base/user.dto';

export class OrderWithDetailsDto extends OrderDto {
  @Expose()
  @IsInt()
  totalAmount: number;
}
