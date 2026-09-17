import { IsMongoId, IsNotEmpty } from 'class-validator';

export class UserOnlineResponseDTO {
  @IsNotEmpty()
  @IsMongoId()
  userid: string;
  Online:boolean
}