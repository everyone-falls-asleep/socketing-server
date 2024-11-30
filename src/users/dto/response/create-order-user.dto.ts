import { Expose, Type } from 'class-transformer';
import { UserDto } from '../base/user.dto';
import { OrderDto } from 'src/reservations/dto/base/order.dto';

export class CreateOrderUser extends UserDto {
  @Expose({ groups: ['basic', 'detailed'] })
  @Type(() => OrderDto)
  orders: OrderDto[];

  @Expose({ groups: ['basic', 'detailed'] })
  point: number;
}
