import { IsInt, IsOptional, IsString } from 'class-validator';
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
    description: 'Area number of the seat',
    example: 1,
    // type: String,
  })
  @IsOptional()
  area?: number;

  @ApiProperty({
    description: 'Row number of the seat',
    example: 1,
    type: Number,
  })
  @IsInt()
  row: number;

  @ApiProperty({
    description: 'Number of the seat',
    example: 2,
    type: Number,
  })
  @IsInt()
  number: number;

  // @ApiProperty({
  //   description: 'X-coordinate of the area',
  //   example: 0,
  //   type: Number,
  // })
  // @IsOptional()
  // @IsInt()
  // x?: number;

  // @ApiProperty({
  //   description: 'Y-coordinate of the area',
  //   example: 0,
  //   type: Number,
  // })
  // @IsOptional()
  // @IsInt()
  // y?: number;

  @ApiProperty({
    description: 'SVG representation of the area',
    example: 0,
    type: String,
  })
  @IsOptional()
  @IsString()
  svg?: string;

  @ApiProperty({
    description: 'Name of the area',
    example: 'Section A',
    type: String,
  })
  @ApiProperty({
    description: 'Name of the area',
    example: 'Section A',
    type: String,
  })
  @IsOptional()
  @IsString()
  label?: string;

  @ApiProperty({
    description: 'Price of the area',
    example: '10000',
    type: String,
  })
  @IsOptional()
  @IsInt()
  price?: number;
}
