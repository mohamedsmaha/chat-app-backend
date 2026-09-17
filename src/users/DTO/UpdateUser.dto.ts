
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

export class UpdateUserDTO {
  @ApiProperty({
    description: 'your username',
    minLength: 3,
    maxLength: 30,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(30)
  username?: string;

}

