import { Expose, Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { EventDto } from '../basic/event.dto';
import { AreaWithSeats } from '../area-with-seats.dto';

export class CreateManySeatResponseDto {
  @Expose()
  @Type(() => EventDto)
  event: EventDto;

  @Expose()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AreaWithSeats)
  areas: AreaWithSeats[];
}
