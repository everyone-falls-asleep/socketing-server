import { Expose } from 'class-transformer';
import { IsEnum, IsInt, IsOptional } from 'class-validator';
import { PaymentMethod } from 'src/common/enum/payment-method';
import { PaymentStatus } from 'src/common/enum/payment-status';

export class PaymentDto {
  @Expose()
  @IsInt()
  paymentAmount: number;

  @Expose()
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @Expose()
  @IsEnum(PaymentStatus)
  paymentStatus: PaymentStatus;

  @Expose()
  @IsOptional()
  paidAt?: Date | null;
}