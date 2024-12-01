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

  @Expose({ groups: ['basic', 'detailed'] })
  @IsInt()
  paymentAmount: number;

  @Expose({ groups: ['basic', 'detailed'] })
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @Expose({ groups: ['basic', 'detailed'] })
  @IsEnum(PaymentStatus)
  paymentStatus: PaymentStatus;

  @Expose({ groups: ['basic', 'detailed'] })
  @IsOptional()
  paidAt?: Date | null;
}
