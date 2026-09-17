import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { WsExceptionFilter } from './Utility/WsExceptionFilter';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );

    app.use(cookieParser());
    app.enableCors({
      origin: process.env.FRONTEND_URL,
      credentials: true,
    });

    const config = new DocumentBuilder()
    .setTitle('Chat API')
    .setDescription('API documentation for the chat application')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
