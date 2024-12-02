import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from '../entities/payment.entity';
import { DataSource, Not, Repository } from 'typeorm';
import { CreatePaymentRequestDto } from 'src/reservations/dto/request/create-payment-request.dto';
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
import { EventDto } from 'src/events/dto/basic/event.dto';
import { UpdatePaymentResponseDto } from '../dto/response/update-payment-response.dto';
import { UpdatePaymentRequestDto } from '../dto/request/update-payment-request.dto';

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
    //console.log(orderId, paymentMethod, totalAmount);

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
    console.log(order);
    if (!order) {
      const error = ERROR_CODES.ORDER_NOT_FOUND;
      throw new CustomException(error.code, error.message, error.httpStatus);
    }
    /* 주문자가 로그인한 사람과 같은지 검사하는 코드 */
    // if (order.user.id != user.id) {
    //   const error = ERROR_CODES.ORDER_USER_MISMATCH;
    //   throw new CustomException(error.code, error.message, error.httpStatus);
    // }

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

    const payment = await this.paymentRepository.findOne({
      where: {
        order: { id: orderId },
        paymentStatus: Not(PaymentStatus.CANCELED),
      },
      relations: ['order'],
    });
    if (payment) {
      const error = ERROR_CODES.EXISTING_PAYMENT;
      throw new CustomException(error.code, error.message, error.httpStatus);
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
      console.log(paymentInstance);

      const orderInstance = plainToInstance(OrderDto, order, {
        excludeExtraneousValues: true,
      });

      const paymentResponse = plainToInstance(
        CreatePaymentResponseDto,
        {
          user: user,
          order: orderInstance,
          payment: paymentInstance,
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

  async updatePayment(
    updatePaymentRequestDto: UpdatePaymentRequestDto,
    userId: string,
  ): Promise<CommonResponse<UpdatePaymentResponseDto>> {
    const { orderId, paymentId, newPaymentStatus } = updatePaymentRequestDto;

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
    console.log(order);
    if (!order) {
      const error = ERROR_CODES.ORDER_NOT_FOUND;
      throw new CustomException(error.code, error.message, error.httpStatus);
    }
    /* 주문자가 로그인한 사람과 같은지 검사하는 코드 */
    // if (order.user.id != user.id) {
    //   const error = ERROR_CODES.ORDER_USER_MISMATCH;
    //   throw new CustomException(error.code, error.message, error.httpStatus);
    // }

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

    const payment = await this.paymentRepository.findOne({
      where: { id: paymentId },
      relations: ['order'],
    });
    if (!payment) {
      const error = ERROR_CODES.PAYMENT_NOT_FOUND;
      throw new CustomException(error.code, error.message, error.httpStatus);
    }

    try {
      payment.paymentStatus = newPaymentStatus;

      const updatedPayment = await this.paymentRepository.save(payment);

      const paymentInstance = plainToInstance(PaymentDto, updatedPayment, {
        excludeExtraneousValues: true,
      });
      console.log(paymentInstance);

      const orderInstance = plainToInstance(OrderDto, order, {
        excludeExtraneousValues: true,
      });

      const paymentResponse = plainToInstance(
        UpdatePaymentResponseDto,
        {
          order: orderInstance,
          payment: paymentInstance,
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
