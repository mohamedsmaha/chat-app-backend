import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './Auth.Controller';
import { AuthService } from './Auth.service';
import { ConfigService } from '@nestjs/config';
import { EmailService } from '../email/email.service';
import { SessionService } from '../Session/session.service';
import { SessionModule } from '../Session/Session.module';
import { EmailModule } from '../email/email.module';
import { UsersModule } from '../users/users.module';


@Module({
  imports: [
    JwtModule.register({
      global: true,
    }),
    EmailModule,
    SessionModule,
    forwardRef(() => UsersModule)
  ],

  controllers: [AuthController,],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}