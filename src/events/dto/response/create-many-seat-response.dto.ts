import { Expose, Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { EventDto } from '../basic/event.dto';
import { AreaWithSeats } from '../area-with-seats.dto';

export class CreateManySeatResponseDto extends EventDto {
  @Expose({ groups: ['basic', 'detailed'] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AreaWithSeats)
  areas: AreaWithSeats[];
}
