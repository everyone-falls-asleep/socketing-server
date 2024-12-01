import { Expose, Type } from 'class-transformer';
import { EventDto } from './event.dto';
import { ReservationDto } from 'src/reservations/dto/base/reservation.dto';
import { BaseDto } from 'src/common/dto/base.dto';
import { AreaDto } from './area.dto';
import { ApiProperty } from '@nestjs/swagger';

export class SeatDto extends BaseDto {
  @ApiProperty({
    description: 'X-coordinate of the seat',
    example: 100,
    type: Number,
  })
  @Expose({ groups: ['basic', 'detailed'] })
  cx: number;

  @ApiProperty({
    description: 'Y-coordinate of the seat',
    example: 50,
    type: Number,
  })
  @Expose({ groups: ['basic', 'detailed'] })
  cy: number;

  @ApiProperty({
    description: 'Area information for the seat',
    type: () => AreaDto,
  })
  @Expose({ groups: ['basic', 'detailed'] })
  @Type(() => AreaDto)
  area: AreaDto;

  @ApiProperty({
    description: 'Row number of the seat',
    example: 1,
    type: Number,
  })
  @Expose({ groups: ['basic', 'detailed'] })
  row: number;

  @ApiProperty({
    description: 'Number of the seat',
    example: 2,
    type: Number,
  })
  @Expose({ groups: ['basic', 'detailed'] })
  number: number;

  // @Expose({ groups: ['basic', 'detailed'] })
  // @Type(() => ReservationDto)
  // reservations: ReservationDto[];
}
