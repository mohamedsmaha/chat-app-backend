import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {  Types } from 'mongoose';
import { BaseMongoEntity } from '../../Utility/mongooseEntity';
import { MessageStatus } from '../typs/MessageStatus';


@Schema()
export class Message extends BaseMongoEntity {

  @Prop({
    type: Types.ObjectId,
    ref: 'Conversation',
    required: true,
    index: true,
  })
  conversationId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  senderId: Types.ObjectId;
    @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  receiverId:Types.ObjectId; 
  @Prop({
    type: String,
    required: true,
    trim: true,
  })
  content: string;
  @Prop({
    type: Date,
    required: false,
    default: null,
  })
  readAt: Date | null;
  @Prop({
    type     : String,
    enum     : Object.values(MessageStatus),
    required : true,
    default  : MessageStatus
  })
  state : MessageStatus
}

export const MessageSchema = SchemaFactory.createForClass(Message);

MessageSchema.index({
    conversationId: 1,
    createdAt: -1,
    _id: -1,
});

MessageSchema.index({
    receiverId: 1,
    state: 1,
});