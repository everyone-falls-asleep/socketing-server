import { Expose, Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { OrderDto } from 'src/reservations/dto/base/order.dto';
import { PaymentDto } from 'src/reservations/dto/base/payment.dto';

export class CreatePaymentResponseDto {
  @Expose({ groups: ['basic', 'detailed'] })
  @ValidateNested()
  @Type(() => OrderDto)
  order: OrderDto;

  @Expose({ groups: ['basic', 'detailed'] })
  @ValidateNested()
  @Type(() => PaymentDto)
  payment: PaymentDto;
}
