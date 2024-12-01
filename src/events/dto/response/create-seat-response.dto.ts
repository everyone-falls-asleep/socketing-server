import { Expose, Type } from 'class-transformer';
import {
  IsDate,
  IsInt,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { EventDto } from '../basic/event.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSeatResponseDto {
  @Expose()
  @IsString()
  id: string;

  @ApiProperty({
    description: 'X-coordinate of the seat',
    example: 100,
    type: Number,
  })
  @Expose()
  @IsInt()
  cx: number;

  @ApiProperty({
    description: 'Y-coordinate of the seat',
    example: 50,
    type: Number,
  })
  @Expose()
  @IsInt()
  cy: number;

  @ApiProperty({
    description: 'Area number for the seat (deprecated)',
    type: () => Number,
  })
  @Expose()
  // @IsInt()
  area: number | null;

  @Expose()
  @IsInt()
  row: number;

  @Expose()
  @IsInt()
  number: number;

  @Expose()
  @ApiProperty({
    description: 'Details of the event associated with the seat',
    type: EventDto,
  })
  @ValidateNested()
  @Type(() => EventDto)
  event: EventDto;

  @Expose()
  @IsDate()
  createdAt: Date;

  @Expose()
  @IsDate()
  updatedAt: Date;

  // @Expose()
  // @ApiProperty({
  //   description: 'X-coordinate of the area',
  //   example: 100,
  //   type: Number,
  // })
  // @IsOptional()
  // @IsInt()
  // x?: number

  // @Expose()
  // @ApiProperty({
  //   description: 'Y-coordinate of the area',
  //   example: 50,
  //   type: Number,
  // })
  // @IsOptional()
  // @IsInt()
  // y?: number

  @Expose()
  @ApiProperty({
    description: 'SVG representation of the area',
    example: '<svg>...</svg>',
    type: String,
  })
  @IsOptional()
  @IsString()
  svg?: string;

  @Expose()
  @ApiProperty({
    description: 'Name of the area',
    example: 'Section A',
    type: String,
  })
  @Expose()
  @IsOptional()
  @IsString()
  label?: string;

  @ApiProperty({
    description: 'Price of the area',
    example: '10000',
    type: String,
  })
  @Expose()
  @IsOptional()
  @IsInt()
  price?: number;
}
