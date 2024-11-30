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
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CommonResponse } from 'src/common/dto/common-response.dto';
import { CreateOrderRequestDto } from './dto/create-order-request.dto';
import { CreateOrderResponseDto } from './dto/create-order-response.dto';

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
          orderId: 'order-uuid-123',
          orderStatus: 'PENDING',
          createdAt: '2024-11-01T12:34:56.789Z',
          updatedAt: '2024-11-02T14:56:34.123Z',
          totalAmount: 12000,
          user: {
            id: 'user-uuid-123',
            name: 'John Doe',
            email: 'johndoe@example.com',
            point: 100000,
          },
          reservations: [
            {
              id: 'reservation-uuid-1',
              eventDateId: 'event-date-uuid-1',
              seatId: 'seat-uuid-1',
              price: 6000,
            },
            {
              id: 'reservation-uuid-2',
              eventDateId: 'event-date-uuid-1',
              seatId: 'seat-uuid-2',
              price: 6000,
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
