import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { User } from "../users/schemas/user.schema";
import { UserService } from "../users/users.service";
import { ConversationService } from "./Conversation.service";
import { CreateConversationDto } from "./DTO/Create_Conversation.DTO";
import { ConversationApiResponse } from "./DTO/Response/ConversationApiResponse.dto";
import { Conversation } from "./Schemas/Conversation.schema";
import { UserResponseService } from "../users/UserResponse.service";
import { ChatService } from "../chat/chat.service";
import { CreateConversationSokcet } from "./DTO/Response/CreateConversationSokect.dto";
import { PopulatedConversation } from "./Schemas/types";
import { MessageResponseService } from "../Message/MessageResponse.service";
import { MessageService } from "../Message/Message.service";
import { MessageStatus } from "../Message/typs/MessageStatus";
@Injectable()
export class ConversationResoponseService{
    constructor(
        private readonly ConversationService : ConversationService ,
        private readonly UserresponseService : UserResponseService ,
        private readonly UserService         : UserService         ,
        private readonly MessageRes          : MessageResponseService         ,
        private readonly Messageservice      : MessageService                 ,

        @Inject(forwardRef(() => ChatService))
        private readonly ChateService: ChatService,
    ){}

    public async CreateConversationApi( ID : string , Data : CreateConversationDto ):Promise<ConversationApiResponse>{
        const conv = await this.ValidCreate(ID , Data);
        return this.prepareConvDataForApiRespone(conv , ID)
    }
    public async GetUserConversationsApi(userid : string) : Promise<ConversationApiResponse[]>{
        const conversations = await this.ConversationService.FullData(userid)
        const result        = await Promise.all(conversations.map(async (conversation) => 
            {
                return this.prepareConvDataForApiRespone(conversation, userid);
            }));
        return result;
    }
    public async GetConversationApi( userid:string , id: string):Promise<ConversationApiResponse>{
        const conv = await this.ConversationService.getConversationByID( id , userid);
        return this.prepareConvDataForApiRespone(conv ,id)
    }
    public async ValidCreate(ID : string , Data : CreateConversationDto):Promise<PopulatedConversation>{
        const user = await this.UserService.GetUserByID(Data.userId)
        const me   = await this.UserService.GetUserByID(ID)
        const conv = await this.ConversationService.CreateOneToOne(ID , Data.userId);
        return conv ;
    }
    public prepareConvDataForApiRespone(conv : PopulatedConversation , userid : string):ConversationApiResponse{
        const user = conv.participants.find(user => user._id.toString() !== userid)!;
        return {
            "id"             : conv._id.toString(),
            "user"           : this.UserresponseService.PerpareForginUserForResponse(user),
            "online"         : this.ChateService.IsUserOnline(user._id.toString()),
            "lastmessage"    : conv.Lastmessage ? this.MessageRes.PrepareMessageDataForResponse(conv.Lastmessage) : null,
            "unread" : conv.Unread.get(user._id.toString()) ?? 0        
        }
    }


    public async ConversationOpened(reciverid : string  , convid:string){
        await  this.ConversationService.MakeUnReadZero(convid , reciverid)
    }
    public async messageSend(userid : string  , convid:string){
        await  this.ConversationService.IncreaseUnread(convid  , userid)

    }


}
