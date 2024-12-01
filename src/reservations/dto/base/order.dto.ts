import { Expose, Type } from 'class-transformer';
import { IsEnum } from 'class-validator';
import { BaseDto } from 'src/common/dto/base.dto';
import { OrderStatus } from 'src/common/enum/order-status';
import { UserDto } from 'src/users/dto/base/user.dto';

export class CreateOrderUser extends UserDto {
  @Expose({ groups: ['basic', 'detailed'] })
  point: number;
}

export class OrderDto extends BaseDto {
  @Expose({ groups: ['basic', 'detailed'] })
  @Type(() => CreateOrderUser)
  user: CreateOrderUser;

  @Expose({ groups: ['basic', 'detailed'] })
  @IsEnum(OrderStatus)
  orderStatus: OrderStatus;
}
