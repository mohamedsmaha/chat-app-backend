import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CreateMessageDTO {

  @ApiProperty({
    example: '68c123456789abcdef123456',
    description: 'The conversation ID',
  })
  @IsMongoId()
  @IsNotEmpty()
  conversationId: string;

  @ApiProperty({
    example: 'Hello, how are you?',
    description: 'The message content',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  

  
}