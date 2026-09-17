import { TypeIndicatorResposneDTO } from "../Response/TypeindicatorRes.dto";
import { UserOnlineResponseDTO } from "../Response/UserOnlineRes.dto";
import { ConversationApiResponse } from "../../../Conversation/DTO/Response/ConversationApiResponse.dto";
import { MessageApiResponseDTO } from "../../../Message/DTO/Response/MessageApiResponse.dto";
import { SocketEvents } from "./Events";
import { ChangeMessageStateResponseDto } from "../Response/ChangeMessageStateResponse.dto";

export interface ServerToClientEvents {
    [SocketEvents.emit.NewConversation] : (data : ConversationApiResponse  )    => void ,
    [SocketEvents.emit.ConversationList]: (data : ConversationApiResponse[])    => void ,
    [SocketEvents.emit.NewMessage]      : (data : MessageApiResponseDTO    )    => void ,
    [SocketEvents.emit.user_typing]     : (data : TypeIndicatorResposneDTO )    => void ,
    [SocketEvents.emit.stopTyping]      : (data : TypeIndicatorResposneDTO )    => void ,
    [SocketEvents.emit.Online]          : (data : UserOnlineResponseDTO)        => void ,
    [SocketEvents.emit.MessageStatue]   : (data : ChangeMessageStateResponseDto)=> void ,
    [SocketEvents.emit.SeenConve    ]   : () => void
}
