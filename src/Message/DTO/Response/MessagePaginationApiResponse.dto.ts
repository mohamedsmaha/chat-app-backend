
import { ApiProperty } from '@nestjs/swagger';
import { MessageApiResponseDTO } from './MessageApiResponse.dto';

export class MessagePaginationApiResponseDTO {

  @ApiProperty({
    type: [MessageApiResponseDTO],
  })
  data: MessageApiResponseDTO[];

  @ApiProperty({
    example: '2026-09-16T13:40:22.123Z|68c8b123456789abcdef1234',
    nullable: true,
  })
  nextCursor: string | null;
}

