import { IsMongoId, IsNotEmpty } from 'class-validator';

export class TypeIndicatorResposneDTO {
  @IsNotEmpty()
  @IsMongoId()
  conversationId: string;
    @IsNotEmpty()
  @IsMongoId()
  userId        : string
}