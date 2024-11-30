import { Expose, Type } from 'class-transformer';
import { IsEnum } from 'class-validator';
import { OrderStatus } from 'src/common/enum/order-status';
import { UserDto } from 'src/users/dto/user.dto';

export class OrderDto {
  @Expose({ groups: ['basic', 'detailed'] })
  id: string;

  @Expose({ groups: ['basic', 'detailed'] })
  @Type(() => UserDto)
  user: UserDto;

  @Expose({ groups: ['basic', 'detailed'] })
  @IsEnum(OrderStatus)
  orderStatus: OrderStatus;
}
