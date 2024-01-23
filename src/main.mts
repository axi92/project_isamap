import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.mts';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('rest'); // New
  await app.listen(3000);
}
bootstrap();
