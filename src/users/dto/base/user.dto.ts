import { Expose } from 'class-transformer';
import { BaseDto } from 'src/reservations/dto/base/base.dto';

export class UserDto extends BaseDto {
  @Expose({ groups: ['basic', 'detailed'] })
  nickname: string;

  @Expose({ groups: ['basic', 'detailed'] })
  email: string;

  @Expose({ groups: ['basic', 'detailed'] })
  profileImage: string;

  @Expose({ groups: ['basic', 'detailed'] })
  role: string;

  @Expose({ groups: ['admin'] })
  password: string;

  @Expose({ groups: ['admin'] })
  salt: string;
}
