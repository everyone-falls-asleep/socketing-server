import { Expose, Type } from 'class-transformer';
import { AreaWithSeats } from '../area-with-seats.dto';
import { IsArray, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateManySeatRequestDto {
  @ApiProperty({
    description: 'List of areas with their seats',
    type: [AreaWithSeats],
    example: {
      areas: [
        {
          id: 'area-id-1',
          label: 'VIP Section',
          price: 1000,
          svg: '<svg>...</svg>',
          seats: [
            {
              id: 'seat-id-1',
              cx: 100,
              cy: 200,
              row: 1,
              number: 1,
            },
          ],
        },
      ],
    },
  })
  @Expose({ groups: ['basic', 'detailed'] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AreaWithSeats)
  areas: AreaWithSeats[];
}

// @ApiProperty({
//   description: 'Area label where the seat is located',
//   example: 1,
//   // type: String,
// })
// @IsOptional()
// // @IsString()
// label?: string;

// @ApiProperty({
//   description: 'Price of the seat',
//   example: 77000,
//   type: Number,
// })
// @IsOptional() /* After migration, remove it */
// @IsInt()
// price?: number;
