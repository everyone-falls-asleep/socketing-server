import { Expose } from 'class-transformer';
import { Event } from 'src/events/entities/event.entity';
import { Payment } from 'src/reservations/entities/payment.entity';

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class User {
  @Expose()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Expose()
  @Column({ unique: true })
  nickname: string;

  @Expose()
  @Column({ unique: true })
  email: string;

  @Expose()
  @Column({ nullable: true })
  profileImage: string;

  @Column({ default: 'user' })
  role: string;

  @Column()
  password: string;

  @Column({ nullable: false })
  salt: string;

  @OneToMany(() => Payment, (payment) => payment.user, {
    cascade: true,
  })
  payments: Payment[];

  @OneToMany(() => Event, (event) => event.user, {
    cascade: true,
  })
  events: Event[];

  @Expose()
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Expose()
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt?: Date;
}
