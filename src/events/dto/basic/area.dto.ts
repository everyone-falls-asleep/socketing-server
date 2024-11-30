import { Expose, Type } from 'class-transformer';
import { IsInt, IsString } from 'class-validator';
import { BaseDto } from 'src/common/dto/base.dto';

export class area extends BaseDto {
  @Expose()
  @Type(() => Event)
  event: Event;

  @Expose()
  @IsInt()
  no: number;

  @Expose()
  @IsString()
  label: string;

  @Expose()
  @IsInt()
  price: number;
}
