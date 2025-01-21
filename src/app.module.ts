import { Module } from "@nestjs/common";
import { AppController } from "./app.controller.js";
import { AppService } from "./app.service.js";
import { ServeStaticModule } from "@nestjs/serve-static"; // New
import { join } from "path"; // New
import { GatewayModule } from "./gateway/gateway.module.js";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { LowdbService } from "./lowdb/lowdb.service.js";
import { AuthModule } from "./auth/auth.module.js";
import { UsersModule } from "./users/users.module.js";
import { ConfigModule } from "@nestjs/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

@Module({
  imports: [
    ServeStaticModule.forRoot({
      // New
      rootPath: join(__dirname, "..", "client/dist"), // New
    }), // New
    GatewayModule,
    AuthModule,
    UsersModule,
    ConfigModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService, LowdbService],
})
export class AppModule {}
