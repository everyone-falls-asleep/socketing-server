import { Expose } from 'class-transformer';
import { BaseDto } from 'src/common/dto/base.dto';

export class EventDto extends BaseDto {
  @Expose()
  title: string;

  @Expose()
  thumbnail: string;

  @Expose()
  place: string;

  @Expose()
  cast: string;

  @Expose()
  ageLimit?: number;

  @Expose()
  svg?: string;

  @Expose()
  ticketingStartTime?: Date;
}
