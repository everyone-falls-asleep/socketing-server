import { CommonResponse } from 'src/common/dto/common-response.dto';
import { CreateReservationResponseDto } from './dto/create-reservation-response.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Reservation } from './entities/reservation.entity';
import { User } from 'src/users/entities/user.entity';
import { EventDate } from 'src/events/entities/event-date.entity';
import { Seat } from 'src/events/entities/seat.entity';
import { DataSource, In, Not, QueryFailedError, Repository } from 'typeorm';
import { ERROR_CODES } from 'src/contants/error-codes';
import { CustomException } from 'src/exceptions/custom-exception';
import { plainToInstance } from 'class-transformer';
import { FindAllReservationRequestDto } from './dto/find-all-reservation-request.dto';
import { FindAllReservationResponseDto } from './dto/find-all-reservation-response.dto';
import { Injectable } from '@nestjs/common';
import { CreateReservationRequestDto } from './dto/create-reservation-request.dto';
import { Payment } from './entities/payment.entity';
import { PaymentMethod } from 'src/common/enum/payment-method';
import { PaymentStatus } from 'src/common/enum/payment-status';
import { ReservationValidatorService } from './reservations-validator.service';
import { SeatStatus } from 'src/common/enum/seat-status';
import { PaymentDto } from './dto/payment.dto';
import { ReservationDto } from './dto/reservation.dto';

@Injectable()
export class ReservationsService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly validatorService: ReservationValidatorService,
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(EventDate)
    private readonly eventDateRepository: Repository<EventDate>,
    @InjectRepository(Seat)
    private readonly seatRepository: Repository<Seat>,
  ) {}

  async createReservationWithPayment(
    createReservationRequestDto: CreateReservationRequestDto,
    userId: string,
  ): Promise<CommonResponse<CreateReservationResponseDto>> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    const { eventDateId, seatIds } = createReservationRequestDto;
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      const error = ERROR_CODES.USER_NOT_FOUND;
      throw new CustomException(error.code, error.message, error.httpStatus);
    }

    const newPayment = this.paymentRepository.create({
      user,
      paymentAmount: 0,
      paymentMethod: PaymentMethod.NONE,
      paymentStatus: PaymentStatus.Pending,
      paidAt: null,
    });

    const eventDate =
      await this.validatorService.validateEventDate(eventDateId);
    const seats = await this.validatorService.validateSeats(seatIds, eventDate);
    await this.validatorService.checkSeatAvailability(seats, eventDate);
    const seatStatus = SeatStatus.RESERVED;

    const newReservations = seats.map((seat) => {
      const reservation = this.reservationRepository.create({
        eventDate,
        seat,
        seatStatus,
      });
      return reservation;
    });

    try {
      const savedPayment = await queryRunner.manager.save(newPayment);
      const savedReservation = await queryRunner.manager.save(
        Reservation,
        newReservations,
      );

      await queryRunner.commitTransaction();

      const reservationResponse = plainToInstance(
        CreateReservationResponseDto,
        { savedPayment, savedReservation },
        {
          groups: ['detailed'],
          excludeExtraneousValues: true,
        },
      );

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

  async findAllReservationWithPayment(
    findAllReservationRequestDto: FindAllReservationRequestDto,
    userId: string,
  ): Promise<CommonResponse<FindAllReservationResponseDto>> {
    const { eventId = null } = findAllReservationRequestDto;
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      const error = ERROR_CODES.USER_NOT_FOUND;
      throw new CustomException(error.code, error.message, error.httpStatus);
    }

    const queryBuilder = this.paymentRepository
      .createQueryBuilder('payment')
      .innerJoinAndSelect('payment.user', 'user')
      .innerJoinAndSelect(
        'payment.reservation',
        'reservation',
        'reservation.payment_id = payment.id',
      )
      .innerJoinAndSelect('reservation.eventDate', 'eventDate')
      .innerJoinAndSelect('eventDate.event', 'event')
      .innerJoinAndSelect('reservation.seat', 'seat')
      .where('user.id = :userId', { userId });

    if (eventId) {
      queryBuilder.andWhere('event.id = :eventId', { eventId });
    }

    const reservationResponseData = await queryBuilder
      .select([
        'payment.id',
        'payment.paymentAmount',
        'payment.paymentMethod',
        'payment.paymentStatus',
        'payment.paidAt',
        'payment.createdAt',
        'user.id',
        'user.nickname',
        'user.email',
        'user.profileImage',
        'user.role',
        'reservation.id',
        'reservation.seatStatus',
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
        'seat.r',
        'seat.area',
        'seat.row',
        'seat.number',
        'reservation.createdAt',
        'reservation.updatedAt',
      ])
      .getMany();

      const paymentData = reservationResponseData[0];
      const reservationData = reservationResponseData;

      const paymentDto = plainToInstance(PaymentDto, paymentData, { excludeExtraneousValues: true });

      const reservationDtos = reservationData.map(reservation => {
        const reservationDto = plainToInstance(ReservationDto, reservation, { excludeExtraneousValues: true });
        return reservationDto;
      });
            
      const reservationResponse = plainToInstance(
        FindAllReservationResponseDto,
        { paymentDto, reservationDtos },
        {
          groups: ['detailed'],
          excludeExtraneousValues: true,
        },
      );

      return new CommonResponse(reservationResponse);
  }

  async findOneReservation(
    reservationId: string,
    userId: string,
  ): Promise<any> {
    const reservation = await this.reservationRepository
      .createQueryBuilder('reservation')
      .innerJoinAndSelect('reservation.user', 'user')
      .innerJoinAndSelect('reservation.eventDate', 'eventDate')
      .innerJoinAndSelect('eventDate.event', 'event')
      .innerJoinAndSelect('reservation.seat', 'seat')
      .innerJoinAndSelect('seat.event', 'seatEvent')
      .where('reservation.id = :reservationId', { reservationId })
      .andWhere('user.id = :userId', { userId })
      .select([
        'reservation.id',
        'user.id',
        'user.nickname',
        'user.email',
        'user.profileImage',
        'user.role',
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
        'seat.r',
        'seat.area',
        'seat.row',
        'seat.number',
        'reservation.createdAt',
        'reservation.updatedAt',
      ])
      .getOne();

    if (!reservation) {
      throw new CustomException(
        ERROR_CODES.RESERVATION_NOT_FOUND.code,
        ERROR_CODES.RESERVATION_NOT_FOUND.message,
        ERROR_CODES.RESERVATION_NOT_FOUND.httpStatus,
      );
    }

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
