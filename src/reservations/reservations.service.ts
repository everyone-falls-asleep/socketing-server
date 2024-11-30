import { CommonResponse } from 'src/common/dto/common-response.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { EventDate } from 'src/events/entities/event-date.entity';
import { Seat } from 'src/events/entities/seat.entity';
import { DataSource, QueryFailedError, Repository } from 'typeorm';
import { ERROR_CODES } from 'src/contants/error-codes';
import { CustomException } from 'src/exceptions/custom-exception';
import { plainToInstance } from 'class-transformer';
import { EventDateDto } from 'src/events/dto/basic/event-date-dto';
import { SeatDto } from 'src/events/dto/basic/seat.dto';
import { UserDto } from 'src/users/dto/base/user.dto';
import { Injectable } from '@nestjs/common';
import { PaymentMethod } from 'src/common/enum/payment-method';
import { PaymentStatus } from 'src/common/enum/payment-status';
import { Payment } from './entities/payment.entity';
import { Reservation } from './entities/reservation.entity';
import { CreateReservationResponseDto } from './dto/response/create-reservation-response.dto';
import { CreateReservationRequestDto } from './dto/create-reservation-request.dto';
import { FindAllReservationRequestDto } from './dto/find-all-reservation-request.dto';
import { FindAllReservationResponseDto } from './dto/response/find-all-reservation-response.dto';

@Injectable()
export class ReservationsService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(EventDate)
    private readonly eventDateRepository: Repository<EventDate>,
    @InjectRepository(Seat)
    private readonly seatRepository: Repository<Seat>,
  ) {}

  async createReservation(
    createReservationRequestDto: CreateReservationRequestDto,
    userId: string,
  ): Promise<CommonResponse<CreateReservationResponseDto>> {
    const { eventId, eventDateId, seatId } = createReservationRequestDto;
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      const error = ERROR_CODES.USER_NOT_FOUND;
      throw new CustomException(error.code, error.message, error.httpStatus);
    }

    const newPayment = this.paymentRepository.create({
      user,
      paymentAmount: 0,
      paymentMethod: PaymentMethod.NONE,
      paymentStatus: PaymentStatus.READY,
      paidAt: null,
    });

    const eventDate = await this.eventDateRepository.findOne({
      where: { id: eventDateId, event: { id: eventId } },
      relations: ['event'],
    });
    if (!eventDate) {
      const error = ERROR_CODES.EVENT_DATE_NOT_FOUND;
      throw new CustomException(error.code, error.message, error.httpStatus);
    }

    const seat = await this.seatRepository.findOne({
      where: { id: seatId, event: { id: eventId } },
      relations: ['event'],
    });
    if (!seat) {
      const error = ERROR_CODES.SEAT_NOT_FOUND;
      throw new CustomException(error.code, error.message, error.httpStatus);
    }

    const newReservation = this.reservationRepository.create({
      eventDate,
      seat,
    });

    try {
      const savedPayment = await queryRunner.manager.save(newPayment);
      newReservation.payment = newPayment;
      const savedReservation =
        await this.reservationRepository.save(newReservation);

      const reservationResponse = plainToInstance(
        CreateReservationResponseDto,
        savedPayment,
        {
          groups: ['detailed'],
          excludeExtraneousValues: true,
        },
      );

      reservationResponse.eventDate = plainToInstance(
        EventDateDto,
        savedReservation.eventDate,
        {
          groups: ['basic'],
          excludeExtraneousValues: true,
        },
      );

      reservationResponse.seat = plainToInstance(
        SeatDto,
        savedReservation.seat,
        {
          groups: ['basic'],
          excludeExtraneousValues: true,
        },
      );

      reservationResponse.user = plainToInstance(UserDto, savedPayment.user, {
        groups: ['basic'],
        excludeExtraneousValues: true,
      });

      await queryRunner.commitTransaction();
      return new CommonResponse(reservationResponse);
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

  async findAllReservation(
    findAllReservationRequestDto: FindAllReservationRequestDto,
    userId: string,
  ): Promise<CommonResponse<FindAllReservationResponseDto[]>> {
    const { eventId } = findAllReservationRequestDto;

    const queryBuilder = this.paymentRepository
      .createQueryBuilder('payment')
      .leftJoinAndSelect('payment.user', 'paymentUser')
      .leftJoinAndSelect('payment.reservations', 'reservation')
      .leftJoinAndSelect('reservation.user', 'reservationUser')
      .leftJoinAndSelect('reservation.eventDate', 'eventDate')
      .leftJoinAndSelect('eventDate.event', 'event')
      .leftJoinAndSelect('reservation.seat', 'seat')
      .andWhere('paymentUser.id = :userId OR reservationUser.id = :userId', {
        userId,
      });
    if (eventId) {
      queryBuilder.andWhere('event.id = :eventId', { eventId });
    }

    const reservationsData = await queryBuilder
      .select([
        'payment.id AS paymentId',
        'payment.paymentAmount',
        'payment.paymentMethod',
        'payment.paymentStatus',
        'payment.paidAt',
        'payment.createdAt AS paymentCreatedAt',
        'COALESCE(paymentUser.id, reservationUser.id) AS userId',
        'COALESCE(paymentUser.nickname, reservationUser.nickname) AS userNickname',
        'COALESCE(paymentUser.email, reservationUser.email) AS userEmail',
        'reservation.id AS reservationId',
        'eventDate.id',
        'eventDate.date',
        'event.id',
        'event.title',
        'event.thumbnail',
        'event.place',
        'event.cast',
        'event.ageLimit',
        'seat.id',
        'seat.cx',
        'seat.cy',
        'seat.area',
        'seat.row',
        'seat.number',
        'seat.price',
        'reservation.createdAt AS reservationCreatedAt',
        'reservation.updatedAt',
      ])
      .getMany();

    const reservations = plainToInstance(
      FindAllReservationResponseDto,
      reservationsData,
      {
        excludeExtraneousValues: true,
      },
    );

    return new CommonResponse(reservations);
  }

  async findOneReservation(
    reservationId: string,
    userId: string,
  ): Promise<any> {
    const reservationData = await this.reservationRepository
      .createQueryBuilder('payment')
      .leftJoinAndSelect('payment.user', 'paymentUser')
      .leftJoinAndSelect('payment.reservations', 'reservation')
      .leftJoinAndSelect('reservation.user', 'reservationUser')
      .leftJoinAndSelect('reservation.eventDate', 'eventDate')
      .leftJoinAndSelect('eventDate.event', 'event')
      .leftJoinAndSelect('reservation.seat', 'seat')
      .andWhere('paymentUser.id = :userId OR reservationUser.id = :userId', {
        userId,
      })
      .andWhere('reservation.id = :reservationId', { reservationId })
      .select([
        'payment.id AS paymentId',
        'payment.paymentAmount',
        'payment.paymentMethod',
        'payment.paymentStatus',
        'payment.paidAt',
        'payment.createdAt AS paymentCreatedAt',
        'COALESCE(paymentUser.id, reservationUser.id) AS userId',
        'COALESCE(paymentUser.nickname, reservationUser.nickname) AS userNickname',
        'COALESCE(paymentUser.email, reservationUser.email) AS userEmail',
        'reservation.id AS reservationId',
        'eventDate.id',
        'eventDate.date',
        'event.id',
        'event.title',
        'event.thumbnail',
        'event.place',
        'event.cast',
        'event.ageLimit',
        'seat.id',
        'seat.cx',
        'seat.cy',
        'seat.area',
        'seat.row',
        'seat.number',
        'seat.price',
        'reservation.createdAt AS reservationCreatedAt',
        'reservation.updatedAt',
      ])
      .getOne();

    if (!reservationData) {
      throw new CustomException(
        ERROR_CODES.RESERVATION_NOT_FOUND.code,
        ERROR_CODES.RESERVATION_NOT_FOUND.message,
        ERROR_CODES.RESERVATION_NOT_FOUND.httpStatus,
      );
    }

    const reservation = plainToInstance(
      FindAllReservationResponseDto,
      reservationData,
      {
        excludeExtraneousValues: true,
      },
    );

    return new CommonResponse(reservation);
  }

  async softDeleteReservation(reservationId: string, userId: string) {
    const reservation = await this.reservationRepository
      .createQueryBuilder('reservation')
      .innerJoin('reservation.user', 'user')
      .where('reservation.id = :reservationId', { reservationId })
      .andWhere('user.id = :userId', { userId })
      .getOne();

    if (!reservation) {
      throw new CustomException(
        ERROR_CODES.RESERVATION_NOT_FOUND.code,
        ERROR_CODES.RESERVATION_NOT_FOUND.message,
        ERROR_CODES.RESERVATION_NOT_FOUND.httpStatus,
      );
    }

    await this.reservationRepository.softRemove(reservation);
  }
}
