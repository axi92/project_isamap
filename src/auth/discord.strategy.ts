// import { Strategy } from 'passport-local';
import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { AuthService } from "./auth.service.js";
import { Profile, Strategy } from "passport-discord";
import { Done } from "../utils/types.js";
import { encrypt } from "../utils/encrypt.js";
import { ConfigurationService } from "../configuration/configuration.service.js";

@Injectable()
export class DiscordStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(ConfigurationService)
    private configurationService: ConfigurationService,
  ) {
    super({
      clientID: configurationService.getDiscordClientId(),
      clientSecret: configurationService.getDiscordClientSecret(),
      callbackURL: configurationService.getDiscordRedirectUri(),
      scope: ["identify", "email"],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: Done,
  ) {
    const encryptedAccessToken = encrypt(accessToken).toString();
    const encryptedRefreshToken = encrypt(refreshToken).toString();
    // TODO: implement validateUser
    // const user = await this.authService.validateUser()
  }

  // async validate(username: string, password: string): Promise<any> {
  //   const user = await this.authService.validateUser(username, password);
  //   if (!user) {
  //     throw new UnauthorizedException();
  //   }
  //   return user;
  // }
}
