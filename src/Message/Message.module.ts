import { forwardRef, Module} from "@nestjs/common";
import { MessageController } from "./Message.controller";
import { MessageService } from "./Message.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Message, MessageSchema } from "./Schemas/Message.schema";
import { AuthModule } from "../Auth/Auth.module";
import { SessionModule } from "../Session/Session.module";
import { ConversationModule } from "../Conversation/Conversation.module";
import { MessageResponseService } from "./MessageResponse.service";

@Module({
    controllers :[MessageController],
    providers   :[MessageService , MessageResponseService  ],
    imports     :[
        MongooseModule.forFeature([
                {
                name: Message.name,
                schema: MessageSchema,
                },
        ]),
        AuthModule,
        SessionModule,
        forwardRef(() => ConversationModule)
    ],
    exports :[MessageService , MessageResponseService]
})
export class MessageMoudle {}