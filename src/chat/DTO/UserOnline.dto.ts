import { IsMongoId, IsNotEmpty } from 'class-validator';

export class UserOnlineDTO {
  @IsNotEmpty()
  @IsMongoId()
  userid: string;
}