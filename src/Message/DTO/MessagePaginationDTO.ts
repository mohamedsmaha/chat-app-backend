import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class MessagePaginationDTO {

  @ApiPropertyOptional({
    example: 20,
    default: 20,
    description: 'Number of messages to return',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit: number = 20;

  @ApiPropertyOptional({
    example: '2026-09-16T13:40:22.123Z|68c8b123456789abcdef1234',
    description: 'Cursor returned from the previous request',
  })
  @IsOptional()
  @IsString()
  cursor?: string;
}