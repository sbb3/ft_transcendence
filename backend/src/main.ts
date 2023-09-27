import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as morgan from 'morgan';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    credentials : true,
    origin : process.env.FRONT_URL,
    allowedHeaders : 'Authorization, Content-Type, Content-Length',
    methods : 'GET, PUT, DELETE, POST'
  });
  app.use(cookieParser());
  app.use(morgan('dev'));
  await app.listen(3000);
}
bootstrap();
