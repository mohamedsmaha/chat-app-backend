import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UserSearchFilterDTO {
  @ApiPropertyOptional({
    example: 'mo',
    description: 'Username prefix to search for',
  })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiPropertyOptional({
    example: 10,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit: number = 10;

  @ApiPropertyOptional({
    example: 'mohamed|68c8b123456789abcdef1234',
    description: 'Cursor returned from the previous request',
  })
  @IsOptional()
  @IsString()
  cursor?: string;
}