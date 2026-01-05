/* eslint-disable import/namespace */
import * as session from 'express-session';
import * as passport from 'passport';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigurationService } from './configuration/configuration.service';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['fatal', 'error', 'warn', 'log', 'debug'],
  });

  // Get ConfigurationService from Nest application context
  const configService = app.get(ConfigurationService);
  const sessionSecret = configService.getSessionSecret();
  const isProd = process.env.NODE_ENV === 'production';
  console.log('Production?' + isProd);

  const sessionStore = app.get('SESSION_STORE');

  const corsOptions: CorsOptions = {
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      const allowedOrigins = [
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'https://asamap.axi92.at',
      ];

      if (!origin) {
        return callback(null, true);
      }
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  };
  app.enableCors(corsOptions);

  app.use(
    session({
      store: sessionStore, // Redis in prod, MemoryStore in dev
      secret: sessionSecret,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // true when prod
        maxAge: 1000 * 60 * 60 * 24, // 1 day
        sameSite: 'lax',
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
