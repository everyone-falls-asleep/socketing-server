import { Expose } from 'class-transformer';
import { BaseDto } from 'src/common/dto/base.dto';

export class EventBasicDto extends BaseDto {
  @Expose()
  id: string;

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
  ticketingStartTime?: Date;
  //

  // @Expose({ groups: ['basic', 'detailed'] })
  // @Type(() => EventDateDto)
  // eventDates: EventDateDto[];
}
