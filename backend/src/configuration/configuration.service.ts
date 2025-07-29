import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ENV_VARS, ERROR_CONFIG_NOT_LOADED, WARN_CONFIG_EMPTY } from "./configuration.constants";

@Injectable()
export class ConfigurationService {
  private readonly logger = new Logger(ConfigurationService.name, {
    timestamp: true,
  });
  private DISCORD_CLIENT_ID: string;
  private DISCORD_CLIENT_SECRET: string;
  private DISCORD_REDIRECT_URI: string;

  constructor(private configService: ConfigService) {
    const discordClientID = this.configService.get(ENV_VARS.DISCORD_CLIENT_ID);
    const discordClientSecret = this.configService.get(
      ENV_VARS.DISCORD_CLIENT_SECRET,
    );
    const discordClientRedirectUri =  this.configService.get(ENV_VARS.DISCORD_REDIRECT_URI);
    // log a warning if any of the private vars are not set 
    if (!discordClientID || !discordClientSecret || !discordClientRedirectUri) {
      this.logger.warn(WARN_CONFIG_EMPTY);
      this.logger.error(ERROR_CONFIG_NOT_LOADED)
    } else {
      this.DISCORD_CLIENT_ID = discordClientID;
      this.DISCORD_CLIENT_SECRET = discordClientSecret
      this.DISCORD_REDIRECT_URI = discordClientRedirectUri
      this.logger.log('Config loaded');
    }
  }

  // Functions for testing START!
  setDiscordClientId(clientID: string) {
    this.DISCORD_CLIENT_ID = clientID
  }

  setDiscordClientSecret(secret: string) {
    this.DISCORD_CLIENT_SECRET = secret
  }

  setDiscordRedirectUri(uri: string){
    this.DISCORD_REDIRECT_URI= uri
  }
  // Functions for testing END!

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
