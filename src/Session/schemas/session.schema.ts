import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema()
export class Session {
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  userId: Types.ObjectId;

  @Prop({
    type: String,
    default: "",
  })
  RefreshToken: string;

  @Prop({
    type: Boolean,
    default: false,
  })
  revoked: boolean;
}

export const SessionSchema = SchemaFactory.createForClass(Session);