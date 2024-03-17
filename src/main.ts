import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SocketIoAdapter } from './config/socket-io.adapter';

import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.enableCors();
  app.useWebSocketAdapter(new SocketIoAdapter(app));

  const config = new DocumentBuilder()
    .setTitle('Example')
    .setDescription('API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/document', app, document);

  await app.listen(3001);
}
bootstrap();
