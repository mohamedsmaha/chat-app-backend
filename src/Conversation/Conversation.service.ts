import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { UserService } from "../users/users.service";
import { Conversation, ConversationDocument } from "./Schemas/Conversation.schema";
import { Model, ObjectId, Types } from 'mongoose';
import { CreateConversationDto } from "./DTO/Create_Conversation.DTO";
import { InjectModel } from "@nestjs/mongoose";
import { ConversationApiResponse } from "./DTO/Response/ConversationApiResponse.dto";
import { User } from "../users/schemas/user.schema";
import { PopulatedConversation } from "./Schemas/types";
import { MessageStatus } from "../Message/typs/MessageStatus";
import { Message } from "../Message/Schemas/Message.schema";
import { throws } from "assert";

@Injectable()
export class ConversationService{
    constructor(
        @InjectModel(Conversation.name)
        private readonly ConvModel  : Model<Conversation>,
    ){}
    
    /// helpful logic
    public async getConversationByID(id:string , userid : string):Promise<PopulatedConversation>{
        const conv = await this.ConvModel
        .findOne({
            _id            : id,
            participants   : userid
        })
        .populate<{ participants : User[] }>       ('participants')
        .populate<{ Lastmessage  : Message | null}>("Lastmessage")

        if(!conv){throw new NotFoundException("Conversation Not Found")}
        return conv ;
    }  
    public async ValidConversation(convid:string , userid:string):Promise<boolean>{
        const conv = await this.ConvModel.exists({
            _id          : convid,
            participants : userid
        })
        if(!conv){throw new NotFoundException("Conversation Not Found")}
        return true;
    }
    public async GetNormalConversationByID(id:string , userid : string):Promise<Conversation>{
       const conv = await this.ConvModel
        .findOne({
            _id            : id,
            participants   : userid
        })
        if(!conv){throw new NotFoundException("Conversation Not Found")}
        return conv ;
    }
    private async ExistKey(key: string){
        const conv = await this.ConvModel.exists({participantKey: key});
        if(conv) throw new BadRequestException('you Already Have this Conversation');
        return conv;
    }
    public async FullData(me: string):Promise<PopulatedConversation[]> {  
        return this.ConvModel
            .find({
                participants : me
            })
            .populate<{ participants : User[] }>("participants")
            .populate<{ Lastmessage  : Message | null}>("Lastmessage")
            .exec();
  }
    
    /////// CRUD
    public async CreateOneToOne(user1ID : string , user2ID : string):Promise<PopulatedConversation>{
        const participants   = [user1ID, user2ID].sort();
        const participantKey = participants.join('_');
        await this.ExistKey(participantKey)
        const conv = await this.ConvModel.create({
            participantKey,
            participants
        });
        return await this.Transformation(conv);
    }
    public async Transformation(conv:ConversationDocument) :Promise<PopulatedConversation> {
        const populatedConv = await conv.populate<{participants : User[];Lastmessage  : Message | null;}>([
        {path : "participants"},
        {path : "Lastmessage"}
        ]);
        return populatedConv;
    }

    public async MakeUnReadZero(
        convid: string,
        userid: string,
    ): Promise<ConversationDocument | null> {

        return await this.ConvModel.findOneAndUpdate(
            {
                _id: convid,
                participants: userid,
            },
            {
                $set: {
                    [`unread.${userid}`]: 0,
                },
            },
            {
                new: true,
            },
        ).exec();
    }
    public async IncreaseUnread(
    convid: string,
    userid: string,
    ): Promise<ConversationDocument> {

    const conve = await this.ConvModel.findOneAndUpdate(
        {
            _id: convid,
            participants: userid,
        },
        {
            $inc: {
                [`unread.${userid}`]: 1,
            },
        },
        {
            new: true,
        },
    ).exec();
    if (!conve) {
        throw new NotFoundException("Conversation not found");
    }
    return conve ;
}
    



}