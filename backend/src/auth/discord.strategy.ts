// import { Strategy } from 'passport-local';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from './auth.service.js';
import { Profile, Strategy } from 'passport-discord';
import { Done } from '../utils/types.js';
import { encrypt } from '../utils/encrypt.js';
import { ConfigurationService } from '../configuration/configuration.service.js';
import { UserCreatDto } from '../user/dto/userCreate.dto.js';

@Injectable()
export class DiscordStrategy extends PassportStrategy(Strategy, 'discord') {
  constructor(
    @Inject(ConfigurationService)
    private configurationService: ConfigurationService,
  ) {
    super({
      clientID: configurationService.getDiscordClientId(),
      clientSecret: configurationService.getDiscordClientSecret(),
      callbackURL: configurationService.getDiscordRedirectUri(),
      scope: ['identify', 'email', 'guilds'],
    });
  }

  // Is called by the Strategy internal when validaten the OAuth token
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: Done,
  ): Promise<any> {
    const { id, username, avatar, verified } = profile;
    const user: UserCreatDto = {
      userId: id,
      username,
      avatar,
      verified,
    };
    console.log(user);
    done(null, user, accessToken, refreshToken);

    // const encryptedAccessToken = encrypt(accessToken).toString();
    // const encryptedRefreshToken = encrypt(refreshToken).toString();

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
