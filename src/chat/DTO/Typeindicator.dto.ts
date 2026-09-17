import { IsMongoId, IsNotEmpty } from 'class-validator';

export class TypeIndicatorDto {
  @IsNotEmpty()
  @IsMongoId()
  conversationId: string;
}