import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service.js";
import { UsersModule } from "../users/users.module.js";
import { PassportModule } from "@nestjs/passport";
import { DiscordStrategy } from "./discord.strategy.js";
import { ConfigurationModule } from "../configuration/configuration.module.js";
import { AuthController } from "./auth.controller.js";

@Module({
  imports: [UsersModule, PassportModule, ConfigurationModule],
  providers: [AuthService, DiscordStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
