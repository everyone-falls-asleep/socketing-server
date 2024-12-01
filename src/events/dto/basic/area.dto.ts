import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsInt, IsString } from 'class-validator';
import { BaseDto } from 'src/common/dto/base.dto';

export class AreaDto extends BaseDto {
  // @Expose()
  // @Type(() => Event)
  // event: Event;

  @ApiProperty({
    description: 'Name of the area',
    example: 'Section A',
    type: String,
  })
  @Expose()
  @IsString()
  label: string;

  @Expose()
  @IsInt()
  price: number;
}
