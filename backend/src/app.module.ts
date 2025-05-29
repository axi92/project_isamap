import { Module } from "@nestjs/common";
import { AppController } from "./app.controller.js";
import { AppService } from "./app.service.js";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { GatewayModule } from "./gateway/gateway.module";
import { LowdbService } from "./lowdb/lowdb.service";
import { AuthModule } from "./auth/auth.module";
import { ConfigModule } from "@nestjs/config";
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    GatewayModule,
    AuthModule,
    UsersModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "client/dist"),
    }),
  ],
  controllers: [AppController],
  providers: [AppService, LowdbService],
})
export class AppModule {}
