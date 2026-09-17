import { Body, Controller, Get, Post, Put, Query, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '../Auth/Guards/Auth.guard';
import type { JWTAccessPayloType } from '../Utility/Jwt';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { UserResponseDto } from './DTO/UserResponse.dto';
import { UpdateUserDTO } from './DTO/UpdateUser.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentUser } from '../Auth/Decorators/Current_user.decorator';
import type {Response } from 'express';
import { UserResponseService } from './UserResponse.service';
import { UserSearchFilterDTO } from './DTO/UserSearchFilter.dto';

@Controller('api/users')
export class UserController {

  constructor(
    private readonly userService : UserResponseService
    
  ) {}
  @Get("me")
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  public GetUser(@CurrentUser() payload : JWTAccessPayloType): Promise<UserResponseDto>{
      return this.userService.GetUserApiResponse(payload.sub);
  }
  
  @Put("me")
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  public UpdateUser(
    @Body()        Data    : UpdateUserDTO,
    @CurrentUser() payload : JWTAccessPayloType ) : Promise<UserResponseDto>{
      return this.userService.UpdateUserApiResponse(payload.sub  , Data);
  }

  @Post("upload-image")
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor("user-image"))
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        'user-image': {
          type: 'string',
          format: 'binary',
        },
      },
      required: ['user-image'],
    },
  })
  public async uploadimage(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() Payload: JWTAccessPayloType,
  ):Promise<UserResponseDto>{
      return await this.userService.SetProfileImageApiResponse(Payload.sub ,file.filename);
  }

  @Post("remove-image")
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  public async deleteimage(
    @CurrentUser() payload : JWTAccessPayloType
  ):Promise<UserResponseDto>{
    return await this.userService.RemoveProfileImageApiResponse(payload.sub)
  }

  
  @Get("Profile-image")
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  public async showProfileImage(
    @CurrentUser() payload :JWTAccessPayloType,
    @Res() res: Response,
  ) {
    const path  = await this.userService.GetProfileImageApiResponse(payload.sub);
    
    return res.sendFile(path.profileImage , {
      root: "images/users",
    });
  }



  @Get('search')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  public Search(
    @Query() filter: UserSearchFilterDTO,
    @CurrentUser() payload: JWTAccessPayloType,
  ) {
    return this.userService.SearchApiResponse(
      payload.sub,
      filter,

    );
  }


  
}