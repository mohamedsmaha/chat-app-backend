import { ApiProperty } from '@nestjs/swagger';

export class MessageApiResponseDTO {

  @ApiProperty({
    example: '68c8b123456789abcdef1234',
  })
  id: string;

  @ApiProperty({
    example: '68c8b123456789abcdef5678',
  })
  senderId: string;

  @ApiProperty({
    example: 'Hello, how are you?',
  })
  content: string;

  @ApiProperty({
    example: '2026-09-16T13:40:22.123Z',
  })
  createdAt: Date;
}

