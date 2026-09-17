import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { EmailModule } from './email/email.module';
import { Schema as MongooseSchema } from 'mongoose';
import cookieConfig from './config/cookie.config';
import { AuthModule } from './Auth/Auth.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ConversationModule } from './Conversation/Conversation.module';
import { SessionModule } from './Session/Session.module';
import { MessageMoudle } from './Message/Message.module';
import { ChatModule } from './chat/chat.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load : [cookieConfig]
    }),

    MongooseModule.forRootAsync({
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
            uri: configService.get<string>('MONGODB_URI'),

        connectionFactory: (connection) => {
            connection.plugin((schema: MongooseSchema) => {
            schema.set('timestamps', true);
          });

      return connection;
    },
  }),
    }),
    UsersModule,
    EmailModule,
    AuthModule ,
    SessionModule,
    ConversationModule,
    MessageMoudle,
    ChatModule
  ],

})
export class AppModule {}
