import { EventDate } from 'src/events/entities/event-date.entity';
import { Seat } from 'src/events/entities/seat.entity';

import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Payment } from './payment.entity';

@Entity()
@Unique(['seat', 'eventDate'])
export class Reservation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Payment, (payment) => payment.reservations, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  payment: Payment | null;

  @ManyToOne(() => Seat, (seat) => seat.reservations, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  seat: Seat;

  @ManyToOne(() => EventDate, (eventDate) => eventDate.reservations, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  eventDate: EventDate;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt?: Date;
}
