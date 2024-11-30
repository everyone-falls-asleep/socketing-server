import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateManyReservationRequestDto {
  @ApiProperty({
    description: 'The UUID of the event for the reservation',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty()
  @IsString()
  eventId: string;

  @ApiProperty({
    description: 'The UUID of the event date for the reservation',
    example: '223e4567-e89b-12d3-a456-426614174001',
  })
  @IsNotEmpty()
  @IsString()
  eventDateId: string;

  @ApiProperty({
    description: 'The list of UUIDs of the seats being reserved',
    example: [
      '123e4567-e89b-12d3-a456-426614174000',
      '223e4567-e89b-12d3-a456-426614174001',
    ],
  })
  @IsNotEmpty()
  @IsArray()
  seatIds: string[];
}
