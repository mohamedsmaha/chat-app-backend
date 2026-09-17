import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { CreateMessageDTO } from '../CreateMessge.dto';
import { MessageStatus } from '../../typs/MessageStatus';

export class CreateMessage extends CreateMessageDTO{
    status ?: MessageStatus  
}