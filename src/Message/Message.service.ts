import { Injectable, NotFoundException } from "@nestjs/common";
import { Message } from "./Schemas/Message.schema";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { FindMessagesDTO } from "./DTO/FindMessage.dto";
import { ConversationService } from "../Conversation/Conversation.service";
import { MessagePaginationDTO } from "./DTO/MessagePaginationDTO";
import { MessagePaginationApiResponseDTO } from "./DTO/Response/MessagePaginationApiResponse.dto";
import { message } from "../Utility/messageRes";
import { MessageApiResponseDTO } from "./DTO/Response/MessageApiResponse.dto";
import { CreateMessageDTO } from "./DTO/CreateMessge.dto";
import { MessageStatus } from "./typs/MessageStatus";
import { CreateMessage } from "./DTO/type/CreateMessage";

@Injectable()
export class MessageService {
    constructor(
        @InjectModel(Message.name)
        private readonly MessageModel : Model<Message>,
        
    ){}
    
    public async CreateMessage(
        userid  : string , Data : CreateMessage , reciverId:string):Promise<Message>{
        let message = await this.MessageModel.create({
            "content"        : Data.content , 
            "conversationId" : Data.conversationId,
            "senderId"       : userid ,
            "state"          : Data.status,
            "receiverId"     : reciverId 
        })
        return message ;
    }
    public async GetConvMessges( conversationId: string, filter: MessagePaginationDTO,):Promise<Message[]> {
        const { limit = 20, cursor } = filter;
        const query: any = {conversationId,};

        if (cursor) {
            const [createdAt, messageId] = cursor.split('|');

            query.$or = [
            {
                createdAt: {
                $lt: new Date(createdAt),
                },
            },
            {
                createdAt: new Date(createdAt),
                _id: {
                $lt: messageId,
                },
            },
            ];
        }

        const messages = await this.MessageModel.find(query).sort({createdAt: -1,_id: -1,}).limit(limit + 1);
        return messages;

    }
    public async GetMessagesBy(conversationId : string , Messages : MessageStatus):Promise<number>{
        return await this.MessageModel
            .countDocuments({
                conversationId : conversationId,
                state          : Messages,
            })
            .sort({
                state : -1  
            })
            .exec();
    }
    public async MarkMessagesAs(receiverId: string, OldStatus: MessageStatus , NewStatus : MessageStatus , Convid?:string): Promise<Message[]> {
        const query: any = {
            receiverId,
            state: OldStatus,
        };

        if (Convid) {
            query.conversationId = Convid;
        }

        const messages = await this.MessageModel
        .find(query)
        .exec();

        await this.MessageModel.updateMany(
            {receiverId,state: OldStatus},
            {$set: {state: NewStatus},},
        ).exec();

        messages.forEach(message => {
            message.state = MessageStatus.delivered;
        });

        return messages;
    }

}