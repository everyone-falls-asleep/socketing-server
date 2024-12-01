import { Expose } from 'class-transformer';
import { BaseDto } from 'src/common/dto/base.dto';

export class EventDto extends BaseDto {
  @Expose({ groups: ['basic', 'detailed'] })
  title: string;

  @Expose({ groups: ['basic', 'detailed'] })
  thumbnail: string;

  //
  @Expose({ groups: ['basic', 'detailed'] })
  place: string;

  @Expose({ groups: ['basic', 'detailed'] })
  cast: string;

  @Expose({ groups: ['basic', 'detailed'] })
  ageLimit?: number;

  @Expose({ groups: ['detailed'] })
  svg?: string;

  @Expose({ groups: ['basic', 'detailed'] })
  ticketingStartTime?: Date;
  //

  // @Expose({ groups: ['basic', 'detailed'] })
  // @Type(() => EventDateDto)
  // eventDates: EventDateDto[];
}
