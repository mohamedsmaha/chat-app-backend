
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { StrongPassword } from '../../users/Decorators/Strong_Password.decorator';

export class ResetPasswordDto {
  
  @ApiProperty({
    description:
      'Password must be at least 8 characters and contain uppercase, lowercase, number, and special character.',
    example: 'Mohamed123!',
  })
  @StrongPassword()
  password: string;


}

