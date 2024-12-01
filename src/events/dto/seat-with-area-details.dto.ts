import { Expose } from 'class-transformer';
import { BaseDto } from 'src/common/dto/base.dto';
import { ApiProperty } from '@nestjs/swagger';

export class SeatWithAreaDetailsDto extends BaseDto {
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

  // @ApiProperty({
  //   description: 'Area information for the seat',
  //   type: () => AreaDto,
  // })
  // @Expose({ groups: ['basic', 'detailed'] })
  // @Type(() => AreaDto)
  // area: AreaDto;

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
}
