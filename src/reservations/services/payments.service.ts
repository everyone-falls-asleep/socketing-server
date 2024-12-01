import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from '../entities/payment.entity';
import { Repository } from 'typeorm';
import { CreatePaymentRequestDto } from 'src/events/dto/request/create-payment-request.dto';
import { CommonResponse } from 'src/common/dto/common-response.dto';
import { CreatePaymentResponseDto } from 'src/events/dto/response/create-payment-response.dto';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}

  async createPayment(
    createPaymentRequestDto: CreatePaymentRequestDto,
    userId: string,
  ): Promise<CommonResponse<CreatePaymentResponseDto>> {
    const {} = createPaymentRequestDto;

    return;
  }
}
