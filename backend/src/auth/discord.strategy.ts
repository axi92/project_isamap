// import { Strategy } from 'passport-local';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Profile, Strategy } from 'passport-discord';
import { Done } from '../utils/types';
import { encrypt } from '../utils/encrypt';
import { ConfigurationService } from '../configuration/configuration.service';
import { UserCreatDto } from '../user/dto/userCreate.dto';

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
      // TODO: implement state and save state value for a little, state is used like a nonce
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
      accessToken,
      refreshToken,
    };
    console.log(user);
    // How do I get the expire time of the token?
    // Looks like the default expires_in is 604800s thats 7d
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
