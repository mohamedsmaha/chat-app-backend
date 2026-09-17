
import {
    BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { ConfigService } from "@nestjs/config";

import * as bcrypt from 'bcrypt';
import { message } from '../Utility/messageRes';
import { JwtService } from "@nestjs/jwt";
import {  JWTAccessPayloType, JWTRefreshPayloadType, SendingToken, TokenObject } from '../Utility/Jwt';
import { Apiresponse } from '../Utility/ApiResponse';
import { linktype } from '../Utility/Linktype';
import { randomBytes } from 'crypto';
import { EmailService } from '../email/email.service';
import { LoginUserDto } from './DTO/Login_user.dto';
import { VerifyEmailDto } from './DTO/VerifyEmail.dto';
import { ResetPasswordDto } from './DTO/Reset_Password.dto';
import { SessionService } from '../Session/session.service';
import { StringValue } from 'ms';
import { UserService } from '../users/users.service';
import { CreateUserDto } from '../users/DTO/CreateUserData.dto';
import { Request, Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly Jwt : JwtService,
    private readonly config :ConfigService,
    private readonly Email  : EmailService,
    private readonly Session: SessionService,
    private readonly UserService : UserService

  ) {}


    public async Register(Data: CreateUserDto): Promise<message> {
        const user = await this.UserService.Create(Data)
        return await this.VerifyEmail({email : Data.email});
    }
    public async Verifyaccount( id : string , token : string ):Promise<message>{
        const user = await this.UserService.GetUserWithTokens(id);
        if(user.token?.VerfiyToken !== token){throw new UnauthorizedException('Invalid verification token');}
        user.AccountVerified = true ;
        user.token = {}
        await user.save()
        return {'message' : Apiresponse.Verification}
    }
    public async Login(Data : LoginUserDto , res : Response ):Promise<SendingToken>{
        let user = await this.UserService.GetUserBy({email : Data.email})
        if(!user){throw new BadRequestException("Email Or Password is wrong");}
        user = await this.UserService.GetUserWithPassword(user.id);
        const match = await bcrypt.compare(Data.password , user.password);
        if(! match){throw new BadRequestException("Email Or Password is wrong")}
        if(!user.AccountVerified){
            throw new ForbiddenException('Please verify your email before logging in');
        }
        let session   = await this.Session.create(user.id);
        const Refresh = await this.generateRefreshToken({sub: user.id,session_id: session.id,});
        const Access  = await this.generateAccessToken({sub: user.id});
        session.RefreshToken = Refresh;
        await session.save()
        this.setCookie(res , Refresh)
        return {"access" : Access}
        

    }
    public async ForgotPassword(Data : VerifyEmailDto):Promise<message>{
        let user = await this.UserService.GetUserBy({email : Data.email})
        if(!user){throw new BadRequestException("Email Or Password is wrong");}
        user = await this.UserService.GetUserWithTokens(user.id);
        user.token = {
            ...user.token , 
            "ResetPass" : this.GenerateRandomToken()
        }
        await user.save()
        const link = this.GenerateLink(user.id , user.token.ResetPass as string , linktype.ResetPass)
        await this.Email.SendResetPassEmail(user.email , link); 
        return {"message" : Apiresponse.VerifyEmailForResetPass}       
    }
    public async ResetPassword(id :string , token : string , Data : ResetPasswordDto):Promise<message>{
        const user = await this.ValidPasswordToken(id , token)
        user.password =await this.UserService.Hash(Data.password)
        delete user.token!.ResetPass
        user.save();

        return {"message" : Apiresponse.ResetPassword}

    }
    public async CheckPasswordToken(id:string , token:string):Promise<message>{
        await this.ValidPasswordToken(id,  token)
        return {message : Apiresponse.CheckPasswordtoken}
    }  
    public async Logout(Accesspayload : JWTAccessPayloType , req:Request , res:Response ) : Promise<message>{
        const {payload , token } = await this.GetRefreshToken(req);
        const session            = await this.Session.getByID(payload.session_id)
        session.revoked          = true
        await session.save();
        this.clearRefreshTokenCookie(res)
        return {"message" : Apiresponse.Logout}
    }
    public async VerifyEmail(Data : VerifyEmailDto) : Promise<message>{
        const user = await this.UserService.GetUserBy({email : Data.email})
        if(!user) throw new BadRequestException("Email Not Found")
        if(user.AccountVerified) throw new BadRequestException("Account Already verified")
        user.token = {VerfiyToken : this.GenerateRandomToken()}
        await user.save();

        let link = this.GenerateLink(user.id , user.token?.VerfiyToken as string ,linktype.verify );
        await this.Email.SendVerifyEmail(user.email , link);

        return {message : Apiresponse.Verification}
    }
    public async Refresh(req : Request , res : Response):Promise<SendingToken>{
        let {payload , token} = await this.GetRefreshToken(req);

       let session = await this.Session.getByID(payload.session_id);

        if (session.revoked && payload.sub !== session.userId.toString()) {
            this.clearRefreshTokenCookie(res)
            throw new UnauthorizedException('Session has been revoked');
        }

        if (session.RefreshToken !== token ) {  
            session.revoked = true ;    
            await session.save();
            this.clearRefreshTokenCookie(res)
            throw new UnauthorizedException('Invalid refresh token');
        }


        const Refresh        = await this.generateRefreshToken({sub : payload.sub   , session_id :payload.session_id});
        const Access         = await this.generateAccessToken({sub: payload.sub});
        session.RefreshToken = Refresh;
        await session.save()
        this.setCookie(res , Refresh);
        return { "access" : Access}

    }

    private async GetRefreshToken(req:Request  ) : Promise<{ token: string , payload : JWTRefreshPayloadType }> {
        const token = req.cookies.refreshToken;
        if (!token) { throw new UnauthorizedException('Refresh token not found');}

        let payload: JWTRefreshPayloadType;
        try {payload = await this.Jwt.verifyAsync(token, {secret: this.config.getOrThrow<string>('REFRESH_TOKEN_SECRET')}); } 
        catch (error) { throw new UnauthorizedException("Invalid Token");}
        
        return {payload , token};

    }
    private clearRefreshTokenCookie(res: Response): void {
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: this.config.get<boolean>('cookie.secure'),
            sameSite: this.config.get<'lax' | 'none' | 'strict'>(
            'cookie.sameSite',
            ),
        });
    }
    private setCookie(res:Response ,  token : string){
        const secure = this.config.get<boolean>('cookie.secure');
      const sameSite = this.config.get<'lax' | 'none' | 'strict'>(
        'cookie.sameSite',
      );

      res.cookie('refreshToken', token, {
        httpOnly: true,
        secure,
        sameSite,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
    }
    private GenerateLink(id : string  , token : string , type :linktype){
        const link = `${this.config.get<string>("DOMAIN")}/api/auth/${type}/${id}/${token}`;
        return link
    }
    private GenerateRandomToken(): string{
        return randomBytes(32).toString('hex')
    }
    private async ValidPasswordToken(id:string , token : string){
        const user = await this.UserService.GetUserWithTokens(id);
        if(user.token?.ResetPass== null || user.token.ResetPass != token){throw new BadRequestException("Invalid or expired reset token");}
        return user
    }
    private async generateRefreshToken(payload: JWTRefreshPayloadType,): Promise<string> {
        return this.Jwt.signAsync(payload, {
            secret: this.config.getOrThrow<string>('REFRESH_TOKEN_SECRET'),
            expiresIn: this.config.getOrThrow<StringValue>(
            'REFRESH_TOKEN_EXPIRES_IN',
            ),
        });
    }
    private async generateAccessToken(payload: JWTAccessPayloType,): Promise<string> {
    return this.Jwt.signAsync(payload, {
        secret: this.config.getOrThrow<string>('ACCESS_TOKEN_SECRET'),
        expiresIn: this.config.getOrThrow<StringValue>(
        'ACCESS_TOKEN_EXPIRES_IN',
        ),
    });
    }

}

