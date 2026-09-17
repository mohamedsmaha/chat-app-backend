import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class FindMessagesDTO {

  @ApiProperty({
    example: '68c123456789abcdef123456',
    description: 'The conversation ID',
  })
  @IsMongoId()
  @IsNotEmpty()
  conversationId: string;

}