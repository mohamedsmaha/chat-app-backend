import { Body, Controller, Get, Param, Post, Query, UseGuards } from "@nestjs/common";
import { MessageService } from "./Message.service";
import { AuthGuard } from "../Auth/Guards/Auth.guard";
import { ApiBearerAuth } from "@nestjs/swagger";
import { CurrentUser } from "../Auth/Decorators/Current_user.decorator";
import type { JWTAccessPayloType } from "../Utility/Jwt";
import {CreateMessageDTO } from "./DTO/CreateMessge.dto";
import { MessagePaginationDTO } from "./DTO/MessagePaginationDTO";
import { MessagePaginationApiResponseDTO } from "./DTO/Response/MessagePaginationApiResponse.dto";
import { MessageResponseService } from "./MessageResponse.service";
import { MessageApiResponseDTO } from "./DTO/Response/MessageApiResponse.dto";
import { SearchResponseDTO } from "../Utility/SearchPaginationResponse.dto";

@Controller("api/messages")
export class MessageController{
    constructor(
        private readonly MessageService : MessageResponseService
    ){}

    @Post()
    @UseGuards(AuthGuard)
    
    @ApiBearerAuth()
    public CreateMessage(
        @CurrentUser() Payload : JWTAccessPayloType , 
        @Body()        Data    : CreateMessageDTO
    ):Promise<MessageApiResponseDTO>{
        return this.MessageService.CreateMessageApiResponse(Payload.sub , Data);
    }

    @Get(":ConversationId")
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    public GetMessages(
        @CurrentUser  () Payload : JWTAccessPayloType         ,
        @Param("ConversationId") ConvId  : string             ,
        @Query        () filter  : MessagePaginationDTO       ,
    ):Promise<SearchResponseDTO<MessageApiResponseDTO>>{
        return this.MessageService.GetMessagesApiResponse(Payload.sub ,ConvId , filter )
    }
}