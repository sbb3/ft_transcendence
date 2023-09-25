import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.enableCors({
    credentials : true,
    origin : 'http://localhost:5173',
    methods : 'GET, PUT, DELETE, POST',
    allowedHeaders : 'Authorization, Content-Type, Content-Length'
  });

  await app.listen(3000);

}

bootstrap();