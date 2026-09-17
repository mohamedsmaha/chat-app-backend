
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { StrongPassword } from '../Decorators/Strong_Password.decorator';
import { Gmail } from '../Decorators/right_Gmail.decorator';

export class CreateUserDto {
  @ApiProperty({
    description: 'User email address',
  })
  @Gmail()
  email: string;

  @ApiProperty({
    description: 'your username',
    minLength: 3,
    maxLength: 30,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(30)
  username: string;

  @ApiProperty({
    description:
      'Password must be at least 8 characters and contain uppercase, lowercase, number, and special character.',
    example: 'Mohamed123!',
  })
  @StrongPassword()
  password: string;
}

