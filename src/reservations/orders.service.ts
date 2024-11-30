import { Injectable } from '@nestjs/common';
import { Order } from './entities/order.entity';
import { DataSource, In, QueryFailedError, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonResponse } from 'src/common/dto/common-response.dto';
import { CreateOrderRequestDto } from './dto/create-order-request.dto';
import { CreateOrderResponseDto } from './dto/create-order-response.dto';
import { User } from 'src/users/entities/user.entity';
import { CustomException } from 'src/exceptions/custom-exception';
import { ERROR_CODES } from 'src/contants/error-codes';
import { OrderStatus } from 'src/common/enum/order-status';
import { Reservation } from './entities/reservation.entity';
import { EventDate } from 'src/events/entities/event-date.entity';
import { Seat } from 'src/events/entities/seat.entity';
import { plainToInstance } from 'class-transformer';
import { ReservationDto } from './dto/reservation.dto';
import { UserDto } from 'src/users/dto/user.dto';

@Injectable()
export class OrdersService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    @InjectRepository(EventDate)
    private readonly eventDateRepository: Repository<EventDate>,
    @InjectRepository(Seat)
    private readonly seatRepository: Repository<Seat>,
  ) {}

  async createOrder(
    createOrderRequestDto: CreateOrderRequestDto,
    userId: string,
  ): Promise<CommonResponse<CreateOrderResponseDto>> {
    const { eventId, eventDateId, seatIds } = createOrderRequestDto;
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      const error = ERROR_CODES.USER_NOT_FOUND;
      throw new CustomException(error.code, error.message, error.httpStatus);
    }

    const eventDate = await this.eventDateRepository.findOne({
      where: { id: eventDateId, event: { id: eventId } },
      relations: ['event'],
    });
    if (!eventDate) {
      const error = ERROR_CODES.EVENT_DATE_NOT_FOUND;
      throw new CustomException(error.code, error.message, error.httpStatus);
    }

    const seats = await this.seatRepository.find({
      where: { id: In(seatIds) },
    });

    if (seats.length !== seatIds.length) {
      const missingSeatIds = seatIds.filter(
        (seatId) => !seats.find((seat) => seat.id === seatId),
      );
      throw new Error(`Seats not found for IDs: ${missingSeatIds.join(', ')}`);
    }

    const newReservations = seats.map((seat) => {
      const reservation = this.reservationRepository.create({
        eventDate,
        seat,
      });
      return reservation;
    });

    const newOrder = this.orderRepository.create({
      user,
      orderStatus: OrderStatus.PENDING,
    });

    try {
      const savedOrder = await queryRunner.manager.save(newOrder);
      newReservations.map((r) => (r.order = savedOrder));
      const savedReservations =
        await this.reservationRepository.save(newReservations);

      const orderResponse = plainToInstance(
        CreateOrderResponseDto,
        savedOrder,
        {
          groups: ['order'],
          excludeExtraneousValues: true,
        },
      );

      orderResponse.user = plainToInstance(UserDto, savedOrder.user, {
        groups: ['order'],
        excludeExtraneousValues: true,
      });

      const reservationResponse = savedReservations.map((reservation) =>
        plainToInstance(ReservationDto, reservation, {
          groups: ['order'],
          excludeExtraneousValues: true,
        }),
      );
      orderResponse.reservations = reservationResponse;

      await queryRunner.commitTransaction();
      return new CommonResponse(orderResponse);
    } catch (e) {
      await queryRunner.rollbackTransaction();
      if (e instanceof QueryFailedError && e.driverError.code === '23505') {
        const uniqueError = ERROR_CODES.EXISTING_RESERVATION;
        throw new CustomException(
          uniqueError.code,
          uniqueError.message,
          uniqueError.httpStatus,
        );
      }
      throw e;
    } finally {
      await queryRunner.release();
    }
  }
}
