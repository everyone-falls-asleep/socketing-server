import { Injectable } from "@nestjs/common";
import { Seat } from "src/events/entities/seat.entity";
import { EventDate } from "src/events/entities/event-date.entity";
import { Reservation } from "./entities/reservation.entity";
import { EventDateDto } from "src/events/dto/event-date-dto";
import { SeatDto } from "src/events/dto/seat.dto";
import { In, Not, Repository } from "typeorm";
import { SeatStatus } from "src/common/enum/seat-status";
import { CustomException } from "src/exceptions/custom-exception";
import { ERROR_CODES } from "src/contants/error-codes";

@Injectable()
export class ReservationValidatorService {
  constructor(
    private readonly eventDateRepository: Repository<EventDate>,
    private readonly seatRepository: Repository<Seat>,
    private readonly reservationRepository: Repository<Reservation>,
  ) {}

  async validateEventDate(eventDateId: string) {
    const eventDate = await this.eventDateRepository.findOne({
      where: { id: eventDateId }
    });
    
    if (!eventDate) {
      const error = ERROR_CODES.EVENT_DATE_NOT_FOUND;
      throw new CustomException(error.code, error.message, error.httpStatus);
    }
    
    return eventDate;
  }

  async validateSeats(seatIds: string[], eventDate: EventDateDto) {
    const seats = await this.seatRepository.find({
      where: { 
        id: In(seatIds), 
        event: { id: eventDate.event.id }
      }
    });

    if (seats.length !== seatIds.length) {
      const foundIds = seats.map(seat => seat.id);
      const missingIds = seatIds.filter(id => !foundIds.includes(id));
      
      const error = ERROR_CODES.SEAT_NOT_FOUND;
      throw new CustomException(
        error.code, 
        `${error.message}: ${missingIds.join(', ')}`, 
        error.httpStatus
      );
    }

    return seats;
  }

  async checkSeatAvailability(seats: SeatDto[], eventDate: EventDateDto) {
    const existingReservations = await this.reservationRepository.find({
      where: {
        eventDate: { id: eventDate.id },
        seat: { id: In(seats.map(seat => seat.id)) },
        seatStatus: Not(SeatStatus.AVAILABLE)
      }
    });

    if (existingReservations.length > 0) {
      const unavailableSeats = existingReservations.map(r => ({
        seatId: r.seat.id,
        status: r.seatStatus
      }));
      
      const error = ERROR_CODES.EXISTING_RESERVATION;
      throw new CustomException(
        error.code,
        `${error.message}: ${unavailableSeats.map(s => 
          `${s.seatId}(${s.status})`
        ).join(', ')}`,
        error.httpStatus
      );
    }
  }
}