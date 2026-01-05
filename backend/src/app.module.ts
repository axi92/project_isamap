import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { ServeStaticModule } from '@nestjs/serve-static';
// import { join } from 'path';
import { GatewayModule } from './event/event.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './user/user.module';
import { ServerController } from './server/server.controller';
import { ServerModule } from './server/server.module';
import { LowdbModule } from './lowdb/lowdb.module';
import { UserService } from './user/user.service';
import { ScheduleModule } from '@nestjs/schedule';
import { RedisModule } from './redis/redis.module';
import { SessionStoreProvider } from './redis/session-store.provider';

@Module({
  imports: [
    ConfigModule.forRoot(),
    RedisModule.forRoot(),
    GatewayModule,
    AuthModule,
    UsersModule,
    // ServeStaticModule.forRoot({
    //   rootPath: join(__dirname, '..', '..', 'client/dist'),
    // }),
    ServerModule,
    LowdbModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController, ServerController],
  providers: [AppService, SessionStoreProvider, UserService],
  exports: ['SESSION_STORE'],
})
export class AppModule {}
