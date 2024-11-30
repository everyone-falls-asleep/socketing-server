import { OrderStatus } from 'src/common/enum/order-status';
import { User } from 'src/users/entities/user.entity';
import { Reservation } from './reservation.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

/* migration) 일단 not null 유지 */
@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // 양방향 매핑
  @ManyToOne(() => User, (user) => user.orders, {
    onDelete: 'CASCADE',
  })
  user: User;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  orderStatus: OrderStatus;

  @OneToMany(() => Reservation, (reservation) => reservation.order, {
    onDelete: 'CASCADE',
  })
  reservations: Reservation[];
}
