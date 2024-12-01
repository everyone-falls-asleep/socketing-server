import { Expose, Type } from 'class-transformer';
import { OrderDto } from './base/order.dto';
import { IsInt } from 'class-validator';
import { UserDto } from 'src/users/dto/base/user.dto';

export class CreateOrderUser extends UserDto {
  @Expose({ groups: ['basic', 'detailed'] })
  point: number;
}

export class OrderWithDetailsDto extends OrderDto {
  @Expose({ groups: ['basic', 'detailed'] })
  @IsInt()
  totalAmount: number;

  @Expose({ groups: ['basic', 'detailed'] })
  @Type(() => CreateOrderUser)
  user: CreateOrderUser;
}
