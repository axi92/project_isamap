import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class ConfigurationService {
  private readonly logger = new Logger(ConfigurationService.name, {
    timestamp: true,
  });
  private DISCORD_CLIENT_ID: string;
  private DISCORD_CLIENT_SECRET: string;
  private DISCORD_REDIRECT_URI: string;

  constructor(private configService: ConfigService) {
    const discordClientID = this.configService.get("DISCORD_CLIENT_ID");
    const discordClientSecret = this.configService.get(
      "DISCORD_CLIENT_SECRET",
    );
    const discordClientRedirectUri =  this.configService.get("DISCORD_REDIRECT_URI");
    if(discordClientID == undefined) {
      throw new Error("Some config not set! Check for: DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET, DISCORD_REDIRECT_URI")
    } else {
      this.DISCORD_CLIENT_ID = discordClientID;
      this.DISCORD_CLIENT_SECRET = discordClientSecret
      this.DISCORD_REDIRECT_URI = discordClientRedirectUri
      this.logger.log("Config loaded");
    }
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
