import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { CreateConversationDto } from "./DTO/Create_Conversation.DTO";
import { AuthGuard } from "../Auth/Guards/Auth.guard";
import { ApiBearerAuth } from "@nestjs/swagger";
import { CurrentUser } from "../Auth/Decorators/Current_user.decorator";
import type{ JWTAccessPayloType } from "../Utility/Jwt";
import { ConversationService } from "./Conversation.service";
import { ConversationApiResponse } from "./DTO/Response/ConversationApiResponse.dto";
import { ConversationResoponseService } from "./ConversationResponse.service";
@Controller("api/Conversations")
export  class ConversationController{
    constructor(
        private readonly ConvService : ConversationResoponseService
    ){}
    @Post()
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    public async CreateConversation( 
        @CurrentUser() payload : JWTAccessPayloType  , 
        @Body()        Data : CreateConversationDto): Promise<ConversationApiResponse>
    {
        return await this.ConvService.CreateConversationApi( payload.sub , Data)
    }
    
    @Get()
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    public async GetUserConversations(
        @CurrentUser() payload : JWTAccessPayloType
    ):Promise<ConversationApiResponse[]>{
        return await this.ConvService.GetUserConversationsApi(payload.sub)

    }
    @Get(":id")
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    public GetConversation(
        @CurrentUser() payload : JWTAccessPayloType  ,
        @Param("id") id: string
    ):Promise<ConversationApiResponse>{
        return this.ConvService.GetConversationApi(payload.sub , id)
    }
}