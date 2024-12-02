import { Injectable } from '@nestjs/common';
import { Order } from '../entities/order.entity';
import { DataSource, In, QueryFailedError, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonResponse } from 'src/common/dto/common-response.dto';
import { CreateOrderRequestDto } from '../dto/request/create-order-request.dto';
import { User } from 'src/users/entities/user.entity';
import { CustomException } from 'src/exceptions/custom-exception';
import { ERROR_CODES } from 'src/contants/error-codes';
// import { OrderStatus } from 'src/common/enum/order-status';
import { Reservation } from '../entities/reservation.entity';
import { EventDate } from 'src/events/entities/event-date.entity';
import { Seat } from 'src/events/entities/seat.entity';
import { plainToInstance } from 'class-transformer';
import { ReservationDto } from '../dto/base/reservation.dto';
import { CreateOrderResponseDto } from '../dto/response/create-order-response.dto';
import { UserDto } from 'src/users/dto/base/user.dto';
import { OrderWithDetailsDto } from '../dto/order-with-details.dto';
import { ReservationWithSeatDetailsDto } from 'src/events/dto/reservation-with-seat-details.dto';
import { UserWithPoint } from 'src/users/dto/user-with-point.dto';
import { EventDto } from 'src/events/dto/basic/event.dto';
import { SeatDto } from 'src/events/dto/basic/seat.dto';
import { EventBasicDto } from 'src/events/dto/event-basic-dto';

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
    body: CreateOrderRequestDto,
    userId: string,
  ): Promise<CommonResponse<CreateOrderResponseDto>> {
    console.log(body);
    const { eventId, eventDateId, seatIds } = body;

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
    console.log(eventDate.event);

    const seats = await this.seatRepository.find({
      where: { id: In(seatIds) },
      relations: ['area'],
    });

    if (seats.length !== seatIds.length) {
      const missingSeatIds = seatIds.filter(
        (seatId) => !seats.find((seat) => seat.id === seatId),
      );
      throw new Error(`Seats not found for IDs: ${missingSeatIds.join(', ')}`);
    }

    // 이미 존재하는 주문인지 예외 코드 추가하기!

    const totalAmount = seats.reduce((sum, seat) => sum + seat.area.price, 0);

    try {
      const newReservations = seats.map((seat) => {
        const reservation = this.reservationRepository.create({
          eventDate,
          seat,
        });
        return reservation;
      });

      const newOrder = this.orderRepository.create({
        user,
        // orderStatus: OrderStatus.PENDING,
        reservations: newReservations,
      });

      const savedOrder = await this.orderRepository.save(newOrder);

      const userInstance = plainToInstance(UserWithPoint, user, {
        excludeExtraneousValues: true,
      });

      const eventIstance = plainToInstance(EventBasicDto, eventDate.event, {
        excludeExtraneousValues: true,
      });
      console.log(eventIstance);

      const reservationInstances = plainToInstance(
        ReservationWithSeatDetailsDto,
        savedOrder.reservations.map((reservation) => ({
          id: reservation.id,
          seat: plainToInstance(SeatDto, reservation.seat, {
            excludeExtraneousValues: true,
          }),
        })),
        {
          excludeExtraneousValues: true,
        },
      );
      console.log(reservationInstances);

      const orderResponse = plainToInstance(
        CreateOrderResponseDto,
        {
          ...savedOrder,
          totalAmount,
          user: userInstance,
          event: eventIstance,
          reservations: reservationInstances,
        },
        {
          excludeExtraneousValues: true,
        },
      );

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
