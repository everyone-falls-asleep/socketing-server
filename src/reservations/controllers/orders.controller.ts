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
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CommonResponse } from 'src/common/dto/common-response.dto';
import { OrdersService } from '../services/orders.service';
import { CreateOrderRequestDto } from '../dto/request/create-order-request.dto';
import { CreateOrderResponseDto } from '../dto/response/create-order-response.dto';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly orderService: OrdersService) {}

  @ApiOperation({
    summary: 'Create an order',
    description: 'Create an order for one or more reservations(tickets)',
  })
  @ApiResponse({
    status: 201,
    description: 'Order successfully created',
    schema: {
      example: {
        code: 0,
        message: 'Success',
        data: {
          order: [
            {
              id: 'order-id-123',
              orderStatus: 'PENDING',
              totalAmount: 250,
              user: {
                id: 'userid-123',
                nickname: '우아한하늘빛양치기',
                email: 'johndoe@example.com',
                profileImage: 'https://example.com/profile-images/default.png',
                role: 'user',
                createdAt: '2024-11-12T12:00:00.000Z',
                updatedAt: '2024-11-12T12:00:00.000Z',
                point: 1000,
              },
              createdAt: '2024-12-01T12:00:00.000Z',
              updatedAt: '2024-12-01T12:00:00.000Z',
            },
          ],
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
    description: 'The seat is already reserved for the selected event date',
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
    @Body() createorderRequestDto: CreateOrderRequestDto,
    @Req() req,
  ): Promise<CommonResponse<CreateOrderResponseDto>> {
    const { userId } = req.user;
    return this.orderService.createOrder(createorderRequestDto, userId);
  }
}
