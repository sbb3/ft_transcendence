import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as morgan from 'morgan';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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
	app.useGlobalPipes(new ValidationPipe({
		whitelist : true
	}));


	const config = new DocumentBuilder()
    .setTitle('Api routes')
    .setDescription('This page is a reference to the api routes available')
    .setVersion('1.0')
    .build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api/routes', app, document);

	await app.listen(3000);
}

bootstrap();