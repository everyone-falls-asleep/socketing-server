import { Expose } from 'class-transformer';
import { IsDate, IsString } from 'class-validator';

export class BaseDto {
  @Expose()
  @IsString()
  id: string;

  @Expose()
  @IsDate()
  createdAt: Date;

  @Expose()
  @IsDate()
  updatedAt: Date;
}
