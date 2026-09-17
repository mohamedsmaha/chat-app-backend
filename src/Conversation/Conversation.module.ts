import { forwardRef, Module, Session } from "@nestjs/common";
import { ConversationController } from "./Conversation.controller";
import { ConversationService } from "./Conversation.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Conversation, ConversationSchema } from "./Schemas/Conversation.schema";
import { UsersModule } from "../users/users.module";
import { AuthModule } from "../Auth/Auth.module";
import { SessionService } from "../Session/session.service";
import { SessionModule } from "../Session/Session.module";
import { ConversationResoponseService } from "./ConversationResponse.service";
import { ChatModule } from "../chat/chat.module";
import { MessageMoudle } from "../Message/Message.module";

@Module({
    controllers : [ConversationController],
    providers   : [ConversationService , ConversationResoponseService],
    imports     : [
        MongooseModule.forFeature([
            {
            name: Conversation.name,
            schema: ConversationSchema,
            },
        ]),
        UsersModule,
        AuthModule,
        SessionModule,
        forwardRef(() => ChatModule),
        forwardRef(() => MessageMoudle)
    ],
    exports  : [ConversationService , ConversationResoponseService]   
})
export class ConversationModule{

}