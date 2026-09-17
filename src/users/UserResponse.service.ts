import { ForeignUserResponseDto } from "./DTO/ForginUser.dto";
import { UpdateUserDTO } from "./DTO/UpdateUser.dto";
import { UserResponseDto } from "./DTO/UserResponse.dto";
import { User } from "./schemas/user.schema";
import { UserService } from "./users.service";
import { BadRequestException, Injectable } from "@nestjs/common";
import { GetProfileImageResonse } from "./DTO/GetProfileImageResonse.dto";
import { UserSearchFilterDTO } from "./DTO/UserSearchFilter.dto";
import { SearchResponseDTO } from "../Utility/SearchPaginationResponse.dto";
@Injectable()
export class UserResponseService {

    constructor(
        private readonly UserService : UserService
    ){}
    public async UpdateUserApiResponse(id: string,data: UpdateUserDTO): Promise<UserResponseDto> {
        return this.PrepareUserForResponse(await this.UserService.UpdateUser(id , data));
    }
    public async GetUserApiResponse(id : string):Promise<UserResponseDto>{
        return this.PrepareUserForResponse(await this.UserService.GetUserByID(id))
    }
    public async SetProfileImageApiResponse(id : string , file : string):Promise<UserResponseDto>{
        return this.PrepareUserForResponse(await this.UserService.SetProfileImage(id , file))
    }
    public async SearchApiResponse(id: string , filter: UserSearchFilterDTO):Promise<SearchResponseDTO<ForeignUserResponseDto>> {    
        const {username,cursor,limit = 10,} = filter;
        filter.limit += 1; 
        const users = await this.UserService.Search(filter,id)
        const hasNextPage = users.length > limit;

        if (hasNextPage) {users.pop();}

        let nextCursor: string | null = null;
        if (hasNextPage && users.length > 0) {
            const lastUser = users[users.length - 1];
            nextCursor =`${lastUser.username}|${lastUser._id.toString()}`;
        }

        return {
            data: users.map((user) => this.PerpareForginUserForResponse(user)),
            pagination: {limit,nextCursor,hasNextPage}
        };
    }
    public async RemoveProfileImageApiResponse(id : string):Promise<UserResponseDto>{
        return this.PrepareUserForResponse(await this.UserService.RemoveProfileImage(id));
    }
    public async GetProfileImageApiResponse(id : string):Promise<GetProfileImageResonse>{
        const user = await this.UserService.GetUserByID(id);
        if(user.profileImage == null){throw new BadRequestException("there is no ProfileImage")}
        return {profileImage : user.profileImage}
    }



    public  PerpareForginUserForResponse(user: User):ForeignUserResponseDto{
            const forgin : ForeignUserResponseDto= {
              username : user.username,
              id       : user._id.toString()
            }
            if(user.profileImage) forgin.profileImage = user.profileImage
            return forgin
    }
    public  PrepareUserForResponse(user : User): UserResponseDto {
    const Data :UserResponseDto= {
        email         : user.email   ,
        username      : user.username,
        id            : user._id.toString()
    }
    if(user.profileImage) Data.profileImage = user.profileImage
    return Data;
    }   
}