import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';

import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { Constants } from '../Utility/Constants';
import { JWTAccessPayloType } from '../Utility/Jwt';
import { WsExceptionFilter } from '../Utility/WsExceptionFilter';
import { forwardRef, Inject, UseFilters, UseGuards } from '@nestjs/common';
import { ConversationService } from '../Conversation/Conversation.service';
import { AuthGuard } from '../Auth/Guards/Auth.guard';
import { RoomsType } from '../Utility/Rooms';
import { ClientToServerEvents } from './DTO/types/ClientToServerEvents';
import { ServerToClientEvents } from './DTO/types/ServerToClientEvents';
import { ConversationResoponseService } from '../Conversation/ConversationResponse.service';
import { SocketEvents } from './DTO/types/Events';
import { ChatService } from './chat.service';
import { MessageResponseService } from '../Message/MessageResponse.service';
import { ConversationApiResponse } from '../Conversation/DTO/Response/ConversationApiResponse.dto';
import { MessageStatus } from '../Message/typs/MessageStatus';
import { CreateMessage } from '../Message/DTO/type/CreateMessage';
import { Message } from '../Message/Schemas/Message.schema';

export type ChatSocket = Socket<ClientToServerEvents,ServerToClientEvents>;
@WebSocketGateway(
  {
  }
)
@UseFilters(WsExceptionFilter)
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection
{

  public rooms: RoomsType = {
      "conversation": (ConvID: string) => `conversation:${ConvID}`,
      "user"        : (UserID: string) => `User:${UserID}`,
      "Location"    : (UserID: string , ConvId : string) => `Location:${UserID}|${ConvId}`
    };

  @WebSocketServer()
    public server: Server<ClientToServerEvents,ServerToClientEvents>;


  constructor(
    private readonly Jwt: JwtService,
    private readonly config: ConfigService,
    @Inject(forwardRef(() => ConversationResoponseService))
    private readonly convRespons:ConversationResoponseService,
    private readonly convService :ConversationService,
    @Inject(forwardRef(() => ChatService))
    private readonly ChatService : ChatService,
    private readonly Messageres  : MessageResponseService,
  ) {}


  afterInit(server: Server) {
    server.use(async (socket: Socket, next) => {

      const [type, token] = socket.handshake.headers.authorization?.split(' ') ?? [];

      if (!token || type !== 'Bearer') {return next(new Error('No Token Provided'));}
      let payload: JWTAccessPayloType;

      try {
        payload = await this.Jwt.verifyAsync(token, { secret: this.config.get<string>('ACCESS_TOKEN_SECRET')});
      } catch (error) {
        return next(new Error('Invalid Token'));
      }

      socket.data[Constants.CurrentUserKey] = payload;
      next();
    });
  }

  async handleConnection(socket: ChatSocket) {
    const payload: JWTAccessPayloType =socket.data[Constants.CurrentUserKey];
    const me = payload.sub;
    socket.join(this.rooms.user(me))
    const messages  = await this.Messageres.MarkMessagesAsdelivered(me);
    this.MessageChanged(messages);


  }
  async handleDisconnect(socket: ChatSocket) {
  }

  @UseGuards(AuthGuard)
  @SubscribeMessage(SocketEvents.on.Conversation_list)
  async Conversation_List(
    @ConnectedSocket() socket: ChatSocket,
  ){
      const payload: JWTAccessPayloType =socket.data[Constants.CurrentUserKey];
      const me = payload.sub;
      const conversations = await this.convService.FullData(me);
      const ArrayofConv  :ConversationApiResponse[] = []
      socket.join(this.rooms.user(me));
      for (const conversation of conversations) {
        const res =this.convRespons.prepareConvDataForApiRespone(conversation , me);
        ArrayofConv.push(res);
        const convID = res.id;
        if (this.ChatService.IsUserOnline(res.user.id)) {
          socket.join(this.rooms.conversation(convID),);
          this.server
            .to(this.rooms.user(res.user.id.toString()))
            .socketsJoin(this.rooms.conversation(convID),);
        }
      }
      socket.emit(SocketEvents.emit.ConversationList , ArrayofConv)
  }

  @UseGuards(AuthGuard)
  @SubscribeMessage(SocketEvents.on.CreateConversation)
  async CreateConversation(
    @ConnectedSocket() socket: ChatSocket,
    @MessageBody()     data:ClientToServerEvents[typeof SocketEvents.on.CreateConversation],
  ) {

    const payload: JWTAccessPayloType = socket.data[Constants.CurrentUserKey];
    const conv   = await this.convRespons.ValidCreate(payload.sub , data)
    const convid = conv._id.toString()
    const mine   = this.convRespons.prepareConvDataForApiRespone(conv , payload.sub)
    const user   = this.convRespons.prepareConvDataForApiRespone(conv , data.userId)

    socket.join(this.rooms.conversation(convid));
    this.server.to(this.rooms.user(data.userId)).socketsJoin(this.rooms.conversation(convid));

    socket.emit(SocketEvents.emit.NewConversation , mine );
    this.server.to(this.rooms.user(data.userId)).emit(SocketEvents.emit.NewConversation, user);

  }

  @UseGuards(AuthGuard)
  @SubscribeMessage(SocketEvents.on.NewMassage)
  async SendMessage(
    @ConnectedSocket() socket: ChatSocket,
    @MessageBody()       data: ClientToServerEvents[typeof SocketEvents.on.NewMassage],
  ) {
    const payload: JWTAccessPayloType = socket.data[Constants.CurrentUserKey];
    const users  = await this.ChatService.GetConversationUsers(data.conversationId , payload.sub);
    let status :MessageStatus = users.length != 0 
                              ? this.ChatService.GetStatu(data.conversationId , users[0]) 
                              : MessageStatus.send 

    const DB : CreateMessage =  { ...data, "status" : status}
    const message = await this.Messageres.CreateMessageApiResponse(payload.sub , DB) ;


    this.server
    .to(this.rooms.conversation(data.conversationId))
    .except(socket.id)
    .emit(SocketEvents.emit.NewMessage , message);
  }

  @UseGuards(AuthGuard)
  @SubscribeMessage(SocketEvents.on.user_typing)
  async Typeinductor(
    @ConnectedSocket() socket: ChatSocket,
    @MessageBody()       data: ClientToServerEvents[typeof SocketEvents.on.user_typing],
  ){
    const payload: JWTAccessPayloType = socket.data[Constants.CurrentUserKey];
    await this.convService.ValidConversation(data.conversationId , payload.sub)
    socket.to(this.rooms.conversation(data.conversationId))
    .emit(SocketEvents.emit.user_typing , {"conversationId": data.conversationId , "userId" : payload.sub })
  }

  @UseGuards(AuthGuard)
  @SubscribeMessage(SocketEvents.on.TypingStop)
  async StopTypeinductor(
    @ConnectedSocket() socket: ChatSocket,
    @MessageBody()       data: ClientToServerEvents[typeof SocketEvents.on.TypingStop],
  ){
    const payload: JWTAccessPayloType = socket.data[Constants.CurrentUserKey];
    await this.convService.ValidConversation(data.conversationId , payload.sub)
    socket.to(this.rooms.conversation(data.conversationId))
    .emit(SocketEvents.emit.stopTyping, {'userId' : payload.sub  , 'conversationId' : data.conversationId})
  }
  

  
  @UseGuards(AuthGuard)
  @SubscribeMessage(SocketEvents.on.Online)
  async online(
    @ConnectedSocket() socket: ChatSocket,
    @MessageBody()       data: ClientToServerEvents[typeof SocketEvents.on.Online],
  ){
    socket.emit(SocketEvents.emit.Online ,
                {"userid" : data.userid , 'Online' : this.ChatService.IsUserOnline(data.userid)})
  }

  @UseGuards(AuthGuard)
  @SubscribeMessage(SocketEvents.on.EnterChat)
  async EnterChat(
    @ConnectedSocket() socket: ChatSocket,
    @MessageBody()       data: ClientToServerEvents[typeof SocketEvents.on.EnterChat],
  ){
    const payload: JWTAccessPayloType = socket.data[Constants.CurrentUserKey];
    socket.join(this.rooms.Location(payload.sub , data.conversationId))
    const message = await this.Messageres.MarkMessagesAsRead(payload.sub , data.conversationId)
    await this.convRespons.ConversationOpened(payload.sub , data.conversationId)
    socket.emit(SocketEvents.emit.SeenConve )
    this.MessageChanged(message);
  }

//// Dont wait this
  private MessageChanged(messages : Message[] ){
    
    for(const x of messages){
      this.server
      .to(this.rooms.user(x._id.toString()))
      .emit(SocketEvents.emit.MessageStatue , {
          "MessageID"    : x._id.toString() ,
          "State"        : x.state ,
          "Conversation" : x.conversationId.toString()
        }

      )
    }
  }


}
