import { ApiProperty } from '@nestjs/swagger';

class SearchPaginationResponseDTO {
  @ApiProperty({
    example: 10,
  })
  limit: number;

  @ApiProperty({
    example: 'mohamed|68c123456789',
    nullable: true,
  })
  nextCursor: string | null;

  @ApiProperty({
    example: true,
  })
  hasNextPage: boolean;
}

export class SearchResponseDTO<T> {
  data: T[];

  @ApiProperty({
    type: SearchPaginationResponseDTO,
  })
  pagination: SearchPaginationResponseDTO;
}