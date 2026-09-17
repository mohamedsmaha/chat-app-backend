import { TypeIndicatorDto } from "../Typeindicator.dto";
import { UserOnlineDTO } from "../UserOnline.dto";
import { CreateConversationDto } from "../../../Conversation/DTO/Create_Conversation.DTO";
import { CreateMessageDTO } from "../../../Message/DTO/CreateMessge.dto";
import { SocketEvents } from "./Events";
import { ChatMovement } from "../ChatMovement.dto";

export interface ClientToServerEvents {
    [SocketEvents.on.CreateConversation]: CreateConversationDto ;
    [SocketEvents.on.Conversation_list]  :void 
    [SocketEvents.on.NewMassage]         :CreateMessageDTO
    [SocketEvents.on.user_typing]        :TypeIndicatorDto
    [SocketEvents.on.TypingStop]         :TypeIndicatorDto
    [SocketEvents.on.Online]             :UserOnlineDTO,
    [SocketEvents.on.EnterChat]          :ChatMovement,

}
