import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './DTO/CreateUserData.dto';
import * as bcrypt from 'bcrypt';
import { PasswordDto } from './DTO/Password.dto';
import { UpdateUserDTO } from './DTO/UpdateUser.dto';
import  { join } from 'path';
import { unlink } from 'fs/promises';
import { UserSearchFilterDTO } from './DTO/UserSearchFilter.dto';
import { linkSync, unlinkSync } from 'fs';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}


      /// Helper Search 
      public async Search(filter: UserSearchFilterDTO,currentUserId: string) :Promise<User[]>{
        const {username,cursor,limit = 10,} = filter;
        const query: any = {_id: { $ne: currentUserId,}};
        if (username) {
          query.username = {
            $regex: `^${username}`,
          };
        }
        if (cursor) {
          const [cursorUsername, cursorId] = cursor.split('|');

          query.$or = [
            {
              username: {
                $gt: cursorUsername,
              },
            },
            {
              username: cursorUsername,
              _id: {
                $gt: cursorId,
              },
            },
          ];
        }
        const users = await this.userModel
          .find(query)
          .sort({username: 1,_id: 1,})
          .limit(limit);
        return users ;
      }
      public async GetUserByID(id: string) {
        const user = await this.userModel.findById(id);

        if (!user) {
          throw new NotFoundException('User not found');
        }

        return user;
      }
      public async GetUserWithPassword(id: string) {
        const user = await this.userModel
          .findById(id)
          .select('+password');

        if (!user) {
          throw new NotFoundException('User not found');
        }

        return user;
      }
      public async GetUserWithTokens(id: string) {
        const user = await this.userModel
          .findById(id)
          .select('+token');

        if (!user) {
          throw new NotFoundException('User not found');
        }

        return user;
      }
      public async GetUserBy(filter: Partial<User>) {
        return await this.userModel.findOne(filter);
      }
      public async UserExistsByID(id : string){
        const user = await this.userModel.exists({_id : id});
        if(!user){throw new NotFoundException ("user not found")}
        return user ;
      }

      /// Helper
      public async Hash(password : string) : Promise<string>{
          const salt           = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(password , salt); 
          return hashedPassword;
      }

      //// Modify 
      public  async Create(Data : CreateUserDto){
        const userfromDb = await this.GetUserBy({email : Data.email})
        if (userfromDb) {throw new BadRequestException("User Already Exist");}
        const hashedPassword = await this.Hash(Data.password);

        let  user =await this.userModel.create({
            email    : Data.email    ,
            password : hashedPassword,
            username : Data.username ,
        })
        user.save();
        return user ;
      }
      public  async ResetPassword(id : string ,  Data : PasswordDto){
        const user    = await this.GetUserWithPassword(id);
        user.password = await this.Hash(Data.password)
        await user.save()
        return user ;
      }
      public  async UpdateUser(id: string,data: UpdateUserDTO,): Promise<User> {
        const user = await this.userModel.findByIdAndUpdate(
          id,
          { $set: data },
          { returnDocument: "after", runValidators: true }
        );
        if (!user) {
          throw new NotFoundException('User not found');
        }
        return user ;
      }
      public  async RemoveProfileImage(id : string):Promise<User>{
        const user = await this.GetUserByID(id);
        if(user.profileImage == null){throw new BadRequestException("there is no ProfileImage")}
        await this.DeleteImage(user.profileImage);
        user.profileImage = null;
        await user.save();
        return user ;
      }
      private async DeleteImage(path: string): Promise<void> {
          const imagePath = join(process.cwd() , `./images/users/${path}`);
          unlinkSync(imagePath);
      }
      public async SetProfileImage(id : string , path : string):Promise<User>{
        const user = await this.GetUserByID(id);
        if(user.profileImage){await this.DeleteImage(user.profileImage)}
        user.profileImage = path;
        return user.save();
      }
      
    


  
}

