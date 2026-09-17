import { Types } from "mongoose";

export abstract class BaseMongoEntity {
  createdAt!: Date;
  updatedAt!: Date;
  _id!: Types.ObjectId;  
}