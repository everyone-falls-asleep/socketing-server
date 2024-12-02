import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { OrderDto } from '../base/order.dto';
import { PaymentDto } from '../base/payment.dto';

export class UpdatePaymentResponseDto {
  @Expose()
  @ValidateNested()
  @Type(() => PaymentDto)
  payment: PaymentDto;

  @Expose()
  @ValidateNested()
  @Type(() => OrderDto)
  order: OrderDto;
}
