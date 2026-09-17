import { IsMongoId, IsNotEmpty } from 'class-validator';

export class ChatMovement {
  @IsNotEmpty()
  @IsMongoId()
  conversationId: string;
}