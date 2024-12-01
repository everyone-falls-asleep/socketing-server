import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from '../entities/payment.entity';
import { DataSource, Repository } from 'typeorm';
import { CreatePaymentRequestDto } from 'src/events/dto/request/create-payment-request.dto';
import { CommonResponse } from 'src/common/dto/common-response.dto';
import { CreatePaymentResponseDto } from 'src/events/dto/response/create-payment-response.dto';
import { User } from 'src/users/entities/user.entity';
import { Order } from '../entities/order.entity';
import { CustomException } from 'src/exceptions/custom-exception';
import { ERROR_CODES } from 'src/contants/error-codes';
import { PaymentStatus } from 'src/common/enum/payment-status';
import { plainToInstance } from 'class-transformer';
import { PaymentDto } from '../dto/base/payment.dto';
import { OrderDto } from '../dto/base/order.dto';
import { Reservation } from '../entities/reservation.entity';
import { ReservationDto } from '../dto/base/reservation.dto';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
  ) {}

  async createPayment(
    createPaymentRequestDto: CreatePaymentRequestDto,
    userId: string,
  ): Promise<CommonResponse<CreatePaymentResponseDto>> {
    const { orderId, paymentMethod, totalAmount } = createPaymentRequestDto;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      const error = ERROR_CODES.USER_NOT_FOUND;
      throw new CustomException(error.code, error.message, error.httpStatus);
    }

    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['reservations'],
    });
    if (!order) {
      const error = ERROR_CODES.ORDER_NOT_FOUND;
      throw new CustomException(error.code, error.message, error.httpStatus);
    }
    if (order.user.id != user.id) {
      const error = ERROR_CODES.ORDER_USER_MISMATCH;
      throw new CustomException(error.code, error.message, error.httpStatus);
    }

    const error = ERROR_CODES.RESERVATION_NOT_FOUND;
    if (!order.reservations) {
      throw new CustomException(error.code, error.message, error.httpStatus);
    } else {
      order.reservations.forEach((reservation) => {
        if (!reservation) {
          throw new CustomException(
            error.code,
            error.message,
            error.httpStatus,
          );
        }
      });
    }

    try {
      const newPayment = this.paymentRepository.create({
        order,
        paymentMethod,
        paymentAmount: totalAmount,
        paymentStatus: PaymentStatus.PENDING,
      });

      const savedPayment = await this.paymentRepository.save(newPayment);

      const paymentInstance = plainToInstance(PaymentDto, savedPayment, {
        excludeExtraneousValues: true,
      });

      const orderInstance = plainToInstance(OrderDto, order, {
        excludeExtraneousValues: true,
      });

      const reservationInstance = plainToInstance(
        ReservationDto,
        order.reservations,
        {
          excludeExtraneousValues: true,
        },
      );

      const paymentResponse = plainToInstance(
        CreatePaymentResponseDto,
        {
          order: orderInstance,
          user: user,
          payment: paymentInstance,
          reservations: reservationInstance,
        },
        { excludeExtraneousValues: true },
      );

      await queryRunner.commitTransaction();
      return new CommonResponse(paymentResponse);
    } catch (e) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
