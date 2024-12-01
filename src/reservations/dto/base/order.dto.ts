import { Expose, Type } from 'class-transformer';
import { IsEnum } from 'class-validator';
import { BaseDto } from 'src/common/dto/base.dto';
// import { OrderStatus } from 'src/common/enum/order-status';

export class OrderDto extends BaseDto {
  // @Expose({ groups: ['basic', 'detailed'] })
  // @IsEnum(OrderStatus)
  // orderStatus: OrderStatus;
}
