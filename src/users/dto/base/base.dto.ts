import { Expose } from 'class-transformer';

export class BaseDto {
  @Expose({ groups: ['basic', 'detailed'] })
  id: string;

  @Expose({ groups: ['detailed'] })
  createdAt: Date;

  @Expose({ groups: ['detailed'] })
  updatedAt: Date;
}
