import { Expose, Type } from 'class-transformer';
import { IsDate, IsEnum, IsInt, IsOptional } from 'class-validator';
import { BaseDto } from 'src/common/dto/base.dto';
import { PaymentMethod } from 'src/common/enum/payment-method';
import { PaymentStatus } from 'src/common/enum/payment-status';
import { UserDto } from 'src/users/dto/base/user.dto';

export class PaymentDto extends BaseDto {
  // @Expose({ groups: ['basic', 'detailed'] })
  // @Type(() => UserDto)
  // user: UserDto;

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
