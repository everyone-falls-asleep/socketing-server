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
        data: {},
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
