import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import config from './configuration/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  await app.listen(config().port, () => {
    console.log(`App listening on port ${config().port}`);
  });
}

bootstrap();
