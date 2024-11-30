import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { CreateOrderRequestDto } from './dto/request/create-order-request.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

describe('OrdersController', () => {
  let controller: OrdersController;
  let service: OrdersService;

  // 목 데이터
  const mockOrderRequest: CreateOrderRequestDto = {
    eventId: '1234',
    eventDateId: 'event-date-uuid-1',
    seatIds: ['seat-uuid-1', 'seat-uuid-2'],
  };

  const mockOrderResponse = {
    code: 0,
    message: 'Success',
    data: {
      orderId: 'order-uuid-123',
      orderStatus: 'PENDING',
      createdAt: new Date('2024-11-01'),
      updatedAt: new Date('2024-11-01'),
      totalAmount: 12000,
      user: {
        id: 'user-uuid-123',
        name: 'John Doe',
        email: 'johndoe@example.com',
        point: 100000,
      },
      reservations: [
        {
          id: 'reservation-uuid-1',
          eventDateId: 'event-date-uuid-1',
          seatId: 'seat-uuid-1',
          price: 6000,
        },
        {
          id: 'reservation-uuid-2',
          eventDateId: 'event-date-uuid-1',
          seatId: 'seat-uuid-2',
          price: 6000,
        },
      ],
    },
  };

  const mockOrdersService = {
    createOrder: jest.fn().mockResolvedValue(mockOrderResponse),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        {
          provide: OrdersService,
          useValue: mockOrdersService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<OrdersController>(OrdersController);
    service = module.get<OrdersService>(OrdersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create an order successfully', async () => {
      // Given
      const userId = 'user-uuid-123';
      const req = {
        user: { userId },
      };

      // When
      const result = await controller.create(mockOrderRequest, req);

      // Then
      expect(result).toBe(mockOrderResponse);
      expect(service.createOrder).toHaveBeenCalledWith(
        mockOrderRequest,
        userId,
      );
    });

    it('should handle unauthorized access', async () => {
      // Given
      const userId = undefined;
      const req = {
        user: { userId },
      };

      // When & Then
      await expect(controller.create(mockOrderRequest, req)).rejects.toThrow();
    });

    it('should handle conflict error when seat is already reserved', async () => {
      // Given
      const userId = 'user-uuid-123';
      const req = {
        user: { userId },
      };

      mockOrdersService.createOrder.mockRejectedValueOnce(
        new Error('Seat already reserved'),
      );

      // When & Then
      await expect(controller.create(mockOrderRequest, req)).rejects.toThrow(
        'Seat already reserved',
      );
    });
  });
});
