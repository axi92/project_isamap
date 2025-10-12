import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-discord';
import { Done } from '@/utils/types';
// import { encrypt } from '../utils/encrypt';
import { ConfigurationService } from '@/configuration/configuration.service';
import { UserCreatDto } from '@/user/dto/userCreate.dto';
import { AuthService } from './auth.service';

@Injectable()
export class DiscordStrategy extends PassportStrategy(Strategy, 'discord') {
  constructor(
    private configurationService: ConfigurationService,
    @Inject(AuthService) private authService: AuthService,
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<any> {
    const { id, username, avatar, verified } = profile;
    const user: UserCreatDto = {
      userId: id,
      username,
      avatar,
      verified,
    };
    // Looks like the default expires_in is 604800s thats 7d
    done(null, user, accessToken, refreshToken);

    // const encryptedAccessToken = encrypt(accessToken).toString();
    // const encryptedRefreshToken = encrypt(refreshToken).toString();
  }
}
