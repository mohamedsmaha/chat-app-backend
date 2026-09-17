
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Gmail } from '../../users/Decorators/right_Gmail.decorator';

export class VerifyEmailDto {
  @ApiProperty({
    description: 'User email address',
  })
  @Gmail()
  email: string;


}

