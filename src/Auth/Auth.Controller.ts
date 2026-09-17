import { Body, Controller, Get, Param, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { RegisterUserDto } from './DTO/register_user.dto';
import { message } from '../Utility/messageRes';
import { linktype } from '../Utility/Linktype';
import { LoginUserDto } from './DTO/Login_user.dto';
import type { JWTAccessPayloType, SendingToken } from '../Utility/Jwt';
import { ResetPasswordDto } from './DTO/Reset_Password.dto';
import { VerifyEmailDto } from './DTO/VerifyEmail.dto';
import { AuthGuard } from './Guards/Auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from './Decorators/Current_user.decorator';
import { ConfigService } from '@nestjs/config';
import type { Request, Response } from 'express';
import { AuthService } from './Auth.service';
@Controller('api/auth')
export class AuthController {

  constructor(
    private readonly AuthService: AuthService,
    private readonly config :ConfigService,
    
  ) {}

    @Post("Register")
    public async Register(@Body() Data : RegisterUserDto): Promise<message>{
      return await this.AuthService.Register(Data);
    }

    @Get(`${linktype.verify}/:id/:token`)
    public async verifyaccount(
      @Param("id")    id     :  string  ,
      @Param("token") token  :  string
    ):Promise<message>{
      return await this.AuthService.Verifyaccount(id , token);
    }

    @Post(`${linktype.verify}`)
    public VerifyEmail(
        @Body() Data : VerifyEmailDto
    ):Promise<message>{
        return this.AuthService.VerifyEmail(Data);
    }

    @Post('Login')
    public async Login(
      @Body() Data: LoginUserDto,
      @Res({ passthrough: true }) res: Response,
    ): Promise<SendingToken> {

        return await this.AuthService.Login(Data ,  res);

      

    }

    @Post(`${linktype.ResetPass}`)
    public async ForgotPassword(
      @Body() Data : VerifyEmailDto
    ):Promise<message>{
      return this.AuthService.ForgotPassword(Data);
    }

    @Get(`${linktype.ResetPass}/:id/:token`)
    public async CheckPasswordToken(
      @Param("id") id : string ,
      @Param("token") token : string
    ):Promise<message>{
      return this.AuthService.CheckPasswordToken(id , token);
    }
    
    @Post(`${linktype.ResetPass}/:id/:token`)
    public async ResetPassword(
      @Param("id") id : string ,
      @Param("token") token : string,
      @Body() Data : ResetPasswordDto
    ):Promise<message>{
      return await this.AuthService.ResetPassword(id , token , Data);
    }
    
    @Post('Logout')
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    public async Logout(
        @Req() req: Request ,
        @Res({ passthrough: true }) res: Response,
        @CurrentUser() Payload : JWTAccessPayloType ):Promise<message>{
      return await this.AuthService.Logout(Payload,req ,res);
    }

    @Post("Refresh")
    public async Refresh(
       @Req() req: Request ,
       @Res({ passthrough: true }) res: Response
    ){
        return this.AuthService.Refresh(req , res);
    }
  

  
}