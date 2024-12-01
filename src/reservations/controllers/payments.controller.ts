import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PaymentsService } from '../services/payments.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreatePaymentRequestDto } from 'src/events/dto/request/create-payment-request.dto';
import { CreatePaymentResponseDto } from 'src/events/dto/response/create-payment-response.dto';
import { CommonResponse } from 'src/common/dto/common-response.dto';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentService: PaymentsService) {}

  @ApiOperation({
    summary: 'Create a payment',
    description: 'Create a payment for an order',
  })
  @ApiResponse({
    status: 201,
    description: 'Payment successfully created',
    schema: {
      example: {
        code: 0,
        message: 'Success',
        data: {
          order: {
            id: 'order-id-123',
            createdAt: '2024-12-01T10:00:00.000Z',
            updatedAt: '2024-12-01T10:00:00.000Z',
          },
          payment: {
            id: 'payment-id-123',
            paymentAmount: 150.0,
            paymentMethod: 'socket_pay',
            paymentStatus: 'PENDING',
            paidAt: null,
            createdAt: '2024-12-01T10:00:00.000Z',
            updatedAt: '2024-12-01T10:00:00.000Z',
          },
          user: {
            id: 'user-id-123',
            nickname: '우아한하늘빛양치기',
            email: 'johndoe@example.com',
            profileImage: 'https://example.com/profile-images/default.png',
            role: 'user',
            createdAt: '2024-11-12T12:00:00.000Z',
            updatedAt: '2024-11-12T12:00:00.000Z',
          },
          reservations: [
            {
              id: 'reservation-id-1',
              eventDate: {
                id: 'event-date-id-123',
                date: '2024-12-25T19:30:00.000Z',
                event: {
                  id: 'event-id-123',
                  title: 'The Phantom of the Opera',
                  thumbnail: 'https://example.com/phantom.jpg',
                  place: 'Seoul Arts Center',
                  cast: 'Kim Min-ji, Lee Jung-ho',
                  ageLimit: 12,
                  ticketingStartTime: '2024-11-01T10:00:00.000Z',
                  createdAt: '2024-10-01T09:00:00.000Z',
                  updatedAt: '2024-10-01T09:00:00.000Z',
                },
              },
              seat: {
                id: 'seat-id-1',
                cx: 150,
                cy: 200,
                row: 1,
                number: 5,
                area: {
                  id: 'area-id-1',
                  label: 'VIP',
                  price: 100,
                  createdAt: '2024-11-01T12:00:00.000Z',
                  updatedAt: '2024-11-01T12:00:00.000Z',
                },
                createdAt: '2024-11-01T12:00:00.000Z',
                updatedAt: '2024-11-01T12:00:00.000Z',
              },
            },
            {
              id: 'reservation-id-2',
              eventDate: {
                id: 'event-date-id-124',
                date: '2024-12-25T19:30:00.000Z',
                event: {
                  id: 'event-id-124',
                  title: 'Les Misérables',
                  thumbnail: 'https://example.com/lesmis.jpg',
                  place: 'Seoul Arts Center',
                  cast: 'Kim Min-ji, Lee Jung-ho',
                  ageLimit: 12,
                  ticketingStartTime: '2024-11-01T10:00:00.000Z',
                  createdAt: '2024-10-01T09:00:00.000Z',
                  updatedAt: '2024-10-01T09:00:00.000Z',
                },
              },
              seat: {
                id: 'seat-id-2',
                cx: 160,
                cy: 210,
                row: 2,
                number: 10,
                area: {
                  id: 'area-id-2',
                  label: 'General',
                  price: 150,
                  createdAt: '2024-11-01T12:00:00.000Z',
                  updatedAt: '2024-11-01T12:00:00.000Z',
                },
                createdAt: '2024-11-01T12:00:00.000Z',
                updatedAt: '2024-11-01T12:00:00.000Z',
              },
            },
          ],
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Token is invalid or missing',
    schema: {
      example: {
        code: 8,
        message: 'Unauthorized',
      },
    },
  })
  @ApiResponse({
    status: 409,
    //
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    schema: {
      example: {
        code: 6,
        message: 'Internal server error',
      },
    },
  })
  @ApiBearerAuth()
  @Post()
  @HttpCode(201)
  @UseGuards(JwtAuthGuard)
  create(
    @Body() createPaymentRequestDto: CreatePaymentRequestDto,
    @Req() req,
  ): Promise<CommonResponse<CreatePaymentResponseDto>> {
    const { userId } = req.user;
    return this.paymentService.createPayment(createPaymentRequestDto, userId);
  }
}
