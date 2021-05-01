import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: true,
  });

  const options = new DocumentBuilder()
    .setTitle('FusionAuth API Demo')
    .setDescription('A demonstration on how to use FusionAuth with NestJs.')
    .setVersion('0.0.1')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/api', app, document);

  app.enableCors();
  app.use(cookieParser());

  const configService = app.get(ConfigService);
  await app.listen(configService.get('NEST_SERVER_PORT') || 9000);
}

bootstrap();
