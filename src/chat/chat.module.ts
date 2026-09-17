import { forwardRef, Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ConversationModule } from '../Conversation/Conversation.module';
import { MessageMoudle } from '../Message/Message.module';
import { ChatService } from './chat.service';

@Module({
  providers: [ChatGateway , ChatService],
  imports  : [
    forwardRef(() => ConversationModule),
    MessageMoudle
  ],
  exports : [ChatService , ChatGateway]
})
export class ChatModule {}
