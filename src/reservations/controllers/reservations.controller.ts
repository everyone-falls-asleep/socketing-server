import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CommonResponse } from 'src/common/dto/common-response.dto';
import { ReservationsService } from '../services/reservations.service';
import { CreateReservationRequestDto } from '../dto/request/create-reservation-request.dto';
import { CreateReservationResponseDto } from '../dto/response/create-reservation-response.dto';

@ApiTags('Orders')
@Controller('orders')
export class ReservationsController {
  constructor(private readonly reservationService: ReservationsService) {}

  @ApiOperation({
    summary: 'Create a reservation',
    description:
      'Create a reservation for a specific event, event date, and seat.',
  })
  @ApiResponse({
    status: 201,
    description: 'Reservation successfully created',
    schema: {
      example: {
        code: 0,
        message: 'Success',
        data: {},
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Token is invalid or missing',
    schema: {
      example: {
        code: 8,
        message: 'Unauthorized',
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'The seat is already reserved for the selected event date',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    schema: {
      example: {
        code: 6,
        message: 'Internal server error',
      },
    },
  })
  @ApiBearerAuth()
  @Post()
  @HttpCode(201)
  @UseGuards(JwtAuthGuard)
  create(
    @Body() createReservationRequestDto: CreateReservationRequestDto,
    @Req() req,
  ): Promise<CommonResponse<CreateReservationResponseDto>> {
    const { userId } = req.user;
    return this.reservationService.createReservation(
      createReservationRequestDto,
      userId,
    );
  }

  //   @ApiOperation({
  //     summary: 'Get all reservations for events',
  //     description:
  //       'Fetch all reservations for a specific event if `eventId` is provided, otherwise fetch all reservations for the authenticated user.',
  //   })
  //   @ApiQuery({
  //     name: 'eventId',
  //     type: 'string',
  //     required: false,
  //     description:
  //       'The UUID of the event to fetch reservations for. If not provided, all reservations for the authenticated user will be returned.',
  //     example: 'ba1cdf2b-69ec-473f-a501-47a7b1e73602',
  //   })
  //   @ApiResponse({
  //     status: 200,
  //     description: 'Reservation successfully created',
  //     schema: {
  //       example: {
  //         code: 0,
  //         message: 'Success',
  //         data: [
  //           {
  //             id: '414114a0-7c18-4a98-bdad-31f8a186fa28',
  //             createdAt: '2024-11-17T18:16:30.304Z',
  //             updatedAt: '2024-11-17T18:16:30.304Z',
  //             user: {
  //               id: 'f55235ae-4496-4982-9b0d-24ec3a61d438',
  //               nickname: 'new_nickname',
  //               email: 'se1620236@naver.com',
  //               profileImage: null,
  //               role: 'user',
  //             },
  //             eventDate: {
  //               id: '016d3b2c-31b3-408a-a8df-a77b8777b0a3',
  //               date: '2024-12-01T19:00:00.000Z',
  //               event: {
  //                 id: 'ba1cdf2b-69ec-473f-a501-47a7b1e73602',
  //                 title: 'Music Festival',
  //                 thumbnail: 'https://example.com/thumbnail.jpg',
  //                 place: 'Central Park',
  //                 cast: 'Famous Band',
  //                 ageLimit: 18,
  //               },
  //             },
  //             seat: {
  //               id: '5b54820d-d6b8-4eea-840f-f191881198ac',
  //               cx: 100,
  //               cy: 100,
  //               area: 1,
  //               row: 1,
  //               number: 3,
  //             },
  //           },
  //           {
  //             id: 'fc9409f1-bbc9-44d1-8f53-e00d4964e9d2',
  //             createdAt: '2024-11-17T18:31:05.888Z',
  //             updatedAt: '2024-11-17T18:31:05.888Z',
  //             user: {
  //               id: 'f55235ae-4496-4982-9b0d-24ec3a61d438',
  //               nickname: 'new_nickname',
  //               email: 'se1620236@naver.com',
  //               profileImage: null,
  //               role: 'user',
  //             },
  //             eventDate: {
  //               id: 'aad8e60c-7973-40c6-b53e-335ac03a2af0',
  //               date: '2024-12-02T19:00:00.000Z',
  //               event: {
  //                 id: 'ba1cdf2b-69ec-473f-a501-47a7b1e73602',
  //                 title: 'Music Festival',
  //                 thumbnail: 'https://example.com/thumbnail.jpg',
  //                 place: 'Central Park',
  //                 cast: 'Famous Band',
  //                 ageLimit: 18,
  //               },
  //             },
  //             seat: {
  //               id: '5b54820d-d6b8-4eea-840f-f191881198ac',
  //               cx: 100,
  //               cy: 100,
  //               area: 1,
  //               row: 1,
  //               number: 3,
  //             },
  //           },
  //         ],
  //       },
  //     },
  //   })
  //   @ApiResponse({
  //     status: 401,
  //     description: 'Unauthorized - Token is invalid or missing',
  //     schema: {
  //       example: {
  //         code: 8,
  //         message: 'Unauthorized',
  //       },
  //     },
  //   })
  //   @ApiResponse({
  //     status: 500,
  //     description: 'Internal server error',
  //     schema: {
  //       example: {
  //         code: 6,
  //         message: 'Internal server error',
  //       },
  //     },
  //   })
  //   @ApiBearerAuth()
  //   @Get()
  //   @HttpCode(200)
  //   @UseGuards(JwtAuthGuard)
  //   findAll(
  //     @Query() findAllReservationRequestDto: FindAllReservationRequestDto,
  //     @Req() req,
  //   ): Promise<CommonResponse<FindAllReservationResponseDto[]>> {
  //     const { userId } = req.user;
  //     return this.reservationService.findAllReservation(
  //       findAllReservationRequestDto,
  //       userId,
  //     );
  //   }

  //   @ApiOperation({
  //     summary: 'Get a specific reservation',
  //     description: 'Fetch details of a specific reservation by its ID.',
  //   })
  //   @ApiParam({
  //     name: 'reservationId',
  //     type: 'string',
  //     description: 'The UUID of the reservation to fetch.',
  //     required: true,
  //     example: '34c32626-3f06-47c9-9515-aece077290ef',
  //   })
  //   @ApiResponse({
  //     status: 200,
  //     description: 'Reservation successfully created',
  //     schema: {
  //       example: {
  //         code: 0,
  //         message: 'Success',
  //         data: {
  //           id: '414114a0-7c18-4a98-bdad-31f8a186fa28',
  //           createdAt: '2024-11-17T18:16:30.304Z',
  //           updatedAt: '2024-11-17T18:16:30.304Z',
  //           user: {
  //             id: 'f55235ae-4496-4982-9b0d-24ec3a61d438',
  //             nickname: 'new_nickname',
  //             email: 'se1620236@naver.com',
  //             profileImage: null,
  //             role: 'user',
  //           },
  //           eventDate: {
  //             id: '016d3b2c-31b3-408a-a8df-a77b8777b0a3',
  //             date: '2024-12-01T19:00:00.000Z',
  //             event: {
  //               id: 'ba1cdf2b-69ec-473f-a501-47a7b1e73602',
  //               title: 'Music Festival',
  //               thumbnail: 'https://example.com/thumbnail.jpg',
  //               place: 'Central Park',
  //               cast: 'Famous Band',
  //               ageLimit: 18,
  //             },
  //           },
  //           seat: {
  //             id: '5b54820d-d6b8-4eea-840f-f191881198ac',
  //             cx: 100,
  //             cy: 100,
  //             area: 1,
  //             row: 1,
  //             number: 3,
  //           },
  //         },
  //       },
  //     },
  //   })
  //   @ApiResponse({
  //     status: 401,
  //     description: 'Unauthorized - Token is invalid or missing',
  //     schema: {
  //       example: {
  //         code: 8,
  //         message: 'Unauthorized',
  //       },
  //     },
  //   })
  //   @ApiResponse({
  //     status: 404,
  //     description: 'Reservation not found or not owned by the user.',
  //     schema: {
  //       example: {
  //         code: 14,
  //         message: 'Reservation not found',
  //       },
  //     },
  //   })
  //   @ApiResponse({
  //     status: 500,
  //     description: 'Internal server error',
  //     schema: {
  //       example: {
  //         code: 6,
  //         message: 'Internal server error',
  //       },
  //     },
  //   })
  //   @ApiBearerAuth()
  //   @Get(':reservationId')
  //   @HttpCode(200)
  //   @UseGuards(JwtAuthGuard)
  //   findOne(
  //     @Param('reservationId') reservationId: string,
  //     @Req() req,
  //   ): Promise<any> {
  //     const { userId } = req.user;
  //     return this.reservationService.findOneReservation(reservationId, userId);
  //   }

  //   @ApiOperation({
  //     summary: 'Soft delete a reservation',
  //     description:
  //       'Soft delete a specific reservation by its ID. This will mark the reservation as deleted without removing it from the database.',
  //   })
  //   @ApiParam({
  //     name: 'reservationId',
  //     type: 'string',
  //     required: true,
  //     description: 'The UUID of the reservation to delete.',
  //     example: '34c32626-3f06-47c9-9515-aece077290ef',
  //   })
  //   @ApiResponse({
  //     status: 204,
  //     description: 'The reservation was successfully deleted.',
  //   })
  //   @ApiResponse({
  //     status: 401,
  //     description: 'Unauthorized - Token is invalid or missing',
  //     schema: {
  //       example: {
  //         code: 8,
  //         message: 'Unauthorized',
  //       },
  //     },
  //   })
  //   @ApiResponse({
  //     status: 404,
  //     description: 'Reservation not found or not owned by the user.',
  //     schema: {
  //       example: {
  //         code: 14,
  //         message: 'Reservation not found',
  //       },
  //     },
  //   })
  //   @ApiResponse({
  //     status: 500,
  //     description: 'Internal server error',
  //     schema: {
  //       example: {
  //         code: 6,
  //         message: 'Internal server error',
  //       },
  //     },
  //   })
  //   @ApiBearerAuth()
  //   @Delete(':reservationId')
  //   @HttpCode(204)
  //   @UseGuards(JwtAuthGuard)
  //   softDeleteReservation(
  //     @Param('reservationId') reservationId: string,
  //     @Req() req,
  //   ) {
  //     const { userId } = req.user;
  //     return this.reservationService.softDeleteReservation(reservationId, userId);
  //   }
}
