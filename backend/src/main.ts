import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    credentials : true,
    origin : 'http://localhost:5173',
    allowedHeaders : 'Authorization, Content-Type, Content-Length',
    methods : 'GET, PUT, DELETE, POST'
  });
  await app.listen(3000);
}
bootstrap();
