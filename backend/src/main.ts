import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module.js";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();
  app.setGlobalPrefix("api/v1");
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,      // Strip unknown properties
    forbidNonWhitelisted: true,  // Throw error if extra properties are sent
    transform: true,       // auto-transform to DTO class
  }));
  await app.listen(3000);
}
bootstrap();
