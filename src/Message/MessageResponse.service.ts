import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { MessageApiResponseDTO } from "./DTO/Response/MessageApiResponse.dto";
import { Message } from "./Schemas/Message.schema";
import { CreateMessageDTO } from "./DTO/CreateMessge.dto";
import { MessageService } from "./Message.service";
import { ConversationService } from "../Conversation/Conversation.service";
import { MessagePaginationDTO } from "./DTO/MessagePaginationDTO";
import { SearchResponseDTO } from "../Utility/SearchPaginationResponse.dto";
import { ConversationMessageCount } from "./DTO/ConversationMessagesCount.dto";
import { MessageStatus } from "./typs/MessageStatus";
import { ConversationResoponseService } from "../Conversation/ConversationResponse.service";

@Injectable()
export class MessageResponseService{
     constructor(
        private readonly MessageService : MessageService ,
        private readonly ConvService  : ConversationService,
        @Inject(forwardRef(() => ConversationResoponseService))
        private readonly ConvRes      : ConversationResoponseService,


    ){}
    public async CreateMessageApiResponse(userid  : string , Data : CreateMessageDTO):Promise<MessageApiResponseDTO>{
        const conv    = await this.ConvService.getConversationByID(Data.conversationId , userid);
        const reciver = conv.participants.find((reciver) => reciver._id.toString() != userid )!._id.toString()
        const message = await this.MessageService.CreateMessage(userid , Data , reciver)
        this.ConvRes.messageSend(reciver , Data.conversationId)
        return this.PrepareMessageDataForResponse(message);
    }
    public async GetMessagesApiResponse(UserID : string , ConvId  : string,filter : MessagePaginationDTO ):Promise<SearchResponseDTO<MessageApiResponseDTO>>{
        await this.ConvService.ValidConversation(ConvId , UserID);
        return await this.GetConvMessges(ConvId , filter)
    }
    public PrepareMessageDataForResponse(message : Message):MessageApiResponseDTO{
        return {
            id       : message._id.toString(),
            senderId : message.senderId.toString(),
            content  : message.content,
            createdAt: message.createdAt,
        }   
    }
    private async GetConvMessges( conversationId: string, filter: MessagePaginationDTO,):Promise<SearchResponseDTO<MessageApiResponseDTO>> {
        const { limit = 20, cursor } = filter;
        filter.limit + 1 
        let  messages = await this.MessageService.GetConvMessges(conversationId , filter);
        filter.limit -=1

        const hasNextPage = messages.length > limit;

        if (hasNextPage) {messages.pop();}

        const lastMessage  = messages[messages.length - 1];

        const nextCursor = 
            hasNextPage && lastMessage
            ? `${lastMessage.createdAt.toISOString()}|${lastMessage._id.toString()}`
            : null;

    return {
        data: messages.map((message) => this.PrepareMessageDataForResponse(message)),
        "pagination" : {
            "hasNextPage" : hasNextPage ,
            "limit"       : limit ,
            "nextCursor"  : nextCursor
        },
    };
    }
    public async MarkMessagesAsdelivered(userid : string):Promise<Message[]>{
        return await this.MessageService.MarkMessagesAs(userid , MessageStatus.send , MessageStatus.delivered)
    }

    public async MarkMessagesAsRead(userid :string , Convid : string):Promise<Message[]>{
        return await this.MessageService.MarkMessagesAs(userid , MessageStatus.send , MessageStatus.delivered)
    }

    public GetMessagesCountByConversation(messages: Message[],): ConversationMessageCount[] {

        const counts = new Map<string, number>();

        for (const message of messages) {
            const conversationId = message.conversationId.toString();
            counts.set(
                conversationId,(counts.get(conversationId) ?? 0) + 1,
            );
        }

        return Array.from(counts.entries()).map(
            ([conversationId, count]) => ({
                conversationId,
                count,
            }),
        );
    }   
}