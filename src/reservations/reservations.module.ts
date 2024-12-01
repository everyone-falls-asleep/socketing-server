import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationsService } from './services/reservations.service';
import { Reservation } from './entities/reservation.entity';
import { User } from 'src/users/entities/user.entity';
import { Seat } from 'src/events/entities/seat.entity';
import { EventDate } from 'src/events/entities/event-date.entity';
import { Area } from 'src/events/entities/area.entity';
import { Order } from './entities/order.entity';
import { ReservationsController } from './controllers/reservations.controller';
import { OrdersController } from './controllers/orders.controller';
import { OrdersService } from './services/orders.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Reservation,
      User,
      Seat,
      Area,
      Order,
      Event,
      EventDate,
    ]),
  ],
  controllers: [ReservationsController, OrdersController],
  providers: [ReservationsService, OrdersService],
  exports: [ReservationsService, OrdersService, TypeOrmModule],
})
export class ReservationsModule {}
