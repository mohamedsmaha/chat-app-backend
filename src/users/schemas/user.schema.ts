import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { BaseMongoEntity } from '../../Utility/mongooseEntity';


@Schema()
export class User extends BaseMongoEntity {
  @Prop({ required: true, unique: true, trim: true, lowercase: true })
  email: string;

  @Prop({ required: true, trim: true })
  username: string;

  @Prop({ required: true ,select : false})
  password: string; 

  @Prop({default : false })
  AccountVerified : boolean

  @Prop({type : String, default : null})
  profileImage?: string | null;

  @Prop({
    type: {
      VerfiyToken : { type: String },
      ResetPass   : { type: String },
    },
    required: false, select :false
  })
  token?: {
    VerfiyToken?: string;
    ResetPass  ?: string;
  };


}

export const UserSchema = SchemaFactory.createForClass(User);
