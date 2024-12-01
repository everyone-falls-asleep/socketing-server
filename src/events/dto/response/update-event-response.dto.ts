import { Expose, Type } from 'class-transformer';
import { IsArray, IsDate, IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateEventResponseDto {
  @Expose()
  @IsString()
  id: string;

  @Expose()
  @IsString()
  title: string;

  @Expose()
  @IsOptional()
  @IsString()
  thumbnail?: string;

  @Expose()
  @IsString()
  place: string;

  @Expose()
  @IsString()
  cast: string;

  @Expose()
  @IsOptional()
  @IsInt()
  ageLimit?: number;

  // @Expose()
  // @IsArray()
  // @IsOptional()
  // @Type(() => EventDateDto)
  // eventDates?: EventDateDto[];

  @Expose()
  @IsOptional()
  @IsString()
  svg?: string;

  @Expose()
  @IsOptional()
  @IsDate()
  ticketingStartTime?: Date;

  @Expose()
  @IsDate()
  createdAt: Date;

  @Expose()
  @IsDate()
  updatedAt: Date;
}
