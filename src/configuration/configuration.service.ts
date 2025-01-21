import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { readFileSync } from "fs";
import path from "path";

@Injectable()
export class ConfigurationService {
  private readonly logger = new Logger(ConfigurationService.name, {
    timestamp: true,
  });
  private DISCORD_CLIENT_ID: string;
  private DISCORD_CLIENT_SECRET: string;
  private DISCORD_REDIRECT_URI: string;

  constructor(private configService: ConfigService) {
    this.DISCORD_CLIENT_ID = this.configService.get("DISCORD_CLIENT_ID");
    this.DISCORD_CLIENT_SECRET = this.configService.get(
      "DISCORD_CLIENT_SECRET",
    );
    this.DISCORD_REDIRECT_URI = this.configService.get("DISCORD_REDIRECT_URI");
    this.logger.log("Config loaded");
  }

  getDiscordClientId(): string {
    return String(this.DISCORD_CLIENT_ID);
  }

  getDiscordClientSecret(): string {
    return String(this.DISCORD_CLIENT_SECRET);
  }

  getDiscordRedirectUri(): string {
    return this.DISCORD_REDIRECT_URI;
  }
}
