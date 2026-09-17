import { BadRequestException, forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { UserController } from './users.controller';
import { UserService } from './users.service';
import { AuthModule } from '../Auth/Auth.module';
import { SessionModule } from '../Session/Session.module';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { UserResponseService } from './UserResponse.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
    MulterModule.register(
            {
                    storage: diskStorage({
                        destination: './images/users',
                        filename: (req, file, cb) => {
                            const perfix    = `${Date.now()}-${Math.round(Math.random() * 100000000)}`;
                            const filename  = `${perfix}-${file.originalname}`
                        cb(null, filename);
                        },
                    }),
                    fileFilter : (req , file , cb) => {
                        if(file.mimetype.startsWith('image')){cb(null , true)}
                        else{
                            cb(new BadRequestException('unsupported file') , false)
                        }
                    },
                    limits : {fileSize : 2 * 1024 * 1024}
            }
    ),
    forwardRef(() => AuthModule),
    SessionModule
  ],
  controllers : [UserController],
  providers   : [UserService , UserResponseService],
  exports     : [UserService , UserResponseService ]
  
})
export class UsersModule {}
