import { IsInt, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSeatRequestDto {
  @ApiProperty({
    description: 'X-coordinate of the seat',
    example: 100,
    type: Number,
  })
  @IsInt()
  cx: number;

  @ApiProperty({
    description: 'Y-coordinate of the seat',
    example: 50,
    type: Number,
  })
  @IsInt()
  cy: number;

  @ApiProperty({
    description: 'The radius of the seat',
    example: 1,
    type: Number,
  })
  @IsInt()
  r: number;

  @ApiProperty({
    description: 'Area name where the seat is located',
    example: 1,
    type: String,
  })
  @IsString()
  area: string;

  @ApiProperty({
    description: 'Row number of the seat',
    example: 1,
    type: Number,
  })
  @IsInt()
  row: number;

  @ApiProperty({
    description: 'Number of the seat within the row',
    example: 2,
    type: Number,
  })
  @IsInt()
  number: number;
}
