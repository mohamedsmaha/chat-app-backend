import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { BaseMongoEntity } from "../../Utility/mongooseEntity";
import { User } from "../../users/schemas/user.schema";
import { Message } from "../../Message/Schemas/Message.schema";
import { HydratedDocument} from "mongoose";

@Schema()
export class Conversation extends BaseMongoEntity {
  @Prop({
    type: [Types.ObjectId],
    ref: 'User',
    required: true,
  })
  participants: Types.ObjectId[];

  @Prop({
    required: true,
    unique: true,
  })
  participantKey: string;
  @Prop({
    type    : Types.ObjectId,
    ref     : "Message",
    default : null
  })
  Lastmessage : Types.ObjectId | null;

  @Prop({
      type    : Map,
      of      : Number,
      default : {}
  })
  Unread : Map<string, number>;
}

export type ConversationDocument = HydratedDocument<Conversation>;
export const ConversationSchema = SchemaFactory.createForClass(Conversation);
