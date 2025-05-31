import { Module } from "@nestjs/common";
import { AppController } from "./app.controller.js";
import { AppService } from "./app.service.js";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { GatewayModule } from "./gateway/gateway.module";
import { AuthModule } from "./auth/auth.module";
import { ConfigModule } from "@nestjs/config";
import { UsersModule } from './user/user.module.js';
import { ServerController } from './server/server.controller';
import { ServerModule } from './server/server.module';
import { LowdbModule } from "./lowdb/lowdb.module.js";
import { UserService } from "./user/user.service.js";

@Module({
  imports: [
    ConfigModule.forRoot(),
    GatewayModule,
    AuthModule,
    UsersModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "..", "client/dist"),
    }),
    ServerModule,
    LowdbModule
  ],
  controllers: [AppController, ServerController],
  providers: [AppService, UserService],
})
export class AppModule {}
