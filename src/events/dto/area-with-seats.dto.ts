import { Expose, Type } from 'class-transformer';
import { IsArray, IsString, ValidateNested } from 'class-validator';
import { SeatDto } from './basic/seat.dto';
import { AreaDto } from './basic/area.dto';
import { ApiProperty } from '@nestjs/swagger';
import { SeatWithAreaDetailsDto } from './seat-with-area-details.dto';

export class AreaWithSeats extends AreaDto {
  // @ApiProperty({
  //   description: 'X-coordinate of the area',
  //   example: 100,
  //   type: Number,
  // })
  // @Expose()
  // @IsInt()
  // x: number;

  // @ApiProperty({
  //   description: 'Y-coordinate of the area',
  //   example: 50,
  //   type: Number,
  // })
  // @Expose()
  // @IsInt()
  // y: number;

  @ApiProperty({
    description: 'SVG representation of the area',
    example: '<svg>...</svg>',
    type: String,
  })
  @Expose()
  @IsString()
  svg: string;

  @ApiProperty({
    description: 'List of seats in the area',
    type: [SeatDto],
  })
  @Expose({ groups: ['basic', 'detailed'] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SeatWithAreaDetailsDto)
  seats: SeatWithAreaDetailsDto[];
}
