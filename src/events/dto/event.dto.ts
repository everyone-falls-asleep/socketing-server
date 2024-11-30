import { Expose, Type } from 'class-transformer';
import { EventDateDto } from './event-date-dto';

export class EventDto {
  @Expose({ groups: ['basic', 'detailed'] })
  id: string;

  @Expose({ groups: ['basic', 'detailed', 'order'] })
  title: string;

  @Expose({ groups: ['basic', 'detailed', 'order'] })
  thumbnail: string;

  @Expose({ groups: ['basic', 'detailed', 'order'] })
  place: string;

  @Expose({ groups: ['basic', 'detailed', 'order'] })
  cast: string;

  @Expose({ groups: ['basic', 'detailed', 'order'] })
  ageLimit?: number;

  @Expose({ groups: ['detailed'] })
  svg?: string;

  @Expose({ groups: ['basic', 'detailed'] })
  ticketingStartTime?: Date;

  @Expose({ groups: ['basic', 'detailed'] })
  @Type(() => EventDateDto)
  eventDates: EventDateDto[];

  @Expose({ groups: ['detailed'] })
  createdAt: Date;

  @Expose({ groups: ['detailed'] })
  updatedAt: Date;
}
