import { MessageStatus } from "../../../Message/typs/MessageStatus";

export class ChangeMessageStateResponseDto{
    State          : MessageStatus 
    Conversation   : string 
    MessageID      : string 
}