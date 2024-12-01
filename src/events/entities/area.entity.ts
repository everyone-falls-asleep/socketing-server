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
import { BaseDto } from 'src/common/dto/base.dto';

@Entity()
export class Area {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  label: string;

  @Column('int', { unsigned: true, default: 0 })
  price: number;

  @Column('int')
  x: number;

  @Column('int')
  y: number;

  @Column({ type: 'text', nullable: true })
  svg?: string;

  @ManyToOne(() => Event, (event) => event.areas, { onDelete: 'CASCADE' })
  event: Event;

  @OneToMany(() => Seat, (seat) => seat.area, {
    cascade: true,
  })
  seats: Seat[];
}
