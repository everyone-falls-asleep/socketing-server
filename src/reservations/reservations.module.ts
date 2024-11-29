import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationsController } from './reservations.controller';
import { ReservationsService } from './reservations.service';
import { Reservation } from './entities/reservation.entity';
import { User } from 'src/users/entities/user.entity';
import { Seat } from 'src/events/entities/seat.entity';
import { EventDate } from 'src/events/entities/event-date.entity';
import { Payment } from './entities/payment.entity';
import { ReservationValidatorService } from './reservation-validator-service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reservation, Payment, User, Seat, EventDate]),
  ],
  controllers: [ReservationsController],
  providers: [ReservationsService, ReservationValidatorService],
  exports: [ReservationsService, TypeOrmModule],
})
export class ReservationsModule {}
