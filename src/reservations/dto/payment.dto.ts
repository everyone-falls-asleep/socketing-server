import { Expose, Type } from 'class-transformer';
import { IsDate, IsEnum, IsInt, IsOptional } from 'class-validator';
import { PaymentMethod } from 'src/common/enum/payment-method';
import { PaymentStatus } from 'src/common/enum/payment-status';
import { UserDto } from 'src/users/dto/user.dto';

export class PaymentDto {
  @Expose({ groups: ['basic', 'detailed'] })
  id: string;

  @Expose({ groups: ['basic', 'detailed'] })
  @Type(() => UserDto)
  user: UserDto;

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

  @Expose({ groups: ['detailed'] })
  @IsDate()
  createdAt: Date;
}
