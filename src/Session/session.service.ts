import { Injectable, UnauthorizedException } from "@nestjs/common";
import { Session } from "./schemas/session.schema";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class SessionService {

  constructor(
    @InjectModel(Session.name)
    private readonly sessionModel: Model<Session>,
  ) {}

  async create( userId: string) {
    return this.sessionModel.create({userId});
  }

  async getByID(id : string) {
        const session = await this.sessionModel.findById(id);
        if (!session) {
            throw new UnauthorizedException('Invalid session');
        }
        return session;
    }

  async deleteByid(id : string) {
    return this.sessionModel.findByIdAndDelete( id  );
  }
}