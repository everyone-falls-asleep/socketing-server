import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Seat } from './seat.entity';
import { Event } from './event.entity';

@Entity()
export class Area {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('int', { unsigned: true })
  no: number;

  @Column({ type: 'text' })
  label: string;

  @Column('int', { unsigned: true, default: 0 })
  price: number;

  @ManyToOne(() => Event, (event) => event.areas, { onDelete: 'CASCADE' })
  event: Event;

  @OneToMany(() => Seat, (seat) => seat.area, {
    cascade: true,
  })
  seats: Seat[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt?: Date;
}
