/* eslint-disable import/namespace */
import * as session from 'express-session';
import * as passport from 'passport';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigurationService } from './configuration/configuration.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Get ConfigurationService from Nest application context
  const configService = app.get(ConfigurationService);
  const sessionSecret = configService.getSessionSecret();

  app.enableCors({
    origin: 'http://localhost:5173', // frontend url
    credentials: true, // Needed for cookies
  });

  app.use(
    session({
      secret: sessionSecret,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: false, // TODO: set to true if using HTTPS
        maxAge: 1000 * 60 * 60 * 24, // 1 day
      },
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
  // 🔐 Add this just once globally
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    done(null, user); // fetch user from DB if using user.id
  });

  app.enableShutdownHooks();
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip unknown properties
      forbidNonWhitelisted: true, // Throw error if extra properties are sent
      transform: true, // auto-transform to DTO class
    }),
  );
  await app.listen(3000);
}
bootstrap();
