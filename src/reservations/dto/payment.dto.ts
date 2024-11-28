import { Expose, Type } from "class-transformer";
import { IsDate, IsEnum, IsNumber, IsOptional, Max, Min } from "class-validator";
import { PaymentMethod } from "src/common/enum/payment-method";
import { PaymentStatus } from "src/common/enum/payment-status";
import { UserDto } from "src/users/dto/user.dto";

export class PaymentDto {
  @Expose({ groups: ['basic', 'detailed'] })
  id: string;

  @Expose({ groups: ['basic', 'detailed'] })
  @Type(() => UserDto)
  user: UserDto;

  @Expose({ groups: ['basic', 'detailed'] })
  @IsNumber({ allowNaN: false, allowInfinity: false }, { message: 'Payment amount must be a valid number' })
  @Min(0, { message: 'Payment amount must be greater than or equal to 0' })
  @Max(99999999.99, { message: 'Payment amount exceeds the maximum allowed value' })
  paymentAmount: number;

  @Expose({ groups: ['basic', 'detailed'] })
  @IsEnum(PaymentMethod, { message: 'Invalid payment method' })
  paymentMethod: PaymentMethod;

  @Expose({ groups: ['basic', 'detailed'] })
  @IsEnum(PaymentStatus, { message: 'Invalid payment status' })
  paymentStatus: PaymentStatus;

  @Expose({ groups: ['basic', 'detailed'] })
  @IsOptional()
  paidAt?: Date | null;

  @Expose({ groups: ['detailed'] })
  @IsDate()
  createdAt: Date;
}