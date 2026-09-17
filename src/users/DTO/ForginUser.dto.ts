import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId, IsNotEmpty, IsString } from "class-validator";

export class ForeignUserResponseDto {


   @ApiProperty({
     description: 'ID of the user you search for',
     example: '507f1f77bcf86cd799439011',
   })
   @IsString()
   @IsNotEmpty()
   @IsMongoId()
   id : string
  @ApiProperty({
    description: 'Username',
    example: 'Mohamed',
  })
  username: string

  @ApiProperty({
    description: 'ProfileImage',
  })
  profileImage?:string 
}