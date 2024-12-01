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
          id: '550e8400-e29b-41d4-a716-446655440000',
          createdAt: '2024-12-01T09:00:00.000Z',
          updatedAt: '2024-12-01T09:00:00.000Z',
          user: {
            id: '7a1b5400-e29b-41d4-a716-446655440001',
            nickname: 'John Doe',
            email: 'john@example.com',
            profileImage: 'https://example.com/profile/john.jpg',
            role: 'user',
          },
          orderStatus: 'pending',
          totalAmount: 150000,
          reservations: [
            {
              id: '9c4e8400-e29b-41d4-a716-446655440002',
              eventDate: {
                id: '8b3d8400-e29b-41d4-a716-446655440003',
                date: '2024-12-25T19:30:00.000Z',
                event: {
                  id: '6f2c8400-e29b-41d4-a716-446655440004',
                  title: 'The Phantom of the Opera',
                  thumbnail: 'https://example.com/events/phantom.jpg',
                  place: 'Seoul Arts Center',
                  cast: 'Kim Min-ji, Lee Jung-ho',
                  ageLimit: 12,
                  ticketingStartTime: '2024-11-01T10:00:00.000Z',
                },
              },
              seat: {
                id: '5a1c8400-e29b-41d4-a716-446655440005',
                cx: 150,
                cy: 200,
                row: 5,
                number: 12,
                area: {
                  id: '4b1b8400-e29b-41d4-a716-446655440006',
                  label: 'R',
                  price: 150000,
                },
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
