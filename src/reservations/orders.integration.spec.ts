import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

describe('OrdersController (Integration)', () => {
  let app: INestApplication;
  let jwtToken: string;

  const mockOrderRequest = {
    eventDateId: 'event-date-uuid-1',
    seatIds: ['seat-uuid-1', 'seat-uuid-2'],
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // JWT 토큰 설정 (실제 환경에서는 로그인 프로세스를 통해 얻어야 함)
    jwtToken = 'mock-jwt-token';
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /orders', () => {
    it('should create an order successfully', () => {
      return request(app.getHttpServer())
        .post('/orders')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send(mockOrderRequest)
        .expect(201)
        .expect((res) => {
          expect(res.body.code).toBe(0);
          expect(res.body.message).toBe('Success');
          expect(res.body.data).toHaveProperty('orderId');
          expect(res.body.data.orderStatus).toBe('PENDING');
          expect(res.body.data.reservations).toHaveLength(2);
        });
    });

    it('should return 401 when token is missing', () => {
      return request(app.getHttpServer())
        .post('/orders')
        .send(mockOrderRequest)
        .expect(401);
    });

    it('should return 409 when seat is already reserved', () => {
      // 이미 예약된 좌석으로 테스트
      const conflictRequest = {
        eventDateId: 'event-date-uuid-1',
        seatIds: ['already-reserved-seat'],
      };

      return request(app.getHttpServer())
        .post('/orders')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send(conflictRequest)
        .expect(409);
    });
  });
});
