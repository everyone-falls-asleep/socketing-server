// import { OrderStatus } from 'src/common/enum/order-status';
// import { ERROR_CODES } from 'src/contants/error-codes';
// import { CustomException } from 'src/exceptions/custom-exception';
// import { OrdersService } from './services/orders.service';
// import { Order } from './entities/order.entity';
// import { DataSource, QueryRunner, Repository } from 'typeorm';
// import { User } from 'src/users/entities/user.entity';
// import { Reservation } from './entities/reservation.entity';
// import { EventDate } from 'src/events/entities/event-date.entity';
// import { Seat } from 'src/events/entities/seat.entity';
// import { getRepositoryToken } from '@nestjs/typeorm';
// import { Test, TestingModule } from '@nestjs/testing';
// import { CreateOrderRequestDto } from './dto/request/create-order-request.dto';

// describe('OrdersService', () => {
//   let service: OrdersService;
//   let orderRepository: Repository<Order>;
//   let userRepository: Repository<User>;
//   let reservationRepository: Repository<Reservation>;
//   let eventDateRepository: Repository<EventDate>;
//   let seatRepository: Repository<Seat>;
//   let dataSource: DataSource;
//   let queryRunner: QueryRunner;

//   const mockOrderRepository = {
//     create: jest.fn(),
//     save: jest.fn(),
//   };

//   const mockUserRepository = {
//     findOne: jest.fn(),
//   };

//   const mockReservationRepository = {
//     create: jest.fn(),
//     save: jest.fn(),
//   };

//   const mockEventDateRepository = {
//     findOne: jest.fn(),
//   };

//   const mockSeatRepository = {
//     find: jest.fn(),
//   };

//   const mockQueryRunner = {
//     manager: {
//       save: jest.fn(),
//     },
//     startTransaction: jest.fn(),
//     commitTransaction: jest.fn(),
//     rollbackTransaction: jest.fn(),
//     release: jest.fn(),
//   };

//   const mockDataSource = {
//     createQueryRunner: jest.fn(() => mockQueryRunner),
//   };

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         OrdersService,
//         { provide: getRepositoryToken(Order), useValue: mockOrderRepository },
//         { provide: getRepositoryToken(User), useValue: mockUserRepository },
//         { provide: getRepositoryToken(Reservation), useValue: mockReservationRepository },
//         { provide: getRepositoryToken(EventDate), useValue: mockEventDateRepository },
//         { provide: getRepositoryToken(Seat), useValue: mockSeatRepository },
//         { provide: DataSource, useValue: mockDataSource },
//       ],
//     }).compile();

//     service = module.get<OrdersService>(OrdersService);
//     orderRepository = module.get<Repository<Order>>(getRepositoryToken(Order));
//     userRepository = module.get<Repository<User>>(getRepositoryToken(User));
//     reservationRepository = module.get<Repository<Reservation>>(getRepositoryToken(Reservation));
//     eventDateRepository = module.get<Repository<EventDate>>(getRepositoryToken(EventDate));
//     seatRepository = module.get<Repository<Seat>>(getRepositoryToken(Seat));
//     dataSource = module.get<DataSource>(DataSource);
//     queryRunner = dataSource.createQueryRunner();
//   });

//   it('should be defined', () => {
//     expect(service).toBeDefined();
//   });

//   describe('createOrder', () => {
//     const mockCreateOrderRequestDto: CreateOrderRequestDto = {
//       eventId: 'event-id-123',
//       eventDateId: 'event-date-id-123',
//       seatIds: ['seat-id-1', 'seat-id-2'],
//     };

//     const mockUser: User = {
//       id: 'userid-123',
//       nickname: '우아한하늘빛양치기',
//       email: 'johndoe@example.com',
//       profileImage: 'https://example.com/profile-images/default.png',
//       role: 'user',
//       createdAt: new Date('2024-11-12T12:00:00Z'),
//       updatedAt: new Date('2024-11-12T12:00:00Z'),
//       password: 'hashed_password',
//       salt: 'random_salt',
//       orders: [],
//       events: [],
//       point: 1000,
//     };

//     const mockEvent = {
//       id: 'event-id-123',
//       title: 'The Phantom of the Opera',
//       thumbnail: 'https://example.com/phantom.jpg',
//       place: 'Seoul Arts Center',
//       cast: 'Kim Min-ji, Lee Jung-ho',
//       ageLimit: 12,
//       ticketingStartTime: new Date('2024-11-01T10:00:00Z'),
//       createdAt: new Date('2024-10-01T09:00:00Z'),
//       updatedAt: new Date('2024-10-01T09:00:00Z'),
//       eventDates: [],
//       areas: [],
//       user: {
//         id: 'user-id-123',
//         nickname: 'Event Organizer',
//         email: 'organizer@example.com',
//         profileImage: 'https://example.com/organizer.jpg',
//         role: 'admin',
//         createdAt: new Date('2024-10-01T09:00:00Z'),
//         updatedAt: new Date('2024-10-01T09:00:00Z'),
//         password: 'hashed_password',
//         salt: 'random_salt',
//         orders: [],
//         events: [],
//         point: 1000,
//       },
//     };

//     const mockEventDate: EventDate = {
//       id: 'event-date-id-123',
//       date: new Date('2024-12-25T19:30:00Z'),
//       reservations: [],
//       createdAt: new Date('2024-11-01T12:00:00Z'),
//       updatedAt: new Date('2024-11-01T12:00:00Z'),
//       event: mockEvent,
//     };

//     const mockSeats: Seat[] = [
//       {
//         id: 'seat-id-1',
//         cx: 150,
//         cy: 200,
//         row: 1,
//         number: 5,
//         area: {
//           id: 'area-id-1',
//           label: 'VIP',
//           price: 100,
//           createdAt: new Date('2024-11-01T12:00:00Z'),
//           updatedAt: new Date('2024-11-01T12:00:00Z'),
//         },
//         createdAt: new Date('2024-11-01T12:00:00Z'),
//         updatedAt: new Date('2024-11-01T12:00:00Z'),
//         reservations: [],
//       },
//       {
//         id: 'seat-id-2',
//         cx: 160,
//         cy: 210,
//         row: 2,
//         number: 10,
//         area: {
//           id: 'area-id-2',
//           label: 'General',
//           price: 150,
//           x: 10,
//           y: 20,
//           createdAt: new Date('2024-11-01T12:00:00Z'),
//           updatedAt: new Date('2024-11-01T12:00:00Z'),
//         },
//         createdAt: new Date('2024-11-01T12:00:00Z'),
//         updatedAt: new Date('2024-11-01T12:00:00Z'),
//         reservations: [],
//       },
//     ];

//     const mockSavedOrder = {
//       id: 'order-id-123',
//       user: mockUser,
//       orderStatus: OrderStatus.PENDING,
//     };

//     const mockSavedReservations = [
//       { id: 'reservation-id-1', seat: mockSeats[0] },
//       { id: 'reservation-id-2', seat: mockSeats[1] },
//     ];

//     it('should create an order successfully', async () => {
//       jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
//       jest.spyOn(eventDateRepository, 'findOne').mockResolvedValue(mockEventDate);
//       jest.spyOn(seatRepository, 'find').mockResolvedValue(mockSeats);
//       jest.spyOn(queryRunner.manager, 'save').mockResolvedValueOnce(mockSavedOrder);
//       jest.spyOn(queryRunner.manager, 'save').mockResolvedValueOnce(mockSavedReservations);

//       const result = await service.createOrder(mockCreateOrderRequestDto, 'user-id-123');

//       expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id: 'user-id-123' } });
//       expect(eventDateRepository.findOne).toHaveBeenCalledWith({
//         where: { id: 'event-date-id-123', event: { id: 'event-id-123' } },
//         relations: ['event'],
//       });
//       expect(seatRepository.find).toHaveBeenCalledWith({
//         where: { id: In(mockCreateOrderRequestDto.seatIds) },
//         relations: ['area'],
//       });
//       expect(queryRunner.manager.save).toHaveBeenCalledTimes(2);
//       expect(result).toBeInstanceOf(CommonResponse);
//       expect(result.data).toMatchObject({
//         id: 'order-id-123',
//         totalAmount: 250,
//         user: mockUser,
//         reservations: mockSavedReservations,
//       });
//     });

//     it('should throw CustomException if user is not found', async () => {
//       jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

//       await expect(
//         service.createOrder(mockCreateOrderRequestDto, 'user-id-123'),
//       ).rejects.toThrowError(CustomException);

//       expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id: 'user-id-123' } });
//     });

//     it('should throw CustomException if event date is not found', async () => {
//       jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
//       jest.spyOn(eventDateRepository, 'findOne').mockResolvedValue(null);

//       await expect(
//         service.createOrder(mockCreateOrderRequestDto, 'user-id-123'),
//       ).rejects.toThrowError(CustomException);

//       expect(eventDateRepository.findOne).toHaveBeenCalled();
//     });

//     it('should handle seat not found error', async () => {
//       jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
//       jest.spyOn(eventDateRepository, 'findOne').mockResolvedValue(mockEventDate);
//       jest.spyOn(seatRepository, 'find').mockResolvedValue([]);

//       await expect(
//         service.createOrder(mockCreateOrderRequestDto, 'user-id-123'),
//       ).rejects.toThrowError(/Seats not found/);

//       expect(seatRepository.find).toHaveBeenCalled();
//     });

//     it('should handle duplicate reservation error', async () => {
//       jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
//       jest.spyOn(eventDateRepository, 'findOne').mockResolvedValue(mockEventDate);
//       jest.spyOn(seatRepository, 'find').mockResolvedValue(mockSeats);
//       jest.spyOn(queryRunner.manager, 'save').mockImplementation(() => {
//         const driverError = {
//           message: 'Duplicate key value violates unique constraint',
//           code: '23505',
//         } as unknown as { code: string };
//         throw new QueryFailedError('query', [], driverError);
//       });

//       await expect(
//         service.createOrder(mockCreateOrderRequestDto, 'user-id-123'),
//       ).rejects.toThrowError(CustomException);

//       expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
//     });
//   });
// });
