import { MessageApiResponseDTO } from "../../../Message/DTO/Response/MessageApiResponse.dto";
import { Message } from "../../../Message/Schemas/Message.schema";
import { ForeignUserResponseDto } from "../../../users/DTO/ForginUser.dto";

export class ConversationApiResponse{
    id    : string
    user  : ForeignUserResponseDto
    online: boolean
    lastmessage : MessageApiResponseDTO |null
    unread:number
}