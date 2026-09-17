import { Message } from "../../Message/Schemas/Message.schema";
import { User } from "../../users/schemas/user.schema";
import { Conversation } from "./Conversation.schema";

export type PopulatedConversation =
    Omit<Conversation, 'participants' | 'Lastmessage'> & {
        participants : User[];
        Lastmessage  : Message | null;
    };