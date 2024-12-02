import { Expose } from 'class-transformer';
import { BaseDto } from 'src/common/dto/base.dto';

export class UserDto {
  @Expose()
  id: string;

  @Expose()
  nickname: string;

  @Expose()
  email: string;

  @Expose()
  profileImage: string;

  @Expose()
  role: string;
}
