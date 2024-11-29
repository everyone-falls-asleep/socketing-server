import { ApiProperty } from '@nestjs/swagger';
import { ArrayUnique, IsArray, IsEnum, IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';
import { PaymentMethod } from 'src/common/enum/payment-method';
import { PaymentStatus } from 'src/common/enum/payment-status';

export class CreateReservationRequestDto { 
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
    example: ['123e4567-e89b-12d3-a456-426614174000', '223e4567-e89b-12d3-a456-426614174001'],
  })
  @IsNotEmpty()
  @IsArray()
  seatIds: string[];

  // @ApiProperty({
  //   description: 'The payment amount for the reservations',
  //   example: 100.50,
  // })
  // @IsNotEmpty()
  // @IsNumber({ allowNaN: false, allowInfinity: false }, { message: 'Payment amount must be a valid number' })
  // @Min(0, { message: 'Payment amount must be greater than or equal to 0' })
  // @Max(99999999.99, { message: 'Payment amount exceeds the maximum allowed value' })
  // paymentAmount: number;

  // @ApiProperty({
  //   description: 'The payment method used for the reservation',
  //   example: 'bank_transfer',
  // })
  // @IsNotEmpty()
  // @IsEnum(PaymentMethod, { message: 'Invalid payment method' })
  // paymentMethod: PaymentMethod;

  // @ApiProperty({
  //   description: 'The payment status of the reservation',
  //   example: 'completed',
  // })
  // @IsNotEmpty()
  // @IsEnum(PaymentStatus, { message: 'Invalid payment status' })
  // paymentStatus: PaymentStatus;
}
