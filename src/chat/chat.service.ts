import { Server } from 'socket.io';
import { ChatGateway } from './chat.gateway';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Constants } from '../Utility/Constants';
import { MessageStatus } from '../Message/typs/MessageStatus';
import { User } from '../users/schemas/user.schema';
@Injectable()
export class ChatService {

  
  constructor(
    @Inject(forwardRef(() => ChatGateway))
    private readonly Chat: ChatGateway,
  ) {}

  public IsUserOnline(userId: string): boolean {
    const room = this.Chat.server.sockets.adapter.rooms.get(this.Chat.rooms.user(userId));
    return !!room?.size;
  }
  public UserInConversation(userId:string , ChatId:string){
    const room = this.Chat.server.sockets.adapter.rooms.get(this.Chat.rooms.Location(userId , ChatId));
    return !!room?.size;
  }

  public async GetConversationUsers(conversationId : string,excludeUserId  : string): Promise<string[]> {
    const room = this.Chat.rooms.conversation(conversationId);
    const sockets = await this.Chat.server
        .in(room)
        .fetchSockets();

    return [
        ...new Set(sockets
                .map(socket => {
                    const payload =
                        socket.data[Constants.CurrentUserKey];

                    return payload?.sub;
                })
                .filter(
                    (userId): userId is string =>
                        !!userId && userId !== excludeUserId
                )
        )
    ];
  }

  public GetStatu(conversationId:string , UserID :string):MessageStatus{
     let status :MessageStatus = MessageStatus.send
    if( this.UserInConversation(UserID , conversationId)){
      status = MessageStatus.Read
    }else if (this.IsUserOnline(UserID)){
      status = MessageStatus.delivered
    }
    return status;
  }

}