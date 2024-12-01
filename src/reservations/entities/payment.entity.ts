import { PaymentMethod } from 'src/common/enum/payment-method';
import { PaymentStatus } from 'src/common/enum/payment-status';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Reservation } from './reservation.entity';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // @ManyToOne(() => User, (user) => user.payments)
  // user: User;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  paymentAmount: number;

  @Column({
    type: 'enum',
    enum: PaymentMethod,
    default: PaymentMethod.NONE,
  })
  paymentMethod: PaymentMethod;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  paymentStatus: PaymentStatus;

  @Column({ type: 'timestamp', nullable: true, default: null })
  paidAt: Date;

  // @OneToMany(() => Reservation, (reservation) => reservation.payment)
  // reservations: Reservation[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt?: Date;
}
