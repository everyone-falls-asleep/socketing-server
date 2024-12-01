import { IsInt, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { Area } from 'src/events/entities/area.entity';

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

  @ApiProperty({
    description: 'Area label where the seat is located',
    example: 1,
    // type: String,
  })
  @IsOptional()
  // @IsString()
  label?: string;

  @ApiProperty({
    description: 'Area number of the seat',
    example: 77000,
    // type: String,
  })
  // @IsString()
  area: string | number; // no로 변경 예정

  @ApiProperty({
    description: 'Area number of the seat',
    example: 77000,
    // type: number,
  })
  // @IsInt()
  @IsOptional()
  no?: number;

  

  @ApiProperty({
    description: 'Price of the seat',
    example: 77000,
    type: Number,
  })
  @IsOptional() /* After migration, remove it */
  @IsInt()
  price?: number;
}
