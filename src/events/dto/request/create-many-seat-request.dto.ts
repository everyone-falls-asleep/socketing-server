import { Expose, Type } from 'class-transformer';
import { AreaWithSeats } from '../area-with-seats.dto';
import { IsArray, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateManySeatRequestDto {
  @ApiProperty({
    description: 'List of areas with their seats',
    type: [AreaWithSeats],
  })
  @Expose({ groups: ['basic', 'detailed'] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AreaWithSeats)
  areas: AreaWithSeats[];
}
