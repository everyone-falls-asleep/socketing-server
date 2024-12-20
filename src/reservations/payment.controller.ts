import {
  Body,
  Controller,
  HttpCode,
  Patch,
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
import { PaymentsService } from './payment.service';

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
          user: {
            id: '4550a86f-8d98-4ab7-802a-b3f8d31412e2',
            nickname: '냉철한금빛양치기',
            email: 'jeein@jungle.com',
            profileImage: null,
            role: 'user',
          },
          order: {
            id: 'a7cb77c7-616e-45d7-82a2-8eb7990cf7ce',
            createdAt: '2024-12-01T15:44:19.209Z',
            updatedAt: '2024-12-01T15:44:19.209Z',
            deletedAt: null,
          },
          payment: {
            id: '8a0829d9-e3af-444b-8d8b-2775943a8dcd',
            createdAt: '2024-12-01T16:43:34.116Z',
            updatedAt: '2024-12-01T16:43:34.116Z',
            deletedAt: null,
            paymentAmount: '150000',
            paymentMethod: 'socket_pay',
            paymentStatus: 'pending',
            paidAt: null,
          },
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
  create(@Body() body: any, @Req() req): Promise<CommonResponse<any>> {
    const { userId } = req.user;
    return this.paymentService.createPaymentforMigration(body, userId);
  }

  @ApiOperation({
    summary: 'Update a payment',
    description: 'Update a payment for an order',
  })
  @ApiResponse({
    status: 201,
    description: 'Payment successfully updated',
    schema: {
      example: {
        code: 0,
        message: 'Success',
        data: {
          orderId: '51733a36-83ac-4bb7-9a3b-bfc04ea1a65c',
          orderCreatedAt: '2024-12-03T15:02:54.255Z',
          orderUpdatedAt: '2024-12-03T15:02:54.255Z',
          orderDeletedAt: null,
          paymentId: 'e9686aa0-d992-41ea-8743-1ec08a7c0ace',
          paymentStatus: 'completed',
          paymentMethod: 'socket_pay',
          paymentAmount: 150000,
          paymentPaidAt: '2024-12-04T16:15:34.658Z',
          paymentCreatedAt: '2024-12-03T15:03:18.621Z',
          paymentUpdatedAt: '2024-12-04T07:15:34.664Z',
          userId: '477a51da-69f0-459f-ad7a-810623a32cdb',
          userNickname: '찬란한무지개고양이',
          userEmail: 'jeein@jungle.com',
          userProfileImage: null,
          userRole: 'user',
          eventTitle: '배치 테스트',
          eventDate: '2024-12-10T05:17:00.000Z',
          eventThumbnail: 'ㅇ',
          eventPlace: 'ㅇ',
          eventCast: 'ㅇ',
          eventAgeLimit: null,
          reservations: [
            {
              reservationId: '7113cb5b-2bd2-40b6-88d7-d6645ca4f291',
              seatId: 'd18a9cbc-3ded-4513-8390-cb758eeef60a',
              seatCx: 516,
              seatCy: 76,
              seatRow: 2,
              seatNumber: 1,
              seatAreaId: '659a8a7b-7551-4fef-ac40-05042feca06c',
              seatAreaLabel: null,
              seatAreaPrice: 100,
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
    status: 404,
    description: 'Payment not found',
    schema: {
      example: {
        code: 18,
        message: 'Payment not found',
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'This payment is already pending or completed for the order',
    schema: {
      example: {
        code: 19,
        message: 'This payment is already pending or completed for the order',
      },
    },
  })
  @ApiResponse({
    status: 402,
    description:
      'This payment is not acceptable because of insufficient balance',
    schema: {
      example: {
        code: 20,
        message:
          'This payment is not acceptable because of insufficient balance',
      },
    },
  })
  @ApiResponse({
    status: 409,
    description:
      'This payment is not acceptable because of the invalid payment request',
    schema: {
      example: {
        code: 21,
        message:
          'This payment is not acceptable because of the invalid payment request',
      },
    },
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
  @Patch()
  @HttpCode(201)
  @UseGuards(JwtAuthGuard)
  update(@Body() body: any, @Req() req): Promise<CommonResponse<any>> {
    const { userId } = req.user;
    return this.paymentService.updatePayment(body, userId);
  }
}
