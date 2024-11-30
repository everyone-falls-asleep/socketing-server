import { Expose, Type } from 'class-transformer';
import { OrderDto } from 'src/reservations/dto/order.dto';
import { ReservationDto } from 'src/reservations/dto/reservation.dto';

export class UserDto {
  @Expose({ groups: ['basic', 'detailed', 'order'] })
  id: string;

  @Expose({ groups: ['basic', 'detailed', 'order'] })
  nickname: string;

  @Expose({ groups: ['basic', 'detailed', 'order'] })
  email: string;

  @Expose({ groups: ['basic', 'detailed'] })
  profileImage: string;

  @Expose({ groups: ['basic', 'detailed'] })
  role: string;

  @Expose({ groups: ['admin'] })
  password: string;

  @Expose({ groups: ['admin'] })
  salt: string;

  @Expose({ groups: ['basic', 'detailed', 'order'] })
  @Type(() => ReservationDto)
  orders: OrderDto[];

  @Expose({ groups: ['basic', 'detailed', 'order'] })
  point: number;

  @Expose({ groups: ['detailed'] })
  createdAt: Date;

  @Expose({ groups: ['detailed'] })
  updatedAt: Date;
}
